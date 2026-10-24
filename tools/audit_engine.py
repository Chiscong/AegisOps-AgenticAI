#!/usr/bin/env python3
"""
AegisOps / congpc Audit Engine: Công cụ trinh sát an ninh mạng thụ động,
kiểm tra Security Headers, CORS, SSL/TLS, Robots.txt và phòng chống SSRF.
Tác giả: CONGPC - AegisOps Platform.
"""

import sys
import os
import re
import json
import socket
import ssl
import ipaddress
import urllib.parse
import urllib.request
import argparse
from typing import Dict, Any, List

FORBIDDEN_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.169.254/32"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def check_ssrf_safety(url: str) -> None:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ["http", "https"]:
        raise ValueError(f"Giao thức '{parsed.scheme}' không được hỗ trợ. Chỉ chấp nhận http hoặc https.")
    hostname = parsed.hostname
    if not hostname:
        raise ValueError("URL không chứa hostname hợp lệ.")

    try:
        addr_info = socket.getaddrinfo(hostname, None)
        resolved_ips = [info[4][0] for info in addr_info]
    except Exception as e:
        raise ValueError(f"Không thể phân giải tên miền '{hostname}': {str(e)}")

    for ip_str in resolved_ips:
        ip_obj = ipaddress.ip_address(ip_str)
        for net in FORBIDDEN_NETWORKS:
            if ip_obj in net:
                raise PermissionError(
                    f"[SSRF CHẶN] IP '{ip_str}' thuộc dải mạng nội bộ/nhạy cảm ({net}). Tác vụ bị từ chối vì lý do an toàn!"
                )

def probe_headers_and_cors(target_url: str) -> Dict[str, Any]:
    check_ssrf_safety(target_url)
    parsed = urllib.parse.urlparse(target_url)
    test_origin = f"https://evil-{parsed.netloc}.test"
    
    headers_req = {
        "User-Agent": "AegisOps-SecAuditor/1.0 (congpc-security-bot)",
        "Origin": test_origin
    }

    result = {
        "status_code": 0,
        "server_banner": None,
        "present_headers": {},
        "missing_headers": [],
        "cors_misconfiguration": False,
        "cors_details": {}
    }

    core_security_headers = [
        "Strict-Transport-Security",
        "Content-Security-Policy",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy"
    ]

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(target_url, headers=headers_req, method="GET")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=8.0) as resp:
            result["status_code"] = resp.status
            resp_headers = {k.lower(): v for k, v in resp.headers.items()}
            
            result["server_banner"] = resp_headers.get("server") or resp_headers.get("x-powered-by")
            
            for h in core_security_headers:
                if h.lower() in resp_headers:
                    result["present_headers"][h] = resp_headers[h.lower()]
                else:
                    result["missing_headers"].append(h)
                    
            allow_origin = resp_headers.get("access-control-allow-origin")
            allow_creds = resp_headers.get("access-control-allow-credentials")
            
            result["cors_details"] = {
                "allow_origin": allow_origin,
                "allow_credentials": allow_creds
            }
            
            if allow_origin == test_origin and allow_creds == "true":
                result["cors_misconfiguration"] = True
            elif allow_origin == "*" and allow_creds == "true":
                result["cors_misconfiguration"] = True
    except Exception as e:
        result["error"] = str(e)

    return result

def probe_ssl_tls(target_url: str) -> Dict[str, Any]:
    parsed = urllib.parse.urlparse(target_url)
    hostname = parsed.hostname
    port = parsed.port or (443 if parsed.scheme == "https" else 80)

    if parsed.scheme != "https":
        return {"has_ssl": False, "warning": "Website không sử dụng giao thức HTTPS bảo mật."}

    ctx = ssl.create_default_context()
    try:
        with socket.create_connection((hostname, port), timeout=5.0) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return {
                    "has_ssl": True,
                    "tls_version": ssock.version(),
                    "cipher": ssock.cipher(),
                    "expires": cert.get("notAfter"),
                    "issuer": [x[0] for x in cert.get("issuer", [])]
                }
    except Exception as e:
        return {"has_ssl": False, "error": str(e)}

def probe_robots_txt(target_url: str) -> Dict[str, Any]:
    parsed = urllib.parse.urlparse(target_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    out = {"found": False, "disallowed_paths": [], "sensitive_exposed": []}
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    sensitive_keywords = ["admin", "api", "internal", "swagger", "backup", "v1", "v2", "db", "auth"]
    
    try:
        req = urllib.request.Request(robots_url, headers={"User-Agent": "AegisOps-SecAuditor/1.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=5.0) as resp:
            if resp.status == 200:
                out["found"] = True
                body = resp.read().decode("utf-8", errors="ignore")
                for line in body.splitlines():
                    if line.strip().lower().startswith("disallow:"):
                        path = line.split(":", 1)[1].strip()
                        out["disallowed_paths"].append(path)
                        if any(kw in path.lower() for kw in sensitive_keywords):
                            out["sensitive_exposed"].append(path)
    except Exception:
        pass
    return out

def run_full_audit(target_url: str) -> Dict[str, Any]:
    if not target_url.startswith("http://") and not target_url.startswith("https://"):
        target_url = "https://" + target_url

    check_ssrf_safety(target_url)
    
    headers_data = probe_headers_and_cors(target_url)
    ssl_data = probe_ssl_tls(target_url)
    robots_data = probe_robots_txt(target_url)
    
    # Tính điểm an toàn tổng thể Aegis Security Score (0-100)
    score = 100
    score -= len(headers_data.get("missing_headers", [])) * 10
    if headers_data.get("cors_misconfiguration"):
        score -= 25
    if not ssl_data.get("has_ssl"):
        score -= 30
    if robots_data.get("sensitive_exposed"):
        score -= 10
    score = max(0, score)

    return {
        "target": target_url,
        "security_score": score,
        "headers_and_cors": headers_data,
        "ssl_tls": ssl_data,
        "robots_txt": robots_data
    }

def print_markdown_report(data: Dict[str, Any]) -> None:
    score = data["security_score"]
    color = "🟢" if score >= 80 else ("🟡" if score >= 50 else "🔴")
    
    print("\n" + "=" * 70)
    print(f"🛡️  AEGIS OPS / CONGPC SECURITY AUDIT REPORT")
    print(f"🎯  Mục tiêu: {data['target']}")
    print(f"📊  Điểm An Toàn: {color} {score} / 100 điểm")
    print("=" * 70 + "\n")

    hc = data["headers_and_cors"]
    print("### 1. KIỂM TOÁN SECURITY HEADERS")
    print(f"- **Server Banner:** {hc.get('server_banner') or 'Đã ẩn (Tốt)'}")
    print(f"- **Headers đã có:** {', '.join(hc.get('present_headers', {}).keys()) or 'Không có'}")
    if hc.get("missing_headers"):
        print(f"- ⚠️  **Headers bị THIẾU (Nguy cơ bảo mật):**")
        for m in hc["missing_headers"]:
            print(f"  • {m}")
    else:
        print("- [✓] Đầy đủ 6 Security Headers khuyến nghị bởi OWASP.")

    print("\n### 2. KIỂM TOÁN CHÍNH SÁCH CORS")
    if hc.get("cors_misconfiguration"):
        print("- 🚨 **PHÁT HIỆN LỖ HỔNG CORS NGUY HIỂM:**")
        print(f"  • Origin phản chiếu: {hc['cors_details'].get('allow_origin')}")
        print(f"  • Credentials: {hc['cors_details'].get('allow_credentials')}")
        print("  • Tác động: Kẻ tấn công có thể đánh cắp session/token của người dùng!")
    else:
        print("- [✓] Cấu hình CORS an toàn hoặc không phản chiếu arbitrary origin.")

    print("\n### 3. KIỂM TOÁN MÃ HÓA TLS / SSL")
    ssl_d = data["ssl_tls"]
    if ssl_d.get("has_ssl"):
        print(f"- **Phiên bản TLS:** {ssl_d.get('tls_version')}")
        print(f"- **Cipher Suite:** {ssl_d.get('cipher', [''])[0]}")
        print(f"- **Hạn chứng chỉ:** {ssl_d.get('expires')}")
    else:
        print(f"- ⚠️ **CẢNH BÁO:** {ssl_d.get('warning') or ssl_d.get('error')}")

    print("\n### 4. RÒ RỈ ENDPOINT QUA ROBOTS.TXT")
    rb = data["robots_txt"]
    if rb.get("sensitive_exposed"):
        print("- ⚠️  **Endpoint nhạy cảm bị lộ trong Disallow:**")
        for p in rb["sensitive_exposed"]:
            print(f"  • {p}")
    else:
        print("- [✓] Không phát hiện endpoint nhạy cảm bị lộ lọt.")

    print("\n" + "=" * 70)
    print("Gợi ý: Dùng lệnh 'python tools/remediation_gen.py' để sinh mã vá lỗi tự động.")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AegisOps / congpc Web Security Auditor")
    parser.add_argument("-u", "--url", required=True, help="URL trang web cần kiểm tra")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả định dạng JSON")
    args = parser.parse_args()

    try:
        report = run_full_audit(args.url)
        if args.json:
            print(json.dumps(report, indent=2))
        else:
            print_markdown_report(report)
    except Exception as e:
        print(f"\n[!] LỖI THỰC THI: {e}\n", file=sys.stderr)
        sys.exit(1)
