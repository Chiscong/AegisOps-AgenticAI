import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import query

app = FastAPI(
    title="AegisOps Knowledge RAG Service",
    version="1.1.0",
    description="Microservice cung cấp cơ sở tri thức an ninh mạng OWASP WSTG v4.2 và mã vá lỗi DevSecOps tự động."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthcheck():
    return {
        "status": "Healthy",
        "service": "knowledge-rag",
        "version": "1.1.0"
    }

app.include_router(query.router)

# Alias cho copilot chat từ gateway
app.add_api_route("/api/v1/copilot/chat", query.copilot_chat, methods=["POST"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
