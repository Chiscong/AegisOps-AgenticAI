import time
import httpx
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, HttpUrl
from engine.ssrf_guard import is_safe_target
from engine.headers_audit import audit_security_headers
from engine.cors_audit import audit_cors_policy
from engine.ssl_audit import audit_ssl_tls

app = FastAPI(
    title="AegisOps Scanner Worker",
    version="1.8.0",
    description="Microservice trinh sát an ninh mạng thụ động, an toàn và chống SSRF tuyệt đối."
)

class ScanRequest(BaseModel):
    target_url: str

@app.get("/healthz")
def healthcheck():
    return {
        "status": "Healthy",
        "service": "scanner-worker",
        "version": "1.8.0"
    }

@app.post("/api/v1/scanner/scan")
async def execute_passive_scan(req: ScanRequest):
    target = req.target_url.strip()
    if not target.startswith(("http://", "https://")):
        target = f"https://{target}"

    start_time = time.time()

    # 1. SSRF Pre-Resolution Guard
    is_safe, resolved_ip, ssrf_msg = is_safe_target(target)
    if not is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[SSRF Blocked] {ssrf_msg}"
        )

    # 2. Gửi request thăm dò Headers thông thường
    test_origin = "https://aegis-audit-probe.test"
    headers_to_send = {
        "User-Agent": "AegisOps-Security-Auditor/1.0 (+https://aegisops.io)",
        "Origin": test_origin,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0, verify=False, follow_redirects=True) as client:
            response = await client.get(target, headers=headers_to_send)
            status_code = response.status_code
            raw_headers = dict(response.headers)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Không thể kết nối đến máy chủ mục tiêu: {str(e)}"
        )

    # 3. Phân tích Security Headers
    headers_result = audit_security_headers(raw_headers)

    # 4. Phân tích CORS Policy
    cors_result = audit_cors_policy(raw_headers, test_origin=test_origin)

    # 5. Phân tích SSL/TLS
    ssl_result = audit_ssl_tls(target)

    # 6. Tính toán Điểm số An ninh Aegis Score (Thang điểm 100)
    score = 100
    if cors_result["is_vulnerable"]:
        score -= 40
    score -= (headers_result["missing_count"] * 8)
    if not ssl_result.get("has_ssl", False) or ssl_result.get("is_expired", False):
        score -= 25
    score = max(10, min(100, score))

    elapsed = round(time.time() - start_time, 2)

    return {
        "target_url": target,
        "resolved_ip": resolved_ip,
        "status_code": status_code,
        "score": score,
        "scan_duration": f"{elapsed}s",
        "headers_audit": headers_result,
        "cors_audit": cors_result,
        "ssl_audit": ssl_result,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
