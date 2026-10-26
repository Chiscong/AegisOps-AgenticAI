from typing import Dict, Any

def audit_cors_policy(headers: Dict[str, str], test_origin: str = "https://evil-attacker.test") -> Dict[str, Any]:
    lower_headers = {k.lower(): v for k, v in headers.items()}
    allow_origin = lower_headers.get("access-control-allow-origin", "")
    allow_credentials = lower_headers.get("access-control-allow-credentials", "").lower() == "true"

    is_vulnerable = False
    severity = "INFO"
    detail = "CORS policy an toàn hoặc không được kích hoạt."

    if allow_origin == test_origin and allow_credentials:
        is_vulnerable = True
        severity = "CRITICAL"
        detail = "Máy chủ phản chiếu nguyên vẹn giá trị Origin từ client kèm Access-Control-Allow-Credentials: true. Kẻ tấn công có thể đánh cắp dữ liệu phiên làm việc (CWE-942)."
    elif allow_origin == "*" and allow_credentials:
        is_vulnerable = True
        severity = "HIGH"
        detail = "Wildcard '*' đi kèm Credentials=true là cấu hình không hợp lệ theo chuẩn RFC 6454."
    elif allow_origin == test_origin:
        is_vulnerable = True
        severity = "MEDIUM"
        detail = "Phản chiếu Origin tùy ý nhưng chưa bật Credentials."

    return {
        "is_vulnerable": is_vulnerable,
        "severity": severity,
        "allow_origin": allow_origin,
        "allow_credentials": allow_credentials,
        "detail": detail,
        "cwe": "CWE-942",
        "owasp": "A01:2021 - Broken Access Control"
    }
