---
name: skill-recon-prober
description: Năng lực trinh sát an ninh mạng thụ động, thu thập Security Headers, kiểm toán CORS Misconfiguration, kiểm tra chứng chỉ SSL/TLS và phát hiện rò rỉ endpoint nhạy cảm qua robots.txt.
---

# SKILL: Reconnaissance & Infrastructure Prober (Recon Agent)

## 1. Mục đích & Vai trò
Kỹ năng này trao quyền cho **Recon Agent** đóng vai trò là một chuyên gia khảo sát mạng thụ động (Passive Reconnaissance Specialist). Agent thu thập mọi dấu vết cấu hình công khai của trang web mục tiêu mà không gây ảnh hưởng đến tính sẵn sàng hay tính toàn vẹn của hệ thống đích.

## 2. Các Công Cụ Khảo Sát Tích Hợp (Tool Specifications)

### Tool 1: `probe_http_headers(url: str)`
- **Nhiệm vụ:** Kiểm tra toàn bộ 6 Security Headers cốt lõi theo khuyến nghị OWASP Secure Headers Project:
  1. `Strict-Transport-Security` (HSTS): Yêu cầu có `max-age>=31536000`, cảnh báo nếu thiếu `includeSubDomains`.
  2. `Content-Security-Policy` (CSP): Cảnh báo nếu chứa `unsafe-inline`, `unsafe-eval`, hoặc wildcard `*`.
  3. `X-Frame-Options`: Kiểm tra giá trị `DENY` hoặc `SAMEORIGIN` để phòng chống Clickjacking.
  4. `X-Content-Type-Options`: Bắt buộc phải có giá trị `nosniff`.
  5. `Referrer-Policy`: Kiểm tra giá trị `strict-origin-when-cross-origin` hoặc `no-referrer`.
  6. `Permissions-Policy`: Kiểm tra cấu hình hạn chế Camera, Micro, Geolocation.
- **Phát hiện lộ lọt công nghệ:** Bóc tách giá trị header `Server`, `X-Powered-By`, `X-AspNet-Version`, `Via`.

### Tool 2: `test_cors_misconfiguration(url: str)`
- **Nhiệm vụ:** Kiểm tra nguy cơ đánh cắp dữ liệu người dùng qua cấu hình sai CORS:
  - Gửi request kèm header `Origin: https://attacker.com`.
  - Nếu response trả về `Access-Control-Allow-Origin: https://attacker.com` và `Access-Control-Allow-Credentials: true` ➔ Đánh dấu lỗi **CORS Origin Reflection (High Severity)**.
  - Nếu trả về `Access-Control-Allow-Origin: *` kết hợp `Access-Control-Allow-Credentials: true` ➔ Lỗi cấu hình vi phạm chuẩn trình duyệt (Invalid CORS Spec).

### Tool 3: `inspect_tls_and_ssl(url: str)`
- **Nhiệm vụ:** Kết nối Socket TLS trích xuất:
  - Phiên bản TLS đàm phán (TLSv1.2, TLSv1.3 - cảnh báo nguy cơ nếu là TLSv1.0 hoặc TLSv1.1).
  - Tên nhà phát hành chứng chỉ (Issuer CA) và thời hạn còn lại (Expiration Days).
  - Thuật toán mã hóa (Cipher Suite).

### Tool 4: `audit_robots_and_endpoints(url: str)`
- **Nhiệm vụ:** Tải về `/robots.txt` và `/sitemap.xml`:
  - Phân tích các đường dẫn `Disallow:` để phát hiện các endpoint nội bộ nhạy cảm bị vô tình công khai (ví dụ: `/admin`, `/api/v1/internal`, `/swagger`, `/backup`, `/.env`).

## 3. Định dạng Dữ liệu Đầu ra Chuẩn (Output JSON Schema)

```json
{
  "target_url": "https://example.com",
  "status_code": 200,
  "server_fingerprint": "nginx/1.24.0",
  "missing_headers": ["Content-Security-Policy", "Permissions-Policy"],
  "present_headers": {
    "strict-transport-security": "max-age=31536000",
    "x-content-type-options": "nosniff"
  },
  "cors_audit": {
    "is_vulnerable": false,
    "allow_origin": null,
    "allow_credentials": null
  },
  "tls_audit": {
    "version": "TLSv1.3",
    "cipher": "TLS_AES_256_GCM_SHA384",
    "days_until_expiration": 85
  },
  "exposed_paths_found": ["/admin/login", "/api/docs"]
}
```
