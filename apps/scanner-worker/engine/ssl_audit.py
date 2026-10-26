import ssl
import socket
from datetime import datetime
from urllib.parse import urlparse
from typing import Dict, Any

def audit_ssl_tls(url: str) -> Dict[str, Any]:
    parsed = urlparse(url)
    if parsed.scheme != "https":
        return {
            "has_ssl": False,
            "error": "Mục tiêu không sử dụng HTTPS."
        }

    hostname = parsed.hostname
    port = parsed.port or 443

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=4.0) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                version = ssock.version()

                # Kiểm tra hạn chứng chỉ
                not_after_str = cert.get("notAfter", "")
                not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z")
                days_left = (not_after - datetime.utcnow()).days

                return {
                    "has_ssl": True,
                    "version": version,
                    "cipher_suite": cipher[0] if cipher else "Unknown",
                    "days_until_expiration": days_left,
                    "is_expired": days_left <= 0,
                    "subject": dict(x[0] for x in cert.get("subject", ())),
                    "issuer": dict(x[0] for x in cert.get("issuer", ())),
                }
    except Exception as e:
        return {
            "has_ssl": False,
            "error": f"Lỗi bắt tay TLS: {str(e)}"
        }
