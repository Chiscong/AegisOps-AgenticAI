import os

class Settings:
    PROJECT_NAME: str = "AegisOps Auth Service"
    PORT: int = int(os.getenv("PORT", "8001"))
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./auth.db"
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-aegisops-jwt-key-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120  # 2 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

settings = Settings()
