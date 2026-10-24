#!/usr/bin/env python3
"""
AegisOps / congpc Remediation Generator: Tự động sinh mã vá lỗi DevSecOps
cho Nginx, Node.js (Express), Python (FastAPI) và Dockerfile Hardening.
Tác giả: CONGPC
"""

import sys
import argparse

TEMPLATES = {
    "nginx": """# ==============================================================================
# AEGIS OPS / CONGPC - NGINX HARDENING & SECURITY HEADERS CONFIGURATION
# Vị trí đặt file: /etc/nginx/conf.d/security-headers.conf (hoặc include trong block server)
# ==============================================================================

# 1. Ẩn thông tin phiên bản Nginx chống Fingerprinting
server_tokens off;

# 2. Bộ 6 Security Headers cốt lõi theo chuẩn OWASP
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;

# 3. Kích hoạt HSTS (Bắt buộc HTTPS trong 1 năm + Subdomains + Preload)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 4. Content Security Policy (CSP) chặt chẽ, chống XSS & Data Injection
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';" always;

# 5. Giới hạn dung lượng upload chống tràn buffer (Max 10MB)
client_max_body_size 10M;
""",

    "express": """// ==============================================================================
// AEGIS OPS / CONGPC - EXPRESS.JS (NODE.JS) SECURITY HARDENING
// Yêu cầu thư viện: npm install helmet cors
// ==============================================================================

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// 1. Áp dụng Helmet bảo vệ Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 2. Vá lỗi CORS Reflection: Cấu hình Whitelist tên miền tin cậy
const allowedOrigins = [
  'https://yourdomain.com',
  'https://app.yourdomain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by AegisOps CORS Policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Ẩn thông tin X-Powered-By
app.disable('x-powered-by');
""",

    "fastapi": """# ==============================================================================
# AEGIS OPS / CONGPC - FASTAPI (PYTHON) SECURITY HARDENING
# ==============================================================================

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

app = FastAPI(title="Secure AegisOps API")

# 1. Custom Middleware gắn toàn bộ Security Headers
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "object-src 'none'; "
            "frame-ancestors 'self';"
        )
        return response

app.add_middleware(SecurityHeadersMiddleware)

# 2. Cấu hình CORS an toàn (Chặn wildcard * với credentials)
ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://admin.yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
""",

    "docker": """# ==============================================================================
# AEGIS OPS / CONGPC - DOCKERFILE PRODUCTION HARDENING (ROOTLESS CONTAINER)
# ==============================================================================

FROM python:3.12-slim-bookworm AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim-bookworm AS runner
WORKDIR /app

# 1. Tạo User không có quyền root (UID 10001)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /sbin/nologin -d /app appuser

# 2. Sao chép dependencies từ builder
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup . /app

# 3. Chuyển sang người dùng rootless
USER appuser
ENV PATH="/home/appuser/.local/bin:$PATH"

# 4. Chạy ứng dụng với port non-privileged (> 1024)
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""
}

def main():
    parser = argparse.ArgumentParser(description="AegisOps / congpc Remediation Code Generator")
    parser.add_argument("-s", "--stack", required=True, choices=["nginx", "express", "fastapi", "docker", "all"],
                        help="Tech Stack cần sinh mã vá lỗi (nginx | express | fastapi | docker | all)")
    parser.add_argument("-o", "--output", help="Đường dẫn file lưu mã nguồn (tùy chọn)")
    args = parser.parse_args()

    content = ""
    if args.stack == "all":
        content = "\n\n".join(TEMPLATES.values())
    else:
        content = TEMPLATES[args.stack]

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[✓] Đã tạo thành công file vá lỗi cho stack '{args.stack}' tại: {args.output}")
    else:
        print(content)

if __name__ == "__main__":
    main()
