import secrets
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from passlib.context import CryptContext
from core.config import settings

logger = logging.getLogger("aegisops.auth.security")

# Băm mật khẩu với bcrypt rounds=12 đạt chuẩn an toàn cao nhất
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def generate_verification_token() -> str:
    """Sinh token ngẫu nhiên mật mã 256-bit an toàn URL cho việc xác thực email."""
    return secrets.token_urlsafe(32)

def create_access_token(subject: str, claims: Optional[Dict[str, Any]] = None, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {"sub": str(subject), "exp": expire, "iat": datetime.now(timezone.utc)}
    if claims:
        to_encode.update(claims)
        
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return {}

def dispatch_verification_email(email: str, full_name: str, token: str) -> str:
    """
    Gửi email kích hoạt tài khoản kèm URL xác thực.
    Trong môi trường kiểm thử/container, in cấu trúc email ra log bảo mật để người dùng nhấp trực tiếp.
    """
    verification_link = f"http://localhost:3000/verify-email?token={token}"
    
    email_content = f"""
    ================================================================================
    [AEGISOPS DEVSECOPS SAAS] XÁC THỰC EMAIL KÍCH HOẠT TÀI KHOẢN
    ================================================================================
    Xin chào {full_name},

    Cảm ơn bạn đã đăng ký tài khoản trên nền tảng an ninh mạng AegisOps.
    Để bảo vệ an toàn cho tổ chức và tuân thủ chính sách Zero-Trust, 
    vui lòng nhấp vào liên kết dưới đây để kích hoạt tài khoản và đăng nhập:

    >> LIÊN KẾT XÁC THỰC:
    {verification_link}

    Liên kết này có hiệu lực trong 24 giờ. Nếu bạn không thực hiện yêu cầu này,
    vui lòng bỏ qua email.
    ================================================================================
    """
    print(email_content, flush=True)
    logger.info(f"Đã phát email xác thực tới: {email} với token: {token}")
    return verification_link
