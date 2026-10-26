import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User, Organization
from schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    RegisterResponse,
    VerifyEmailResponse,
    ResendVerificationRequest,
)
from core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_verification_token,
    dispatch_verification_email,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    # 1. Kiểm tra email đã tồn tại chưa
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác."
        )

    # 2. Tạo Workspace/Organization mặc định
    org_slug = f"org-{uuid.uuid4().hex[:8]}"
    org = Organization(
        name=payload.organization_name or "Tổ Chức Doanh Nghiệp",
        slug=org_slug,
        plan="PRO"
    )
    db.add(org)
    db.flush()

    # 3. Sinh token xác thực email mật mã 256-bit có thời hạn 24 giờ
    token = generate_verification_token()
    token_expires = datetime.utcnow() + timedelta(hours=24)

    # 4. Tạo tài khoản người dùng với is_verified=False (Bắt buộc xác thực email)
    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        role="OWNER",
        organization_id=org.id,
        is_active=True,
        is_verified=False,
        verification_token=token,
        verification_token_expires_at=token_expires,
        failed_login_attempts=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 5. Phát email kèm liên kết kích hoạt
    verification_link = dispatch_verification_email(user.email, user.full_name, token)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "message": "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản trước khi đăng nhập.",
        "requires_verification": True,
        "verification_link": verification_link
    }

@router.get("/verify-email", response_model=VerifyEmailResponse)
def verify_email(token: str = Query(..., description="Mã token xác thực từ liên kết email"), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã token không được để trống.")

    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác thực không hợp lệ hoặc tài khoản đã được kích hoạt trước đó."
        )

    # Kiểm tra hạn của token
    if user.verification_token_expires_at and user.verification_token_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Liên kết xác thực email đã hết hạn. Vui lòng yêu cầu gửi lại email kích hoạt mới."
        )

    # Kích hoạt tài khoản và xóa token một lần
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires_at = None
    db.commit()
    db.refresh(user)

    # Tự động đăng nhập và cấp Access Token JWT ngay khi xác thực thành công
    access_token = create_access_token(
        subject=user.id,
        claims={
            "email": user.email,
            "role": user.role,
            "org_id": user.organization_id,
            "is_verified": True
        }
    )

    return {
        "message": "Xác thực email thành công! Tài khoản của bạn đã được kích hoạt bảo mật cấp cao nhất.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id,
            "is_verified": True
        }
    }

@router.post("/resend-verification")
def resend_verification(payload: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Chống User Enumeration: Luôn trả thông báo chung
        return {"message": "Nếu email tồn tại trên hệ thống, liên kết xác thực mới đã được gửi đi."}

    if user.is_verified:
        return {"message": "Tài khoản này đã được xác thực trước đó. Bạn có thể đăng nhập ngay."}

    # Sinh token mới
    token = generate_verification_token()
    user.verification_token = token
    user.verification_token_expires_at = datetime.utcnow() + timedelta(hours=24)
    db.commit()

    verification_link = dispatch_verification_email(user.email, user.full_name, token)

    return {
        "message": "Đã gửi lại email xác thực thành công. Vui lòng kiểm tra hộp thư.",
        "verification_link": verification_link
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # 1. Kiểm tra tài khoản có bị khóa do Brute-force không
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        remaining_minutes = max(1, int((user.locked_until - datetime.utcnow()).total_seconds() / 60))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Tài khoản đang tạm khóa an ninh do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau {remaining_minutes} phút."
        )

    # 2. Kiểm tra mật khẩu
    if not user or not verify_password(payload.password, user.hashed_password):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác."
        )

    # 3. Kiểm tra trạng thái hoạt động
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản này đã bị tạm khóa. Vui lòng liên hệ quản trị viên."
        )

    # 4. BẮT BUỘC XÁC THỰC EMAIL TRƯỚC KHI ĐĂNG NHẬP
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản chưa được xác thực email. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) để nhấp vào liên kết kích hoạt trước khi đăng nhập."
        )

    # 5. Đăng nhập thành công -> Reset số lần đăng nhập sai
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()

    token = create_access_token(
        subject=user.id,
        claims={
            "email": user.email,
            "role": user.role,
            "org_id": user.organization_id,
            "is_verified": user.is_verified
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id,
            "is_verified": user.is_verified
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yêu cầu tiêu đề Authorization: Bearer <token>"
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng.")

    return user
