from typing import Dict, Any, List

KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "CWE-942": {
        "cwe_id": "CWE-942",
        "title": "Permissive Cross-Origin Resource Sharing (CORS) Policy",
        "owasp_category": "A01:2021 - Broken Access Control",
        "wstg_code": "WSTG-CONF-07",
        "description": "Máy chủ cấu hình CORS quá dễ dãi, tự động phản chiếu header Origin từ client kèm theo cờ Access-Control-Allow-Credentials: true. Kẻ tấn công có thể ép trình duyệt nạn nhân gửi kèm cookies xác thực từ website độc hại.",
        "impact": "Rò rỉ dữ liệu phiên làm việc, đánh cắp JWT Token và CSRF dữ liệu nhạy cảm.",
        "remediation": {
            "nginx": """# Cấu hình Whitelist CORS chuẩn cho Nginx
set $cors_origin "";
if ($http_origin ~* "^https?://(yourcompany\\.com|app\\.yourcompany\\.com)$") {
    set $cors_origin $http_origin;
}
add_header Access-Control-Allow-Origin $cors_origin always;
add_header Access-Control-Allow-Credentials "true" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE" always;
add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;""",
            "express": """// Middleware Cors Whitelist an toàn cho Express.js
const cors = require('cors');

const allowedOrigins = ['https://yourcompany.com', 'https://app.yourcompany.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Chặn bởi chính sách CORS của AegisOps'));
    }
  },
  credentials: true
}));""",
            "fastapi": """# Cấu hình CORS Whitelist cho FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://yourcompany.com",
    "https://app.yourcompany.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)"""
        }
    },
    "CWE-693": {
        "cwe_id": "CWE-693",
        "title": "Protection Mechanism Failure (Missing Core Security Headers)",
        "owasp_category": "A05:2021 - Security Misconfiguration",
        "wstg_code": "WSTG-CONF-01",
        "description": "Ứng dụng thiếu vắng các tiêu đề bảo vệ cấp trình duyệt như Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Frame-Options và X-Content-Type-Options.",
        "impact": "Tăng nguy cơ bị tấn công Clickjacking, Man-in-the-Middle SSL Stripping và khai thác lỗi Cross-Site Scripting (XSS).",
        "remediation": {
            "nginx": """# Bộ 6 Security Headers cốt lõi cho Nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'self';" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;""",
            "express": """// Sử dụng thư viện Helmet cho Express.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));""",
            "fastapi": """# Middleware chèn Security Headers cho FastAPI
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self';"
        return response

app.add_middleware(SecurityHeadersMiddleware)"""
        }
    },
    "CWE-200": {
        "cwe_id": "CWE-200",
        "title": "Exposure of Sensitive Information to an Unauthorized Actor (Server Banner)",
        "owasp_category": "A05:2021 - Security Misconfiguration",
        "wstg_code": "WSTG-INFO-02",
        "description": "Header Server để lộ phiên bản cụ thể của web server (ví dụ: nginx/1.24.0 (Ubuntu)) hoặc X-Powered-By: Express.",
        "impact": "Tạo điều kiện cho kẻ tấn công tra cứu 1-day/0-day CVE exploits nhắm trúng mục tiêu.",
        "remediation": {
            "nginx": """# Tắt hiển thị phiên bản Nginx trong /etc/nginx/nginx.conf
server_tokens off;""",
            "express": """// Tắt header X-Powered-By trong Express
app.disable('x-powered-by');""",
            "fastapi": """# Uvicorn mặc định có thể tắt Server header qua cờ --no-server-header"""
        }
    }
}

def query_knowledge_base(keyword: str) -> List[Dict[str, Any]]:
    kw = keyword.lower()
    results = []
    for cwe_id, item in KNOWLEDGE_BASE.items():
        if (
            kw in cwe_id.lower()
            or kw in item["title"].lower()
            or kw in item["owasp_category"].lower()
            or kw in item["description"].lower()
        ):
            results.append(item)
    return results

def get_remediation_by_cwe(cwe_id: str) -> Dict[str, Any]:
    return KNOWLEDGE_BASE.get(cwe_id.upper(), {})
