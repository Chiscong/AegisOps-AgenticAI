import os

class GatewaySettings:
    PROJECT_NAME: str = "AegisOps API Gateway & Ingress Dispatcher"
    PORT: int = int(os.getenv("PORT", "8000"))
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
    ORCHESTRATOR_URL: str = os.getenv("ORCHESTRATOR_URL", "http://localhost:8002")
    RAG_SERVICE_URL: str = os.getenv("RAG_SERVICE_URL", "http://localhost:8003")

settings = GatewaySettings()
