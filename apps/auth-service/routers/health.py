from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/healthz")
def healthcheck():
    return {
        "status": "Healthy",
        "service": "auth-service",
        "version": "1.2.1",
        "uptime": "active"
    }
