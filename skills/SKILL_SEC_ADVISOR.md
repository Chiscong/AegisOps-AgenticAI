---
name: skill-sec-advisor
description: Năng lực tư vấn DevSecOps, sinh mã vá lỗi tự động (Remediation Code Snippets) cho Nginx, Express, FastAPI, Django, Next.js và viết báo cáo tóm tắt cấp điều hành.
---

# SKILL: DevSecOps Advisory & Remediation Generator (Advisory Agent)

## 1. Mục đích & Vai trò
Kỹ năng này trao quyền cho **Advisory Agent** hoạt động như một Senior DevSecOps Consultant. Thay vì chỉ đưa ra lời khuyên lý thuyết sáo rỗng, Agent sinh trực tiếp các đoạn mã cấu hình cụ thể (Drop-in Code Snippets) có thể sao chép và đưa vào production ngay lập tức.

## 2. Năng lực Sinh Mã Vá Lỗi Đa Nền tảng (Supported Frameworks & Stacks)

### Trường hợp 1: Cấu hình Web Server Nginx (Reverse Proxy)
Khi phát hiện thiếu Security Headers hoặc lộ Server Banner:
```nginx
# Cấu hình vá lỗi tự động cho file /etc/nginx/conf.d/security.conf
server_tokens off;

# Thêm bộ 6 Security Headers chuẩn OWASP
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; frame-ancestors 'self';" always;
```

### Trường hợp 2: Node.js / Express.js Backend
Sử dụng thư viện `helmet` và cấu hình CORS chặt chẽ:
```javascript
// Cấu hình vá lỗi cho Express.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// 1. Áp dụng Helmet để tự động thêm Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// 2. Vá lỗi CORS Reflection: Chỉ cho phép whitelist domain rõ ràng
const allowedOrigins = ['https://your-frontend-domain.com'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by AegisOps Secure CORS Policy'));
    }
  },
  credentials: true,
}));
```

### Trường hợp 3: Python FastAPI Backend
```python
# Cấu hình vá lỗi cho FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

app = FastAPI()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

app.add_middleware(SecurityHeadersMiddleware)
```

## 3. Khung Báo Cáo Tóm Tắt Cấp Điều Hành (Executive Summary Structure)
Mỗi báo cáo phải có 4 phần rõ ràng:
1. **Executive Security Posture:** Chấm điểm tổng quan từ 0 đến 100 điểm.
2. **Key Strengths:** Những điểm cấu hình an ninh mà website đang làm tốt.
3. **Critical Vulnerabilities & Business Risks:** Những lỗ hổng cần xử lý gấp kèm tác động nghiệp vụ (mất uy tín, rò rỉ dữ liệu, bị deface).
4. **Immediate Action Plan:** Kế hoạch 3 bước hành động khẩn cấp cho đội ngũ lập trình viên trong vòng 24 - 48 giờ.
