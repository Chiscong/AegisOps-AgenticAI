# KỊCH BẢN BẢO VỆ ĐỒ ÁN & BỘ CÂU HỎI PHỎNG VẤN CHUYÊN SÂU (DEFENSE & INTERVIEW CHEATSHEET)

> **Dành cho:** Phỏng vấn vị trí Backend Engineer / DevSecOps Engineer / AI Agent Systems Engineer  
> **Bộ câu hỏi:** 10 câu hỏi hóc búa nhất và câu trả lời chuẩn kiến trúc sư hệ thống.

---

## 🎯 Phần 1: Bài Thuyết Trình Mở Đầu (1-Minute Elevator Pitch)

> *"Kính thưa Hội đồng / Anh chị phỏng vấn, dự án của em là **AegisOps-AI — Nền tảng AI Agent tự hành đánh giá an ninh mạng và tư vấn DevSecOps cho ứng dụng Web**.
>
> Xuất phát từ thực tế các công cụ scanner truyền thống như ZAP hay Nuclei tạo ra quá nhiều cảnh báo rác (False Positives) và chỉ cung cấp văn bản cảnh báo chung chung mà không giúp lập trình viên viết mã vá lỗi, em đã xây dựng một hệ thống đa tác nhân (Multi-Agent System) gồm 3 Agent chuyên biệt: **Trinh sát (Recon)**, **Thẩm định ngữ cảnh (Triage)** và **Tư vấn khắc phục (Advisory)**.
>
> Về mặt kỹ thuật, hệ thống được thiết kế theo kiến trúc **Microservices chuẩn mực**, tối ưu hóa chi phí vận hành cực hạn: thay vì phụ thuộc vào các dịch vụ đám mây đắt đỏ (như AWS EKS tốn hàng trăm USD), em đã tự triển khai một cụm **Kubernetes K3s trên 2-3 node bare-metal/VPS giá rẻ** (mô hình em đã kiểm chứng thành công trên dự án `hubt-connect`), kết hợp Server-Sent Events (SSE) để stream tiến trình tư duy của AI và RAG cục bộ trên chuẩn OWASP WSTG với chi phí vận hành dưới $15/tháng."*

---

## 💡 Phần 2: 10 Câu Hỏi Phỏng Vấn Kỹ Thuật Chuyên Sâu & Câu Trả Lời Mẫu

### Câu 1: "Tại sao em chọn kiến trúc Microservices thay vì Monolith cho đồ án này?"
- **Trả lời:** 
  - *"Dự án có sự khác biệt rõ rệt về đặc tính tải (Workload Characteristics) giữa các thành phần:
    1. `scanner-worker-service` là tác vụ I/O-bound và Network-bound nặng (gửi hàng trăm HTTP request, kiểm tra SSL, phân tích socket).
    2. `orchestrator-service` phụ thuộc vào tốc độ phản hồi và streaming token của mô hình ngôn ngữ lớn (LLM-bound).
    3. `frontend-service` và `gateway-service` đòi hỏi độ trễ cực thấp cho tương tác người dùng.
  - Nếu gom chung vào một khối Monolith, khi có nhiều yêu cầu quét cùng lúc, Worker I/O sẽ làm nghẽn Event Loop của Backend và gây timeout kết nối người dùng. Tách thành Microservices qua hàng đợi Redis giúp em scale độc lập số lượng Worker pods dựa trên độ dài hàng đợi (Queue Length) mà không tốn tài nguyên cho toàn bộ ứng dụng."*

---

### Câu 2: "Làm thế nào để hệ thống ngăn chặn hiện tượng Ảo Giác (Hallucination) của AI khi đánh giá lỗ hổng bảo mật?"
- **Trả lời:**
  - *"Em áp dụng cơ chế **Deterministic Grounding & Strict Contract**:
    1. **Bằng chứng thực nghiệm (Hard Evidence First):** Agent không được phép tự suy diễn lỗ hổng từ tên miền. Trước khi Agent Triage làm việc, Worker bắt buộc phải trích xuất được Response Headers thật, status code thật, hoặc Cipher Suite thật.
    2. **RAG Grounding:** Em nhúng cơ sở tri thức OWASP WSTG v4.2 và MITRE CWE vào ChromaDB. Khi phát hiện một cấu hình nghi vấn, hệ thống tìm kiếm vector các tiêu chí kỹ thuật chuẩn xác và truyền vào prompt làm ràng buộc (Contextual Constraint).
    3. **Schema Validation:** Toàn bộ kết quả đầu ra của LLM bị khóa chặt bằng Pydantic V2 với trường `evidence` bắt buộc. Nếu LLM báo 'Có lỗi CORS' nhưng mảng `evidence` không trích xuất được giá trị `Access-Control-Allow-Origin` từ raw header, Pydantic validator sẽ tự động loại bỏ phát hiện đó."*

---

### Câu 3: "Tại sao em không dùng WebSocket mà lại chọn Server-Sent Events (SSE) để truyền log và tiến trình của Agent?"
- **Trả lời:**
  - *"Em chọn SSE dựa trên nguyên tắc **Right Tool for the Right Job**:
    1. Tác vụ của Agent là luồng dữ liệu **một chiều (Unidirectional)**: Backend liên tục stream các bước suy nghĩ (Thought Logs), trạng thái quét và token về phía Client. Client không cần gửi dữ liệu liên tục ngược lại trong suốt quá trình quét.
    2. SSE chạy trực tiếp trên giao thức HTTP/1.1 hoặc HTTP/2 tiêu chuẩn, tương thích hoàn toàn với các Ingress Controller, Load Balancer và WAF mà không cần cấu hình nâng cấp giao thức phức tạp (Connection: Upgrade) như WebSocket.
    3. SSE có sẵn cơ chế tự động kết nối lại (`auto-reconnect`) và phân tách sự kiện bằng `event: id:` rất nhẹ và ổn định."*

---

### Câu 4: "Kiến trúc K3s 2-3 Node của em xử lý sự cố thế nào nếu một Worker Node bị sập (Node Failure)?"
- **Trả lời:**
  - *"Trên cụm K3s (tương tự kinh nghiệm em vận hành `hubt-connect`):
    1. **Replica & Anti-Affinity:** Các core service quan trọng (`gateway`, `auth`, `worker`) đều được cấu hình `replicas: 2` và `podAntiAffinity` để Kubernetes không xếp 2 pod cùng loại lên cùng một node vật lý.
    2. **Node Heartbeat & Eviction:** Nếu một Worker Node bị mất điện hoặc mất mạng quá thời gian `node-monitor-grace-period` (mặc định 40s), Control Plane sẽ đánh dấu node là `NotReady` và tự động điều phối (reschedule) các Pod chạy trên node đó sang node còn lại.
    3. **Stateful Data Safety:** Đối với PostgreSQL và Redis, em duy trì snapshot backup tự động định kỳ vào ổ đĩa ngoài hoặc S3-compatible storage để tránh rủi ro mất dữ liệu."*

---

### Câu 5: "Công cụ của em có bị coi là công cụ tấn công bất hợp pháp không? Em kiểm soát khía cạnh đạo đức và pháp lý ra sao?"
- **Trả lời:**
  - *"Dự án của em được thiết kế theo chuẩn **Non-Destructive Passive Auditing (Kiểm toán thụ động không xâm lấn)**:
    1. Toàn bộ các gói tin gửi đi chỉ là HTTP GET/HEAD an toàn vào các tài nguyên công khai mà bất kỳ trình duyệt nào cũng tải về khi truy cập web.
    2. Tuyệt đối không chứa module khai thác sâu (Exploit Payload Injection, Fuzzing bạo lực, hoặc DoS).
    3. Mọi request đều mang header `User-Agent: AegisOps-Security-Auditor` dẫn về trang thông tin minh bạch của hệ thống.
    4. Trong thực tế, các nền tảng lớn như Mozilla Observatory hay SecurityHeaders.com cũng vận hành hoàn toàn dựa trên mô hình kiểm toán thụ động này."*

---

### Câu 6: "Em tối ưu chi phí hạ tầng AWS như thế nào để đạt mức dưới $15/tháng?"
- **Trả lời:**
  - *"Em cắt giảm triệt để 4 loại chi phí đắt đỏ nhất của AWS:
    1. **Bỏ EKS Managed ($73/tháng):** Thay bằng K3s tự cài đặt, tiêu thụ dưới 512MB RAM cho Control Plane.
    2. **Bỏ AWS ALB ($22/tháng):** Dùng Ingress-Nginx chạy trực tiếp trên cổng HostPort của node kết hợp Cloudflare Proxy miễn phí.
    3. **Bỏ AWS EBS gp3 dynamic storage:** Dùng Local-Path Provisioner tận dụng trực tiếp ổ SSD NVMe gắn liền của máy chủ.
    4. **Dùng EC2 Spot Instances hoặc Lightsail:** 2-3 máy ảo với giá chỉ $3.5 - $5/tháng mỗi máy."*

---

### Câu 7: "Nếu có 1,000 người dùng cùng bấm nút quét một lúc, hệ thống của em giải quyết bài toán thắt cổ chai ra sao?"
- **Trả lời:**
  - *"Hệ thống sử dụng cơ chế **Asynchronous Job Decoupling**:
    1. API Gateway khi nhận request sẽ không chạy quét ngay lập tức, mà chỉ tạo một bản ghi `status: PENDING` trong PostgreSQL và đẩy `scan_id` vào **Redis Queue**. Request trả về `HTTP 202 Accepted` ngay trong 50ms.
    2. Tầng `scanner-worker-service` hoạt động theo mô hình Consumer kéo việc (Pull-based). Số lượng worker pod có thể tự động co giãn thông qua **Kubernetes HPA (Horizontal Pod Autoscaler)** dựa trên độ dài hàng đợi Redis (dùng KEDA - Kubernetes Event-driven Autoscaling).
    3. Điều này đảm bảo hệ thống không bao giờ bị sập do quá tải RAM/CPU, các yêu cầu quét được xếp hàng xử lý tuần tự và người dùng theo dõi tiến độ qua SSE."*

---

### Câu 8: "Tại sao em chọn ChromaDB hoặc Qdrant thay vì dùng luôn pgvector trong PostgreSQL?"
- **Trả lời:**
  - *"Lý do em dùng ChromaDB cục bộ hoặc pgvector:
    1. Với quy mô đồ án và tối ưu chi phí, ChromaDB embedded chạy in-process hoặc container nhỏ tiêu thụ dưới 150MB RAM, không yêu cầu cài đặt extension C phức tạp.
    2. Nếu nâng cấp lên cụm Production lớn, em sẽ ưu tiên tích hợp **pgvector** ngay trên PostgreSQL có sẵn để đạt được kiến trúc 'All-in-One Data Store', giúp giảm số lượng microservices cần quản lý và hỗ trợ ACID transaction đồng bộ giữa metadata và vector embeddings."*

---

### Câu 9: "Đâu là điểm khác biệt lớn nhất giữa việc dùng một con AI Agent và việc lập trình viên tự copy kết quả ZAP ném vào ChatGPT?"
- **Trả lời:**
  - *"Khác biệt cốt lõi nằm ở **Khả năng Tự hành Khép kín (Autonomous Closed-Loop)**:
    1. Việc copy thủ công vào ChatGPT phụ thuộc vào con người, dễ để lộ dữ liệu nhạy cảm ra ngoài, và ChatGPT không thể trực tiếp kiểm tra hay xác minh xem kết quả đó có thật hay không.
    2. AegisOps là một Agent có **Tool Calling**: Agent tự động gửi request kiểm tra chéo, tự đối chiếu WSTG Guide qua RAG, tự phân tích Tech Stack (phát hiện server dùng Express hay FastAPI) để sinh đúng đoạn code middleware tương ứng, và lưu trữ lịch sử kiểm định vào cơ sở dữ liệu để vẽ biểu đồ xu hướng an ninh mạng theo thời gian."*

---

### Câu 10: "Nếu được tiếp tục phát triển dự án này lên mức thương mại hóa (Commercial SaaS), em sẽ cải tiến điều gì?"
- **Trả lời:**
  - *"Em sẽ tập trung vào 3 hướng chính:
    1. **GitHub App Integration (DevSecOps CI/CD):** Tự động quét website staging sau mỗi Pull Request và tự động tạo PR đề xuất sửa lỗi (Auto-Remediation PR).
    2. **Multi-Tenant Organization RBAC:** Cho phép các công ty tạo Team, phân quyền Auditor, Quản lý nhiều dự án và gán chính sách tuân thủ (Compliance: PCI-DSS, SOC2, ISO 27001).
    3. **Active Sandboxed Fuzzing:** Bổ sung môi trường container cô lập để giả lập tấn công hộp xám an toàn (Automated Safe Exploit Verification)."*
