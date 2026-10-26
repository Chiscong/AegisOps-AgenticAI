import os
import httpx
from typing import Dict, Any, List

RAG_SERVICE_URL = os.getenv("RAG_SERVICE_URL", "http://knowledge-rag-service:8003")

async def run_triage(recon_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    TriageAgent: Phân tích raw findings từ ReconAgent, đối chiếu RAG và lọc bỏ false positives.
    """
    findings: List[Dict[str, Any]] = []

    # 1. Kiểm tra CORS
    cors = recon_data.get("cors_audit", {})
    if cors.get("is_vulnerable"):
        cwe_info = await fetch_rag_info("CWE-942")
        findings.append({
            "id": "VULN-CORS-01",
            "title": "Arbitrary Origin Reflection with Credentials in CORS Policy",
            "severity": cors.get("severity", "CRITICAL"),
            "cvssScore": 9.1 if cors.get("severity") == "CRITICAL" else 7.5,
            "cweId": "CWE-942",
            "owaspCategory": "A01:2021 - Broken Access Control",
            "endpoint": recon_data.get("target_url", "/"),
            "description": cors.get("detail", ""),
            "evidence": f"Allow-Origin: {cors.get('allow_origin')}\nAllow-Credentials: {cors.get('allow_credentials')}",
            "impactAnalysis": cwe_info.get("impact", "Cross-site data hijacking và đánh cắp JWT Token."),
            "remediationGuidance": "Khóa cứng Whitelist CORS, cấm phản chiếu tùy tiện.",
            "patchCode": cwe_info.get("remediation", {}).get("nginx", ""),
            "status": "OPEN",
        })

    # 2. Kiểm tra Security Headers
    headers = recon_data.get("headers_audit", {})
    missing_headers = headers.get("missing", [])
    if missing_headers:
        cwe_info = await fetch_rag_info("CWE-693")
        missing_names = [m["header"] for m in missing_headers]
        findings.append({
            "id": "VULN-HDR-02",
            "title": f"Missing Core Security Headers ({', '.join(missing_names[:3])})",
            "severity": "HIGH",
            "cvssScore": 7.5,
            "cweId": "CWE-693",
            "owaspCategory": "A05:2021 - Security Misconfiguration",
            "endpoint": recon_data.get("target_url", "/"),
            "description": f"Ứng dụng thiếu {len(missing_headers)} tiêu đề bảo vệ cấp trình duyệt.",
            "evidence": f"Các tiêu đề bị thiếu:\n- " + "\n- ".join(missing_names),
            "impactAnalysis": cwe_info.get("impact", "Nguy cơ tấn công XSS, Clickjacking và SSL Stripping."),
            "remediationGuidance": "Bổ sung đầy đủ bộ 6 tiêu đề bảo mật chuẩn OWASP.",
            "patchCode": cwe_info.get("remediation", {}).get("nginx", ""),
            "status": "OPEN",
        })

    # 3. Kiểm tra rò rỉ Server Banner
    server_banner = headers.get("server_banner")
    if server_banner and server_banner != "Hidden":
        cwe_info = await fetch_rag_info("CWE-200")
        findings.append({
            "id": "VULN-INFO-03",
            "title": f"Detailed Server Version Disclosure ({server_banner})",
            "severity": "MEDIUM",
            "cvssScore": 5.3,
            "cweId": "CWE-200",
            "owaspCategory": "A05:2021 - Security Misconfiguration",
            "endpoint": recon_data.get("target_url", "/"),
            "description": f"Header 'Server: {server_banner}' để lộ phiên bản phần mềm máy chủ.",
            "evidence": f"Server: {server_banner}",
            "impactAnalysis": cwe_info.get("impact", "Tạo điều kiện cho kẻ tấn công tra cứu CVE exploits cụ thể."),
            "remediationGuidance": "Tắt hiển thị phiên bản máy chủ trong file cấu hình web server.",
            "patchCode": cwe_info.get("remediation", {}).get("nginx", "server_tokens off;"),
            "status": "OPEN",
        })

    return findings

async def fetch_rag_info(cwe_id: str) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(f"{RAG_SERVICE_URL}/api/v1/rag/remediation/{cwe_id}")
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    return {}
