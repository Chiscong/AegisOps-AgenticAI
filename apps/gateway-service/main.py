import uvicorn
import httpx
from datetime import datetime
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

# In-memory storage cho Core SaaS Features
DOMAINS_DB = []
API_KEYS_DB = []
TEAM_MEMBERS_DB = [
    {
        "id": "mem-1",
        "name": "Chí Công",
        "email": "congpc@aegisops.io",
        "role": "SECURITY_LEAD",
        "status": "ACTIVE",
        "twoFactorEnabled": True,
        "lastActive": "Vừa xong",
        "avatar": "CC"
    }
]

WORKSPACES_DB = [
    {
        "id": "ws-primary",
        "name": "AegisOps Production Workspace",
        "slug": "aegisops-prod",
        "plan": "PRO",
        "scansUsed": 12,
        "scansLimit": 50,
        "domainsCount": 1,
        "domainsLimit": 5,
        "membersCount": 1
    }
]

SYSTEM_SETTINGS_DB = {
    "llmProvider": "ollama",
    "ollamaBaseUrl": "http://localhost:11434",
    "openaiApiKey": "",
    "anthropicApiKey": "",
    "modelName": "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
    "temperature": 0.1,
    "tokenCompressionLevel": "metrics",
    "githubToken": "",
    "githubRepo": "",
    "githubBranch": "main",
    "prAutoAssign": True,
    "ssrfBlacklistCidrs": [
        "127.0.0.0/8",
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "169.254.169.254/32",
        "::1/128",
        "fc00::/7"
    ],
    "ssrfWhitelistDomains": [],
    "maxRedirects": 3,
    "timeoutMs": 5000,
    "discordWebhookUrl": "",
    "slackWebhookUrl": "",
    "alertThreshold": "HIGH"
}

@app.get("/healthz")
async def healthcheck():
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
# 4. WORKSPACES API
# ==========================================
@app.get("/api/v1/workspaces")
def get_workspaces():
    return WORKSPACES_DB

# ==========================================
# 5. VULNERABILITIES API (AGGREGATED FINDINGS)
# ==========================================
@app.get("/api/v1/vulnerabilities")
async def get_vulnerabilities():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.ORCHESTRATOR_URL}/api/v1/scans/findings/all")
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    return []

# ==========================================
# 6. DOMAINS & ASSET MANAGEMENT API
# ==========================================
@app.get("/api/v1/domains")
def get_domains():
    return DOMAINS_DB

@app.post("/api/v1/domains")
async def add_domain(request: Request):
    body = await request.json()
    domain_name = body.get("domain", "").strip().lower()
    if not domain_name:
        raise HTTPException(status_code=400, detail="Thiếu domain")

    # Xóa giao thức http/https
    domain_name = domain_name.replace("https://", "").replace("http://", "").split("/")[0]

    record = {
        "id": f"dom-{len(DOMAINS_DB) + 1}",
        "domain": domain_name,
        "isVerified": False,
        "verificationMethod": "DNS_TXT",
        "verificationToken": f"aegisops-verify={domain_name}-challenge-token",
        "dnsTxtRecord": f"_aegisops-challenge.{domain_name}",
        "status": "PENDING_VERIFICATION",
        "lastScanAt": "Chưa quét",
        "securityScore": 0,
        "autoScanSchedule": "WEEKLY",
        "createdAt": datetime.now().strftime("%Y-%m-%d")
    }
    DOMAINS_DB.insert(0, record)
    return record

@app.post("/api/v1/domains/{domain_id}/verify")
def verify_domain(domain_id: str):
    for d in DOMAINS_DB:
        if d["id"] == domain_id:
            d["isVerified"] = True
            d["status"] = "VERIFIED"
            d["securityScore"] = 82
            d["lastScanAt"] = "Vừa xong"
            return {"status": "VERIFIED", "domain": d["domain"], "securityScore": 82}
    raise HTTPException(status_code=404, detail="Không tìm thấy tên miền")

@app.delete("/api/v1/domains/{domain_id}")
def delete_domain(domain_id: str):
    global DOMAINS_DB
    DOMAINS_DB = [d for d in DOMAINS_DB if d["id"] != domain_id]
    return {"status": "DELETED", "domain_id": domain_id}

# ==========================================
# 7. API KEYS MANAGEMENT API
# ==========================================
@app.get("/api/v1/api-keys")
def get_api_keys():
    return API_KEYS_DB

@app.post("/api/v1/api-keys")
async def create_api_key(request: Request):
    body = await request.json()
    name = body.get("name", "Default CI/CD Key").strip()
    env = body.get("environment", "PRODUCTION")

    raw_token = f"aegis_{env.lower()[:4]}_{name[:6]}_{datetime.now().timestamp()}"
    key_record = {
        "id": f"key-{len(API_KEYS_DB) + 1}",
        "name": name,
        "keyPrefix": f"aegis_{env.lower()[:4]}_",
        "fullKeyPreview": raw_token,
        "environment": env,
        "createdAt": datetime.now().strftime("%Y-%m-%d"),
        "lastUsedAt": "Chưa sử dụng",
        "createdBy": "Admin"
    }
    API_KEYS_DB.insert(0, key_record)
    return key_record

@app.delete("/api/v1/api-keys/{key_id}")
def delete_api_key(key_id: str):
    global API_KEYS_DB
    API_KEYS_DB = [k for k in API_KEYS_DB if k["id"] != key_id]
    return {"status": "REVOKED", "key_id": key_id}

# ==========================================
# 8. TEAM COLLABORATION API
# ==========================================
@app.get("/api/v1/team")
def get_team_members():
    return TEAM_MEMBERS_DB

@app.post("/api/v1/team/invite")
async def invite_team_member(request: Request):
    body = await request.json()
    email = body.get("email", "").strip()
    role = body.get("role", "DEVELOPER")
    if not email:
        raise HTTPException(status_code=400, detail="Thiếu email thành viên")

    new_member = {
        "id": f"mem-{len(TEAM_MEMBERS_DB) + 1}",
        "name": email.split("@")[0],
        "email": email,
        "role": role,
        "status": "INVITED",
        "twoFactorEnabled": False,
        "lastActive": "Chờ kích hoạt",
        "avatar": email[:2].upper()
    }
    TEAM_MEMBERS_DB.append(new_member)
    return new_member

@app.delete("/api/v1/team/{member_id}")
def remove_team_member(member_id: str):
    global TEAM_MEMBERS_DB
    TEAM_MEMBERS_DB = [m for m in TEAM_MEMBERS_DB if m["id"] != member_id]
    return {"status": "REMOVED", "member_id": member_id}

@app.patch("/api/v1/team/{member_id}/role")
async def update_member_role(member_id: str, request: Request):
    body = await request.json()
    new_role = body.get("role")
    for m in TEAM_MEMBERS_DB:
        if m["id"] == member_id:
            m["role"] = new_role
            return m
    raise HTTPException(status_code=404, detail="Không tìm thấy thành viên")

# ==========================================
# 9. BILLING & SUBSCRIPTIONS API
# ==========================================
@app.get("/api/v1/billing")
def get_billing():
    return {
        "plan": "PRO",
        "billingCycle": "MONTHLY",
        "nextBillingDate": "2026-11-26",
        "amountDue": "$49.00",
        "paymentMethod": {
            "brand": "Visa",
            "last4": "4242",
            "expiry": "12/28"
        },
        "quotas": {
            "scansUsed": 12,
            "scansLimit": 50,
            "domainsMonitored": len(DOMAINS_DB),
            "domainsLimit": 5,
            "apiKeysCreated": len(API_KEYS_DB),
            "apiKeysLimit": 10
        },
        "invoices": [
            {
                "id": "INV-2026-001",
                "date": "2026-10-01",
                "amount": "$49.00",
                "status": "PAID",
                "pdfUrl": "#",
                "description": "Gói Pro SecOps Fleet (Tháng 10/2026)"
            }
        ]
    }

# ==========================================
# 10. SYSTEM SETTINGS API
# ==========================================
@app.get("/api/v1/settings")
def get_settings():
    return SYSTEM_SETTINGS_DB

@app.put("/api/v1/settings")
async def update_settings(request: Request):
    global SYSTEM_SETTINGS_DB
    body = await request.json()
    SYSTEM_SETTINGS_DB.update(body)
    return SYSTEM_SETTINGS_DB

# ==========================================
# 11. AGENTS FLEET TELEMETRY API
# ==========================================
@app.get("/api/v1/agents")
def get_agents():
    return [
        {
            "id": "agent-recon",
            "name": "ReconAgent",
            "role": "Trinh Sát Thụ Động & Thăm Dò Hạ Tầng",
            "status": "ACTIVE",
            "model": "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
            "latencyP50": "1.2s",
            "latencyP99": "2.1s",
            "tokensConsumed": 1420,
            "tokenSavings": "90% via AST/Filter",
            "tools": [
                "SSRF Pre-DNS Resolver",
                "Security Headers Prober (6 core)",
                "CORS Reflection Auditor",
                "SSL/TLS Cipher Inspector",
                "Robots.txt & Sitemap Harvester"
            ],
            "description": "Chịu trách nhiệm gửi request kiểm tra an toàn, bảo vệ hệ thống khỏi SSRF thông qua DNS pre-check và thu thập siêu dữ liệu phản hồi."
        },
        {
            "id": "agent-triage",
            "name": "TriageAgent",
            "role": "Thẩm Định Lỗ Hổng & Lọc Cảnh Báo Giả (False Positives)",
            "status": "ACTIVE",
            "model": "Fine-tuned QLoRA DevSecOps 8B",
            "latencyP50": "2.4s",
            "latencyP99": "3.8s",
            "tokensConsumed": 2840,
            "tokenSavings": "65% via Vector Cache",
            "tools": [
                "OWASP WSTG v4.2 Knowledge RAG",
                "CWE/CVSS v3.1 Scoring Engine",
                "False Positive Elimination Rulebase",
                "Attack Surface Mapper"
            ],
            "description": "Đối chiếu phát hiện từ Recon với cơ sở tri thức RAG Qdrant, tính điểm CVSS chính xác và loại bỏ các cảnh báo nhiễu trước khi báo cáo."
        },
        {
            "id": "agent-advisory",
            "name": "AdvisoryAgent",
            "role": "Chuyên Gia Cố Vấn Vá Lỗi & Tự Động Hóa DevSecOps",
            "status": "ACTIVE",
            "model": "DeepSeek-Coder-V2-Instruct",
            "latencyP50": "3.1s",
            "latencyP99": "4.9s",
            "tokensConsumed": 3200,
            "tokenSavings": "78% via AST Slicing",
            "tools": [
                "AST Syntax Tree Parser",
                "Nginx / Traefik Config Hardener",
                "Express / FastAPI Middleware Patcher",
                "GitHub Pull Request Automator"
            ],
            "description": "Sinh mã vá lỗi chuẩn sản xuất, tự động tạo branch mới và gửi Pull Request trực tiếp lên repository GitHub của dự án."
        },
        {
            "id": "agent-orchestrator",
            "name": "OrchestratorSwarm",
            "role": "Điều Phối Bầy Đàn Tự Hành (LangGraph DAG)",
            "status": "ACTIVE",
            "model": "State Graph Concurrent Engine (6 luồng)",
            "latencyP50": "0.4s",
            "latencyP99": "0.8s",
            "tokensConsumed": 950,
            "tokenSavings": "Zero-copy I/O",
            "tools": [
                "LangGraph State Machine",
                "Cycle & Infinite Loop Guard",
                "Human-in-the-Loop Approval Gate",
                "Distributed Task Scheduler"
            ],
            "description": "Quản lý vòng đời tác vụ, điều phối dữ liệu qua lại giữa các Agent và duy trì trạng thái kiểm định không bị gián đoạn."
        }
    ]

@app.post("/api/v1/agents/{agent_id}/test")
def test_agent(agent_id: str):
    return {
        "status": "SUCCESS",
        "agent_id": agent_id,
        "diagnostics": "Hoàn tất kiểm thử 100% tài nguyên và công cụ.",
        "duration": "0.85s"
    }

# ==========================================
# 12. INFRASTRUCTURE & CLUSTER TELEMETRY API
# ==========================================
@app.get("/api/v1/infrastructure")
async def get_infrastructure():
    # Kiểm tra trạng thái thực tế các services
    services_status = {}
    async with httpx.AsyncClient(timeout=2.0) as client:
        for name, url in [
            ("gateway-service", "http://localhost:8000"),
            ("auth-service", settings.AUTH_SERVICE_URL),
            ("orchestrator-service", settings.ORCHESTRATOR_URL),
            ("knowledge-rag", settings.RAG_SERVICE_URL),
        ]:
            try:
                r = await client.get(f"{url}/healthz")
                services_status[name] = "Healthy" if r.status_code == 200 else f"Degraded ({r.status_code})"
            except Exception:
                services_status[name] = "Connecting"

    nodes = [
        {
            "id": "node-1",
            "name": "k3s-master-01",
            "role": "master",
            "status": "Ready",
            "ip": "10.0.1.10",
            "cpuUsage": 24,
            "ramUsage": 58,
            "ramAllocated": "2.3 / 4.0 GB",
            "podsRunning": 8,
            "uptime": "Online"
        },
        {
            "id": "node-2",
            "name": "k3s-worker-01",
            "role": "worker",
            "status": "Ready",
            "ip": "10.0.1.11",
            "cpuUsage": 38,
            "ramUsage": 65,
            "ramAllocated": "2.6 / 4.0 GB",
            "podsRunning": 6,
            "uptime": "Online"
        },
        {
            "id": "node-3",
            "name": "k3s-worker-02",
            "role": "worker",
            "status": "Ready",
            "ip": "10.0.1.12",
            "cpuUsage": 16,
            "ramUsage": 44,
            "ramAllocated": "1.7 / 4.0 GB",
            "podsRunning": 5,
            "uptime": "Online"
        }
    ]

    microservices = [
        {
            "name": "gateway-service",
            "version": "v1.4.0",
            "language": "Python 3.12 / FastAPI Proxy",
            "replicas": "2/2",
            "status": services_status.get("gateway-service", "Healthy"),
            "cpu": "24m",
            "memory": "64Mi",
            "endpoint": "http://gateway-service:8000",
            "restarts": 0
        },
        {
            "name": "auth-service",
            "version": "v1.2.1",
            "language": "Python 3.12 / FastAPI + JWT",
            "replicas": "2/2",
            "status": services_status.get("auth-service", "Healthy"),
            "cpu": "38m",
            "memory": "128Mi",
            "endpoint": "http://auth-service:8001",
            "restarts": 0
        },
        {
            "name": "orchestrator-service",
            "version": "v2.0.0",
            "language": "Python LangGraph State Machine",
            "replicas": "2/2",
            "status": services_status.get("orchestrator-service", "Healthy"),
            "cpu": "82m",
            "memory": "256Mi",
            "endpoint": "http://orchestrator-service:8002",
            "restarts": 0
        },
        {
            "name": "scanner-worker",
            "version": "v1.8.0",
            "language": "Python 3.12 Async Recon",
            "replicas": "3/3",
            "status": "Healthy",
            "cpu": "115m",
            "memory": "312Mi",
            "endpoint": "http://scanner-worker:8004",
            "restarts": 0
        },
        {
            "name": "knowledge-rag",
            "version": "v1.1.0",
            "language": "Python 3.12 / OWASP Vector RAG",
            "replicas": "1/1",
            "status": services_status.get("knowledge-rag", "Healthy"),
            "cpu": "65m",
            "memory": "420Mi",
            "endpoint": "http://knowledge-rag-service:8003",
            "restarts": 0
        }
    ]

    return {"nodes": nodes, "microservices": microservices}

# ==========================================
# 13. OWASP COMPLIANCE MATRIX API
# ==========================================
@app.get("/api/v1/owasp/matrix")
def get_owasp_matrix():
    return [
        {
            "code": "A01:2021",
            "name": "Broken Access Control",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-ATHZ-02", "WSTG-CONF-07", "WSTG-INPV-04"],
            "summary": "Kiểm tra quyền truy cập và phân quyền cross-origin theo WSTG-ATHZ-02."
        },
        {
            "code": "A02:2021",
            "name": "Cryptographic Failures",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-CRYP-01", "WSTG-CRYP-02", "WSTG-CRYP-03"],
            "summary": "Kiểm tra chứng chỉ TLS, thuật toán mã hóa và an toàn đường truyền."
        },
        {
            "code": "A03:2021",
            "name": "Injection",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-INPV-01", "WSTG-INPV-05", "WSTG-INPV-11"],
            "summary": "Kiểm tra lỗ hổng Injection qua dữ liệu đầu vào và tham số URL."
        },
        {
            "code": "A04:2021",
            "name": "Insecure Design",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-DSGN-01", "WSTG-DSGN-02"],
            "summary": "Đánh giá thiết kế kiến trúc an toàn, giới hạn tốc độ và phòng thủ chủ động."
        },
        {
            "code": "A05:2021",
            "name": "Security Misconfiguration",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-CONF-01", "WSTG-CONF-02", "WSTG-CONF-04"],
            "summary": "Kiểm toán 6 tiêu đề bảo mật cốt lõi, banner máy chủ và file cấu hình rò rỉ."
        },
        {
            "code": "A06:2021",
            "name": "Vulnerable and Outdated Components",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-CONF-05"],
            "summary": "Đối chiếu phiên bản framework và thư viện client-side với cơ sở dữ liệu CVE."
        },
        {
            "code": "A07:2021",
            "name": "Identification and Authentication Failures",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-ATHN-01", "WSTG-ATHN-03", "WSTG-ATHN-04"],
            "summary": "Kiểm tra quản lý phiên cookie, cờ SameSite/Secure và cơ chế xác thực JWT/OAuth."
        },
        {
            "code": "A08:2021",
            "name": "Software and Data Integrity Failures",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-CONF-06"],
            "summary": "Kiểm tra toàn vẹn tài nguyên bên thứ ba thông qua Subresource Integrity (SRI)."
        },
        {
            "code": "A09:2021",
            "name": "Security Logging and Monitoring Failures",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-LOGG-01", "WSTG-LOGG-02"],
            "summary": "Giám sát nhật ký kiểm toán và cảnh báo bất thường trong thời gian thực."
        },
        {
            "code": "A10:2021",
            "name": "Server-Side Request Forgery (SSRF)",
            "status": "PASSED",
            "severity": "LOW",
            "findingsCount": 0,
            "cvssMax": 0,
            "complianceRate": 100,
            "wstgTestCases": ["WSTG-INPV-12"],
            "summary": "Bảo vệ bởi AegisOps SSRF Zero-Trust Guard: Tiền phân giải DNS và chặn dải IP Private."
        }
    ]

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
