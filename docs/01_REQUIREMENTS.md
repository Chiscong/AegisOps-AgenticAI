# ĐẶC TẢ YÊU CẦU DỰ ÁN (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)

> **Dự án:** AegisOps-AI (Autonomous Web Security Posture & Advisory Agentic Platform)  
> **Cấp độ:** Đồ án Tốt nghiệp Đại học / Nền tảng phỏng vấn Software / DevOps / AI Engineer  
> **Phiên bản:** 1.0.0

---

## 1. Mục tiêu và Phạm vi Dự án (Project Scope & Objectives)

### 1.1. Mục tiêu chính
1. Xây dựng một nền tảng Web có khả năng tiếp nhận yêu cầu phân tích an ninh mạng cho một trang web hoặc API bất kỳ.
2. Điều phối luồng làm việc tự hành (Agentic Workflow) sử dụng mô hình đa tác nhân (Multi-Agent System) nhằm:
   - Thu thập thông tin an ninh mạng thụ động (Passive Reconnaissance).
   - Đánh giá, đối chiếu phát hiện với tiêu chuẩn an ninh quốc tế (OWASP Top 10, CWE, NIST).
   - Tự động sinh báo cáo kỹ thuật và mã nguồn vá lỗi (Remediation Patches) tương ứng với Framework của mục tiêu.
3. Cung cấp giao diện Chatbot chuyên gia (SecOps Copilot) để lập trình viên tương tác, tra cứu và nhận tư vấn thời gian thực.
4. Triển khai theo kiến trúc Microservices hiện đại, hỗ trợ chạy trên cả môi trường Local (Windows/Linux) và cụm Kubernetes (K3s/Kubeadm) với chi phí hạ tầng tối thiểu (< $15/tháng).

### 1.2. Giới hạn phạm vi (Boundary & Non-Goals)
- **Trong phạm vi (In-Scope):**
  - Quét cấu hình an ninh thụ động (Security Headers, CORS Policy, SSL/TLS Cipher suites, Cookie Flags).
  - Thu thập thông tin Fingerprinting (WAF, Web Server, CMS, Frameworks).
  - Phân tích rò rỉ endpoint công khai qua `robots.txt`, `sitemap.xml`.
  - Phân tích mã nguồn/cấu hình thông qua AI Reasoning kết hợp RAG.
  - Sinh code mẫu khắc phục (Nginx, Apache, Express, FastAPI, Next.js).
- **Ngoài phạm vi (Out-of-Scope / Non-Goals):**
  - Không thực hiện tấn công từ chối dịch vụ (DoS/DDoS) hoặc khai thác lỗ hổng phá hoại (Destructive Exploitation, Drop Table, Ransomware).
  - Không bẻ khóa mật khẩu (Brute-force password/credential stuffing) nhằm tuân thủ quy định pháp lý và an toàn đạo đức mạng.

---

## 2. Yêu cầu Chức năng (Functional Requirements - FR)

### FR-01: Quản lý Mục tiêu & Kích hoạt Tác vụ Đánh giá (Target & Scan Management)
- **FR-01.1:** Người dùng có thể đăng ký tài khoản, đăng nhập qua JWT và nhập URL website cần kiểm định.
- **FR-01.2:** Hệ thống hỗ trợ 3 chế độ kiểm định:
  - *Lightweight Passive:* Chỉ kiểm tra Headers, SSL, CORS, Robots (thời gian < 15 giây).
  - *Standard Audit:* Thêm bước phân tích Fingerprint, Endpoint topology và AI OWASP Mapping (thời gian ~ 1 phút).
  - *Deep Advisory:* Bao gồm toàn bộ quy trình trên kết hợp sinh mã vá lỗi chi tiết và Threat Modeling (~ 2-3 phút).
- **FR-01.3:** Hỗ trợ cơ chế lập lịch quét định kỳ (Weekly/Monthly Cron Scans) cho các domain đã xác thực.

### FR-02: Động cơ Trinh sát Thụ động (Passive Reconnaissance Engine)
- **FR-02.1 (Headers Audit):** Kiểm tra sự hiện diện và tính hợp lệ của các headers:
  - `Content-Security-Policy (CSP)` (bắt lỗi `unsafe-inline`, `unsafe-eval`, wildcards).
  - `Strict-Transport-Security (HSTS)` (kiểm tra `max-age`, `includeSubDomains`, `preload`).
  - `X-Frame-Options` (nguy cơ Clickjacking).
  - `X-Content-Type-Options` (chống MIME-sniffing).
  - `Permissions-Policy` và `Referrer-Policy`.
- **FR-02.2 (CORS Misconfiguration):** Gửi các request với header `Origin` tùy biến (vd: `null`, `https://evil-attacker.com`) để kiểm tra hiện tượng phản chiếu `Access-Control-Allow-Origin` kèm `Access-Control-Allow-Credentials: true`.
- **FR-02.3 (TLS/SSL Posture):** Đánh giá phiên bản TLS (cảnh báo TLS 1.0, 1.1), kiểm tra thời hạn chứng chỉ X.509, nhà phát hành, và danh sách Cipher Suites yếu.
- **FR-02.4 (Information Disclosure):** Phát hiện lộ banner công nghệ qua `Server`, `X-Powered-By`, `X-AspNet-Version`, và rò rỉ endpoint nội bộ qua `robots.txt`.

### FR-03: Điều phối Đa Tác nhân AI & Hệ thống LLM Chuyên biệt (Multi-Agent & DevSecOps LLM)
- **FR-03.1 (Role Separation):** Hệ thống phân tách thành 3 Agent độc lập:
  - *Recon Agent:* Chuyên trách gọi Tools, chuẩn hóa dữ liệu HTTP thô thành JSON cấu trúc.
  - *Triage Agent:* Đóng vai trò AppSec Lead, sử dụng mô hình chuyên biệt được fine-tune (`SecOps-Llama-3.1-8B`) kết hợp RAG trên OWASP WSTG v4.2 và CWE để loại bỏ cảnh báo sai (False Positives) và gán Severity chuẩn xác.
  - *Advisory Agent:* Đóng vai trò Senior DevSecOps, nhận danh sách lỗ hổng và Tech Stack của website để sinh mã nguồn vá lỗi chính xác (Drop-in fix snippet) và tự động đóng gói dưới dạng Git Patch.
- **FR-03.2 (Streaming Thought Logs):** Toàn bộ quá trình tư duy, gọi Tool, và kết luận của Agent phải được truyền theo thời gian thực về Frontend qua Server-Sent Events (SSE).
- **FR-03.3 (CI/CD Pipeline Integration):** Hỗ trợ Webhook và API Token để tích hợp vào GitHub Actions / GitLab CI, tự động kích hoạt kiểm tra an ninh trên môi trường Staging/Preview và tự động mở PR vá lỗi (Auto-Remediation Pull Request).

### FR-04: Báo cáo Thẩm định & Xuất Dữ liệu (Reporting & Exporting)
- **FR-04.1:** Hiển thị Dashboard trực quan: Điểm số an ninh mạng (Aegis Security Score 0 - 100), Radar Chart phân bố rủi ro theo 10 hạng mục OWASP.
- **FR-04.2:** Cho phép lọc các phát hiện theo mức độ nghiêm trọng, xem bằng chứng thô (Raw Evidence), phân tích tác động (Impact Analysis) và hướng dẫn khắc phục.
- **FR-04.3:** Hỗ trợ xuất báo cáo hoàn chỉnh ra định dạng PDF hoặc Markdown để gửi cho khách hàng hoặc ban giám đốc.

### FR-05: SecOps Copilot Chatbot (Interactive Advisory)
- **FR-05.1:** Lập trình viên có thể mở khung chat trực tiếp tại mỗi phiên quét để hỏi sâu hơn (vd: *"Website của tôi viết bằng Next.js 14, cấu hình CSP như thế nào để không bị vỡ giao diện?"*).
- **FR-05.2:** Áp dụng Retrieval-Augmented Generation (RAG) để câu trả lời bám sát tiêu chuẩn bảo mật chính thống, không bịa đặt.

---

## 3. Yêu cầu Phi Chức năng (Non-Functional Requirements - NFR)

### NFR-01: Hiệu năng & Độ trễ (Performance & Latency)
- API Gateway phản hồi các truy vấn thông thường < 100ms.
- Pha trinh sát thụ động hoàn thành < 15 giây cho một tên miền tiêu chuẩn.
- Luồng streaming phản hồi token đầu tiên của AI Agent hiển thị trên giao diện người dùng < 1.5 giây.

### NFR-02: Tính Khả dụng & Mở rộng (Availability & Scalability)
- Kiến trúc Microservices cho phép scale độc lập Scanner Workers và Agent Orchestrator theo tải công việc.
- Hệ thống hỗ trợ xử lý hàng đợi bất đồng bộ (Asynchronous Task Queue qua Redis), tránh tắc nghẽn khi có nhiều yêu cầu quét đồng thời.

### NFR-03: Tối ưu Chi phí Hạ tầng (Cost Optimization Standard)
- Toàn bộ hệ thống microservices khi chạy trên môi trường Production (Kubernetes K3s) chỉ tiêu tốn tối đa **2 vCPU và 4GB RAM**, cho phép triển khai trên 2 node VPS giá rẻ (hoặc EC2 Spot/Lightsail) với tổng chi phí < $15/tháng.
- Tận dụng mô hình LLM chi phí thấp nhưng chất lượng cao (Gemini 2.5 Flash hoặc Claude 3.5 Haiku) với chi phí token ước tính < $0.005 cho mỗi lần quét toàn diện.

### NFR-04: Tính Bảo mật & Toàn vẹn (Security & Data Privacy)
- Xác thực Stateless thông qua JWT (JSON Web Tokens) với thuật toán ký `RS256` hoặc `HS256`.
- Mật khẩu người dùng được băm an toàn bằng thuật toán `Argon2id` hoặc `Bcrypt`.
- Công cụ quét chỉ thực thi các tác vụ an toàn, có gắn `User-Agent: AegisOps-Security-Auditor/1.0 (+http://your-domain.com/bot-info)` để đảm bảo tính minh bạch.
- Dữ liệu quét của từng người dùng được cô lập hoàn toàn (Multi-tenancy isolation) theo `user_id` và `organization_id`.

### NFR-05: Khả năng Chạy Đa Nền tảng (Cross-Platform Compatibility)
- Hỗ trợ triển khai phát triển (Local Development) trơn tru trên cả **Windows 10/11 (PowerShell / WSL2 / Docker Desktop)** và **Linux (Ubuntu 22.04 / Debian / RHEL)** chỉ bằng duy nhất một lệnh `docker compose up`.
