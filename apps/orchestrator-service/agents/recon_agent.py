import os
import httpx
from typing import Dict, Any

SCANNER_WORKER_URL = os.getenv("SCANNER_WORKER_URL", "http://scanner-worker:8004")

async def run_recon(target_url: str) -> Dict[str, Any]:
    """
    ReconAgent: Gọi scanner-worker để thu thập dữ liệu an ninh mạng thụ động.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{SCANNER_WORKER_URL}/api/v1/scanner/scan",
                json={"target_url": target_url}
            )
            if resp.status_code == 200:
                return resp.json()
            else:
                return {"error": f"Lỗi scanner worker: {resp.text}"}
    except Exception as e:
        return {"error": f"Không thể kết nối scanner worker ({SCANNER_WORKER_URL}): {str(e)}"}
