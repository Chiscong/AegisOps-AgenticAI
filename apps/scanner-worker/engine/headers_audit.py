from typing import Dict, Any, List

CORE_SECURITY_HEADERS = {
    "strict-transport-security": {
        "name": "Strict-Transport-Security",
        "description": "Bảo vệ kết nối HTTPS, chống tấn công SSL Stripping",
        "recommended": "max-age=31536000; includeSubDomains; preload",
        "cwe": "CWE-319",
        "severity": "HIGH",
    },
    "content-security-policy": {
        "name": "Content-Security-Policy",
        "description": "Ngăn chặn mã độc Cross-Site Scripting (XSS) và Data Injection",
        "recommended": "default-src 'self'",
        "cwe": "CWE-79",
        "severity": "HIGH",
    },
    "x-frame-options": {
        "name": "X-Frame-Options",
        "description": "Chống tấn công Clickjacking bằng cách cấm nhúng iFrame",
        "recommended": "SAMEORIGIN hoặc DENY",
        "cwe": "CWE-1021",
        "severity": "MEDIUM",
    },
    "x-content-type-options": {
        "name": "X-Content-Type-Options",
        "description": "Cấm trình duyệt tự ý đoán định dạng MIME (MIME sniffing)",
        "recommended": "nosniff",
        "cwe": "CWE-16",
        "severity": "LOW",
    },
    "referrer-policy": {
        "name": "Referrer-Policy",
        "description": "Kiểm soát dữ liệu URL rò rỉ qua header Referer",
        "recommended": "strict-origin-when-cross-origin",
        "cwe": "CWE-200",
        "severity": "LOW",
    },
    "permissions-policy": {
        "name": "Permissions-Policy",
        "description": "Khóa các tính năng phần cứng nhạy cảm (camera, mic, vị trí)",
        "recommended": "camera=(), microphone=(), geolocation=()",
        "cwe": "CWE-16",
        "severity": "LOW",
    },
}

def audit_security_headers(headers: Dict[str, str]) -> Dict[str, Any]:
    lower_headers = {k.lower(): v for k, v in headers.items()}
    present: List[Dict[str, str]] = []
    missing: List[Dict[str, Any]] = []

    for key, meta in CORE_SECURITY_HEADERS.items():
        if key in lower_headers:
            present.append({
                "header": meta["name"],
                "value": lower_headers[key],
                "description": meta["description"],
            })
        else:
            missing.append({
                "header": meta["name"],
                "description": meta["description"],
                "recommended": meta["recommended"],
                "cwe": meta["cwe"],
                "severity": meta["severity"],
            })

    # Kiểm tra rò rỉ banner máy chủ (Information Disclosure)
    server_banner = lower_headers.get("server", "Hidden")
    powered_by = lower_headers.get("x-powered-by", None)

    return {
        "total_required": len(CORE_SECURITY_HEADERS),
        "present_count": len(present),
        "missing_count": len(missing),
        "present": present,
        "missing": missing,
        "server_banner": server_banner,
        "powered_by": powered_by,
    }
