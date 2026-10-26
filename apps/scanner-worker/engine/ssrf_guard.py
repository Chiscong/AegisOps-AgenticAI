import socket
import ipaddress
from urllib.parse import urlparse
from typing import Tuple, List

# Các dải IP cấm (RFC 1918 Private LAN, Loopback, Link-Local, AWS Metadata)
FORBIDDEN_NETWORKS: List[ipaddress.IPv4Network | ipaddress.IPv6Network] = [
    ipaddress.ip_network("127.0.0.0/8"),       # Loopback
    ipaddress.ip_network("10.0.0.0/8"),        # Private Class A
    ipaddress.ip_network("172.16.0.0/12"),     # Private Class B
    ipaddress.ip_network("192.168.0.0/16"),    # Private Class C
    ipaddress.ip_network("169.254.169.254/32"),# AWS/Cloud Instance Metadata
    ipaddress.ip_network("169.254.0.0/16"),    # Link Local
    ipaddress.ip_network("::1/128"),           # IPv6 Loopback
    ipaddress.ip_network("fc00::/7"),          # IPv6 Private
]

def is_safe_target(url: str) -> Tuple[bool, str, str]:
    """
    Kiểm tra tính an toàn của URL trước khi gửi request (Anti-SSRF).
    Trả về (is_safe, resolved_ip, message)
    """
    parsed = urlparse(url)
    hostname = parsed.hostname

    if not hostname:
        return False, "", "Không thể trích xuất hostname từ URL."

    if parsed.scheme not in ["http", "https"]:
        return False, "", f"Giao thức '{parsed.scheme}' không được phép. Chỉ chấp nhận http/https."

    try:
        # 1. Phân giải DNS
        addr_info = socket.getaddrinfo(hostname, None)
        if not addr_info:
            return False, "", "Không thể phân giải địa chỉ IP qua DNS."

        resolved_ip_str = addr_info[0][4][0]
        ip_obj = ipaddress.ip_address(resolved_ip_str)

        # 2. Kiểm tra có nằm trong dải IP cấm không
        for net in FORBIDDEN_NETWORKS:
            if ip_obj in net:
                return False, resolved_ip_str, f"Phát hiện địa chỉ IP cấm ({resolved_ip_str} thuộc dải {net}). Yêu cầu bị chặn để chống SSRF."

        return True, resolved_ip_str, f"IP hợp lệ ({resolved_ip_str}), an toàn cho trinh sát."
    except socket.gaierror as e:
        return False, "", f"Lỗi phân giải DNS: {str(e)}"
    except Exception as e:
        return False, "", f"Lỗi kiểm tra SSRF: {str(e)}"
