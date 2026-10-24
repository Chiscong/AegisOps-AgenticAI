# HƯỚNG DẪN CÀI ĐẶT & PHÁT TRIỂN TRÊN WINDOWS VÀ LINUX (CROSS-PLATFORM DEV GUIDE)

> **Dự án:** AegisOps-AI  
> **Mục tiêu:** Cài đặt và chạy thử nghiệm hệ thống chỉ trong 1 lệnh duy nhất, hoạt động nhất quán trên cả Windows 10/11 và Linux (Ubuntu/Debian).

---

## 1. Yêu cầu Tiên quyết (Prerequisites)

| Công cụ | Phiên bản khuyến nghị | Ghi chú trên Windows | Ghi chú trên Linux |
| :--- | :--- | :--- | :--- |
| **Docker & Docker Compose** | Docker v24.0+, Compose v2.20+ | Docker Desktop (bật WSL2 Backend) | Docker Engine + `docker-compose-plugin` |
| **Python** | 3.11 hoặc 3.12 | Tải từ python.org (tích "Add to PATH") | `sudo apt install python3 python3-pip python3-venv` |
| **Node.js** | 18.x hoặc 20.x LTS | Tải từ nodejs.org | Cài qua NVM hoặc NodeSource PPA |
| **Git** | 2.40+ | Git for Windows | `sudo apt install git` |

---

## 2. Thiết lập Biến Môi trường Chung (`.env`)

Tại thư mục gốc `AegisOps-AgenticAI/`, sao chép tệp mẫu:
```bash
# Trên Linux/macOS:
cp .env.example .env

# Trên Windows PowerShell:
Copy-Item .env.example .env
```

Nội dung tệp `.env`:
```ini
# ==========================================
# CẤU HÌNH HỆ THỐNG AEGIS OPS AGENTIC AI
# ==========================================

# 1. Cơ sở dữ liệu & Caching
POSTGRES_USER=aegis_admin
POSTGRES_PASSWORD=AegisSecurePass2026!
POSTGRES_DB=aegisops_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379

# 2. Cấu hình Bảo mật JWT
JWT_SECRET_KEY=super-secret-jwt-key-change-in-production-2026-xyz
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120

# 3. Khóa API Trí tuệ Nhân tạo (Chọn một trong hai)
# Ưu tiên Gemini vì tốc độ cực cao và chi phí thấp:
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere123456789
OPENAI_API_KEY=sk-proj-YourOpenAIApiKeyHereOptional

# 4. Cấu hình Mạng Microservices
GATEWAY_PORT=8000
AUTH_SERVICE_PORT=8001
ORCHESTRATOR_PORT=8002
RAG_SERVICE_PORT=8003
FRONTEND_PORT=3000
```

---

## 3. Khởi chạy bằng Docker Compose (Khuyên dùng - Chạy được trên cả Windows & Linux)

Phương thức này tự động dựng toàn bộ 5 Microservices + PostgreSQL + Redis trong các container riêng biệt.

### Cách thực hiện:
```bash
# Khởi động toàn bộ cụm dịch vụ dưới nền:
docker compose up -d --build

# Theo dõi logs trực tiếp của cụm AI Orchestrator:
docker compose logs -f orchestrator-service

# Kiểm tra tình trạng sức khỏe các container:
docker compose ps
```

### Các cổng truy cập sau khi khởi động:
- 🌐 **Giao diện Web App (Next.js):** [http://localhost:3000](http://localhost:3000)
- 🔌 **API Gateway Documentation (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🧠 **Orchestrator Agent Swagger:** [http://localhost:8002/docs](http://localhost:8002/docs)
- 📚 **Knowledge RAG Swagger:** [http://localhost:8003/docs](http://localhost:8003/docs)

---

## 4. Chạy Trực tiếp Từng Service Không Cần Docker (Local Development / Debugging)

Khi anh Tú muốn sửa code nhanh và dùng debugger (VSCode / PyCharm), có thể chạy trực tiếp trên máy:

### 4.1. Khởi chạy Database & Redis (Bằng Docker nhẹ):
```bash
docker run -d --name local-postgres -p 5432:5432 -e POSTGRES_USER=aegis_admin -e POSTGRES_PASSWORD=AegisSecurePass2026! -e POSTGRES_DB=aegisops_db postgres:16-alpine
docker run -d --name local-redis -p 6379:6379 redis:7-alpine
```

### 4.2. Khởi chạy Backend Services (Python 3.12):

#### A. Trên Linux (Ubuntu / WSL2):
```bash
# Tạo và kích hoạt môi trường ảo:
python3 -m venv venv
source venv/bin/activate

# Cài đặt thư viện:
pip install -r requirements.txt

# Khởi chạy Orchestrator Service:
uvicorn orchestrator_service.main:app --host 0.0.0.0 --port 8002 --reload
```

#### B. Trên Windows (PowerShell):
```powershell
# Tạo và kích hoạt môi trường ảo:
python -m venv venv
.\venv\Scripts\Activate.ps1

# Cài đặt thư viện:
pip install -r requirements.txt

# Khởi chạy Orchestrator Service:
uvicorn orchestrator_service.main:app --host 127.0.0.1 --port 8002 --reload
```

### 4.3. Khởi chạy Frontend Web Portal (Next.js 14):
```bash
cd frontend-service
npm install
npm run dev
# Truy cập giao diện tại http://localhost:3000
```

---

## 5. Kịch bản Kiểm thử Tự động (Smoke Test Checklist)

Sau khi cài đặt xong, hãy chạy kịch bản kiểm tra này để chắc chắn toàn bộ pipeline hoạt động:

```bash
# 1. Kiểm tra Gateway
curl -s http://localhost:8000/health | grep "ONLINE"

# 2. Gửi lệnh yêu cầu AI Agent quét trang web thử nghiệm (ví dụ: example.com)
curl -X POST http://localhost:8000/api/v1/scans \
  -H "Content-Type: application/json" \
  -d '{"target_url": "https://example.com", "scan_depth": "standard"}'

# 3. Kiểm tra xem Redis có nhận được log streaming không:
docker exec -it aegisops-redis redis-cli monitor
```
Nếu màn hình terminal xuất hiện các dòng phản hồi log của `ReconAgent` và `TriageAgent`, hệ thống đã sẵn sàng 100%!
