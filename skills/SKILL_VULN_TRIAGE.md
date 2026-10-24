---
name: skill-vuln-triage
description: Năng lực thẩm định, phân loại lỗ hổng an ninh mạng, ánh xạ vào OWASP Top 10 và CWE, lọc bỏ cảnh báo giả mạo (False Positives) dựa trên cơ sở tri thức RAG.
---

# SKILL: Vulnerability Triage & Context Reasoning (Triage Agent)

## 1. Mục đích & Vai trò
Kỹ năng này trao quyền cho **Triage Agent** hoạt động như một Trưởng nhóm An toàn Ứng dụng (Lead AppSec Analyst). Agent nhận dữ liệu trinh sát thô từ `Recon Agent`, truy vấn cơ sở tri thức chuẩn (OWASP WSTG v4.2, CWE Top 25) thông qua Vector Search, phân tích ngữ cảnh và loại bỏ các cảnh báo sai trước khi đưa ra kết luận.

## 2. Quy trình Lập luận Đa bước (Multi-Step Reasoning Framework)

```
[ Nhận Recon JSON Data ] 
         │
         ▼
[ Bước 1: Tra cứu RAG Knowledge Base ] ──(ChromaDB: OWASP WSTG / CWE)
         │
         ▼
[ Bước 2: Kiểm tra Bằng chứng Thực nghiệm (Evidence Validation) ]
         │ (Có bằng chứng xác thực trong Header/Body không?)
         ├── Không ➔ Hủy bỏ cảnh báo (Reject as False Positive)
         └── Có ──┐
                  ▼
[ Bước 3: Đánh giá Mức độ Nghiêm trọng (Severity Scoring) ]
  • CRITICAL: Khai thác từ xa trực tiếp dẫn đến chiếm quyền hoặc rò rỉ dữ liệu nhạy cảm.
  • HIGH: Lỗ hổng CORS credentials hoặc thiếu toàn bộ bảo vệ phòng chống XSS/Clickjacking.
  • MEDIUM: Thiếu HSTS hoặc CSP quá lỏng lẻo (chứa unsafe-inline).
  • LOW: Lộ banner thông tin phiên bản phần mềm (Information Disclosure).
  • INFO: Khuyến nghị tối ưu hóa thực hành DevSecOps tốt nhất.
         │
         ▼
[ Bước 4: Ánh xạ chuẩn OWASP Top 10 (2021) ]
  - A01: Broken Access Control (CORS Misconfigurations)
  - A02: Cryptographic Failures (TLS 1.0, Weak Ciphers)
  - A03: Injection (MIME-sniffing, XSS vectors)
  - A05: Security Misconfiguration (Missing Security Headers, Default Pages)
```

## 3. Ràng buộc Chất lượng (Supreme Invariant)
1. **Tuyệt đối không bịa đặt:** Mỗi phát hiện phải trích xuất chính xác cặp Key-Value từ mảng `raw_evidence`.
2. **Loại bỏ False Positives thông minh:**
   - Nếu website là trang tĩnh dạng landing page (chỉ có HTML/CSS) thì việc thiếu một số cookie flags không được đánh dấu là lỗi nghiêm trọng.
   - Nếu website đã có CSP với `default-src 'self'`, việc thiếu `X-Frame-Options` có thể được hạ mức severity vì CSP `frame-ancestors 'self'` đã bảo vệ Clickjacking hiệu quả hơn.
