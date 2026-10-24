# AegisOps-AI: Autonomous DevSecOps AgenticOps Platform

> **Đồ án Tốt nghiệp Xuất sắc & Bản thiết kế Kỹ thuật Chuyên sâu Phỏng vấn**  
> *Hệ thống AI Agent tự hành đánh giá an ninh mạng, thẩm định lỗ hổng và tư vấn vá lỗi DevSecOps (Autonomous Security Posture Management & Remediation) theo kiến trúc Microservices tối ưu chi phí.*

---

## 📌 1. TỔNG QUAN HỆ THỐNG AGENTICOPS TRONG DEVSECOPS

### 1.1. Khái niệm AgenticOps trong DevSecOps là gì?
Khác với quy trình DevSecOps truyền thống phụ thuộc vào các công cụ quét tĩnh/động (SAST/DAST) chạy rời rạc trong CI/CD pipeline và tạo ra hàng nghìn cảnh báo rác khiến kỹ sư bảo mật kiệt sức (Alert Fatigue), **AegisOps-AI** triển khai mô hình **AgenticOps**:
- **Tự trị nhận thức (Cognitive Autonomy):** Hệ thống không chỉ "báo lỗi", mà tự lập luận (Reasoning), tự truy vấn ngữ cảnh (Contextual RAG), tự kiểm tra chéo (Verification Loop) để loại bỏ 85% False Positives.
- **Tự động vá lỗi (Closed-loop Remediation):** Tự phân tích mã nguồn và cấu hình máy chủ để sinh ra mã vá lỗi (Patch Snippet / Pull Request) tương thích 100% với Tech Stack của mục tiêu.
- **Tư vấn bảo mật tương tác (Interactive SecOps Copilot):** Cho phép lập trình viên chất vấn, yêu cầu giải thích rủi ro kinh doanh (Business Impact), và hỗ trợ mô hình hóa mối đe dọa (Threat Modeling: STRIDE / DREAD).

---

## 🏗️ 2. KIẾN TRÚC TỔNG THỂ & TECH STACK CHI TIẾT

```
                                      [ CLIENT / WEB BROWSER ]
                                                  │
                                                  ▼ (Port 80/443 HTTPS)
                               [ Cloudflare Proxy / Ingress-Nginx ]
                                                  │
             ┌────────────────────────────────────┼────────────────────────────────────┐
             │ (Port 3000)                        │ (Port 8000)                        │ (Port 8001)
             ▼                                    ▼                                    ▼
    [ 1. Web Portal FE ]                 [ 2. API Gateway ]                   [ 3. Auth Service ]
    • Next.js 14 (App Router)            • FastAPI (Python 3.12)              • Python FastAPI / Go
    • TypeScript, TailwindCSS            • Token Bucket Rate Limiting         • JWT RS256, Argon2id
    • SSE Stream Reader / Lucide         • Reverse Proxy & Request Validator  • RBAC (Admin, Auditor)
             │                                    │                                    │
             └────────────────────────────────────┼────────────────────────────────────┘
                                                  │
                                                  ▼ (Internal REST / gRPC)
                                      [ 4. Agent Orchestrator ] (Port 8002)
                                      • Python 3.12 + LangGraph / ReAct StateMachine
                                      • Hybrid LLM Router (Fine-tuned SecOps-LLM + Cloud API)
                                      • Eager Tool Dispatcher (Streaming JSON Parser)
                                                  │
                     ┌────────────────────────────┴────────────────────────────┐
                     │ (Job Queue via Redis)                                   │ (Vector Query)
                     ▼                                                         ▼
        [ 5. Scanner Worker Service ]                             [ 6. Knowledge RAG Service ]
        • Python 3.12 Async Workers                               • FastAPI + ChromaDB / Qdrant
        • Non-destructive Passive Recon                           • OWASP WSTG v4.2 + CWE Top 25
        • Headers, SSL/TLS, CORS, Robots                          • Hybrid Search (Dense + BM25)
                     │                                                         │
                     └────────────────────────────┬────────────────────────────┘
                                                  ▼
                                         [ 7. Data & Event Store ]
                                         • PostgreSQL 16 (Relational & JSONB Data)
                                         • Redis 7 (Queue Broker & SSE Pub/Sub)
```

---

## 🧠 3. HỆ THỐNG LLM & PHƯƠNG PHÁP HUẤN LUYỆN MODEL (LLM & FINE-TUNING)

Dự án áp dụng chiến lược kết hợp **Hybrid LLM Architecture**:

```
[ Input: Raw Recon Evidence + Target Tech Stack ]
                       │
                       ▼
[ Stage 1: Context Filter & Token Compression ] ──> Giảm 90% token thừa (Regex/AST)
                       │
                       ▼
         [ Stage 2: Hybrid LLM Router ]
         ├── Nhiệm vụ Lập luận Phức tạp ──> Cloud Foundation Model (Gemini 2.5 Flash / Claude 3.5 Sonnet)
         └── Nhiệm vụ Triage & Sinh Code ──> Specialized Fine-Tuned Model (SecOps-Llama-3.1-8B)
                       ▲
                       │
    [ Huấn luyện bằng QLoRA + DPO (Direct Preference Optimization) ]
    • Dataset: 25,000 cặp (Vulnerability Finding -> Root Cause -> Remediation Code PR)
    • RAG Grounding: OWASP WSTG v4.2 + MITRE CWE Database
```

---

## 📂 4. DANH MỤC TÀI LIỆU CHI TIẾT TRONG THƯ MỤC `docs/`

Anh Tú hãy đọc và tham khảo trực tiếp các tệp tài liệu chuyên sâu:

1. **[`docs/01_REQUIREMENTS.md`](file:///home/congpc/AegisOps-AgenticAI/docs/01_REQUIREMENTS.md)**: Đặc tả toàn diện yêu cầu chức năng (FR) & phi chức năng (NFR), chuẩn SRS đồ án tốt nghiệp.
2. **[`docs/02_MICROSERVICES_ARCHITECTURE.md`](file:///home/congpc/AegisOps-AgenticAI/docs/02_MICROSERVICES_ARCHITECTURE.md)**: Thiết kế chi tiết 5 Microservices, lược đồ cơ sở dữ liệu PostgreSQL (JSONB evidence), và sơ đồ luồng sự kiện.
3. **[`docs/03_COST_OPTIMIZED_K8S_AWS.md`](file:///home/congpc/AegisOps-AgenticAI/docs/03_COST_OPTIMIZED_K8S_AWS.md)**: Chiến lược triển khai K3s 2-3 nodes (mô hình `hubt-connect`), tối ưu chi phí AWS < $15/tháng.
4. **[`docs/04_DEV_GUIDE_WINDOWS_LINUX.md`](file:///home/congpc/AegisOps-AgenticAI/docs/04_DEV_GUIDE_WINDOWS_LINUX.md)**: Hướng dẫn cài đặt, debug và khởi chạy 1-click trên cả Windows 11 và Linux.
5. **[`docs/05_INTERVIEW_DEFENSE_CHEATSHEET.md`](file:///home/congpc/AegisOps-AgenticAI/docs/05_INTERVIEW_DEFENSE_CHEATSHEET.md)**: Kịch bản bảo vệ đồ án và 10 câu hỏi phỏng vấn kiến trúc sư DevSecOps.
6. **[`docs/06_LLM_TRAINING_AND_RAG_PIPELINE.md`](file:///home/congpc/AegisOps-AgenticAI/docs/06_LLM_TRAINING_AND_RAG_PIPELINE.md)**: Cẩm nang chuyên sâu: Quy trình huấn luyện mô hình SecOps-LLM (QLoRA, DPO), định dạng Dataset, RAG Hybrid Search và kiểm thử mô hình.
7. **[`docs/07_DEVSECOPS_AGENTIC_WORKFLOW_AND_CODE.md`](file:///home/congpc/AegisOps-AgenticAI/docs/07_DEVSECOPS_AGENTIC_WORKFLOW_AND_CODE.md)**: Hướng dẫn chi tiết cách viết code: Clean Architecture, LangGraph State Machine, Eager Tool Dispatcher, và mã nguồn mẫu hoàn chỉnh.
8. **[`docs/08_DEFENSE_IN_DEPTH_CYBERSECURITY.md`](file:///home/congpc/AegisOps-AgenticAI/docs/08_DEFENSE_IN_DEPTH_CYBERSECURITY.md)**: **[MỚI]** Chiến lược Bảo mật Toàn diện & Phòng thủ Đa tầng (Defense-in-Depth): Triệt tiêu SSRF, Indirect Prompt Injection, Decompression Bomb, BOLA/IDOR, K8s Zero-Trust NetworkPolicy, và Cloudflare WAF.
