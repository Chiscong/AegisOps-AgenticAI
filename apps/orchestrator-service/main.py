import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workflow.engine import execute_orchestrated_scan, get_scan_by_id

app = FastAPI(
    title="AegisOps Orchestrator Service",
    version="2.0.0",
    description="Microservice điều phối bầy đàn AI Agents (LangGraph DAG state machine)."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartScanRequest(BaseModel):
    targetUrl: str

@app.get("/healthz")
def healthcheck():
    return {
        "status": "Healthy",
        "service": "orchestrator-service",
        "version": "2.0.0"
    }

@app.post("/api/v1/scans/start")
async def start_scan(req: StartScanRequest):
    if not req.targetUrl:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thiếu tham số targetUrl."
        )

    result = await execute_orchestrated_scan(req.targetUrl)
    return result

@app.get("/api/v1/scans/{scan_id}")
def get_scan(scan_id: str):
    res = get_scan_by_id(scan_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy kết quả quét với ID này."
        )
    return res

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
