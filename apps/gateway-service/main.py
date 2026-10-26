import uvicorn
import httpx
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.4.0",
    description="API Gateway hợp nhất cho toàn bộ hệ thống Microservices AegisOps B2B SaaS"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage cho Domains & API Keys cấp Gateway
DOMAINS_DB = []
API_KEYS_DB = []

@app.get("/healthz")
async def healthcheck():
    # Kiểm tra trạng thái các services downstream
    services_status = {}
    async with httpx.AsyncClient(timeout=2.0) as client:
        for name, url in [
            ("auth-service", settings.AUTH_SERVICE_URL),
            ("orchestrator-service", settings.ORCHESTRATOR_URL),
            ("knowledge-rag", settings.RAG_SERVICE_URL),
        ]:
            try:
                r = await client.get(f"{url}/healthz")
                services_status[name] = "Healthy" if r.status_code == 200 else f"Degraded ({r.status_code})"
            except Exception:
                services_status[name] = "Connecting"

    return {
        "status": "Healthy",
        "service": "gateway-service",
        "version": "1.4.0",
        "downstream_services": services_status
    }

# ==========================================
# 1. ROUTING PROXY: AUTH SERVICE (8001)
# ==========================================
@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_auth(path: str, request: Request):
    return await forward_request(settings.AUTH_SERVICE_URL, f"/api/v1/auth/{path}", request)

# ==========================================
# 2. ROUTING PROXY: ORCHESTRATOR & SCANS (8002)
# ==========================================
@app.api_route("/api/v1/scans/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_scans(path: str, request: Request):
    return await forward_request(settings.ORCHESTRATOR_URL, f"/api/v1/scans/{path}", request)

# ==========================================
# 3. ROUTING PROXY: RAG & COPILOT CHAT (8003)
# ==========================================
@app.api_route("/api/v1/copilot/{path:path}", methods=["GET", "POST"])
async def proxy_copilot(path: str, request: Request):
    return await forward_request(settings.RAG_SERVICE_URL, f"/api/v1/copilot/{path}", request)

@app.api_route("/api/v1/rag/{path:path}", methods=["GET", "POST"])
async def proxy_rag(path: str, request: Request):
    return await forward_request(settings.RAG_SERVICE_URL, f"/api/v1/rag/{path}", request)

# ==========================================
# 4. DOMAINS & ASSET MANAGEMENT API
# ==========================================
@app.get("/api/v1/domains")
def get_domains():
    return DOMAINS_DB

@app.post("/api/v1/domains")
async def add_domain(request: Request):
    body = await request.json()
    domain_name = body.get("domain", "").strip()
    if not domain_name:
        raise HTTPException(status_code=400, detail="Thiếu domain")

    record = {
        "id": f"dom-{len(DOMAINS_DB) + 1}",
        "domain": domain_name,
        "isVerified": False,
        "verificationToken": f"aegisops-verify={domain_name}-token",
        "dnsTxtRecord": f"_aegisops-challenge.{domain_name}",
        "status": "PENDING_VERIFICATION",
        "lastScanAt": "Chưa quét",
        "securityScore": 0,
        "createdAt": "2026-10-26"
    }
    DOMAINS_DB.append(record)
    return record

@app.post("/api/v1/domains/{domain_id}/verify")
def verify_domain(domain_id: str):
    for d in DOMAINS_DB:
        if d["id"] == domain_id:
            d["isVerified"] = True
            d["status"] = "VERIFIED"
            return {"status": "VERIFIED", "domain": d["domain"]}
    raise HTTPException(status_code=404, detail="Không tìm thấy tên miền")

# ==========================================
# 5. API KEYS MANAGEMENT API
# ==========================================
@app.get("/api/v1/api-keys")
def get_api_keys():
    return API_KEYS_DB

@app.post("/api/v1/api-keys")
async def create_api_key(request: Request):
    body = await request.json()
    name = body.get("name", "Default Key")
    env = body.get("environment", "PRODUCTION")

    raw_token = f"aegis_{env.lower()[:4]}_{name[:4]}_secret_token"
    key_record = {
        "id": f"key-{len(API_KEYS_DB) + 1}",
        "name": name,
        "keyPrefix": f"aegis_{env.lower()[:4]}_",
        "fullKeyPreview": raw_token,
        "environment": env,
        "createdAt": "2026-10-26",
        "lastUsedAt": "Chưa dùng"
    }
    API_KEYS_DB.append(key_record)
    return key_record

# ==========================================
# HELPER: GENERIC HTTP FORWARDER
# ==========================================
async def forward_request(base_url: str, path: str, request: Request) -> Response:
    url = f"{base_url}{path}"
    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                params=dict(request.query_params),
                content=body
            )
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers)
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Dịch vụ downstream ({base_url}) hiện chưa khả dụng: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
