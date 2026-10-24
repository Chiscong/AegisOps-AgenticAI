# Microservices Applications Directory

Thư mục này chứa mã nguồn của các microservices độc lập:

1. `frontend/`: Next.js 14 App Router, TailwindCSS, SSE Streaming Dashboard.
2. `gateway-service/`: FastAPI API Gateway, Reverse Proxy, JWT verification & Rate Limiting (Port 8000).
3. `auth-service/`: User Authentication & Role-Based Access Control (Port 8001).
4. `orchestrator-service/`: AI Multi-Agent State Machine (LangGraph, Eager Dispatcher, Hybrid LLM Router) (Port 8002).
5. `scanner-worker/`: Redis Task Consumer thực hiện trinh sát mạng an toàn chống SSRF (Port 8004 / Celery Worker).
6. `knowledge-rag/`: ChromaDB Vector Store chứa tiêu chuẩn OWASP WSTG v4.2 và MITRE CWE (Port 8003).
