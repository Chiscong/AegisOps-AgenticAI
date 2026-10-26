import re
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    organization_name: Optional[str] = "Tổ Chức Cá Nhân"

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Mật khẩu phải có độ dài tối thiểu 8 ký tự.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa (A-Z).")
        if not re.search(r"[a-z]", v):
            raise ValueError("Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).")
        if not re.search(r"\d", v):
            raise ValueError("Mật khẩu phải chứa ít nhất 1 chữ số (0-9).")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>\-_]", v):
            raise ValueError("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...).")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class RegisterResponse(BaseModel):
    id: str
    email: str
    full_name: str
    message: str
    requires_verification: bool = True
    verification_link: Optional[str] = None

class VerifyEmailResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization_id: Optional[str] = None
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True
