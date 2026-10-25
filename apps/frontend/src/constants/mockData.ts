import { Vulnerability, ScanTelemetry, LogEntry, ChatMessage } from "@/types";

export const INITIAL_TELEMETRY: ScanTelemetry = {
  targetUrl: "https://api.fintech-hubt.edu.vn",
  status: "IDLE",
  score: 40,
  criticalCount: 2,
  headersMissingCount: 6,
  totalHeaders: 6,
  scanDuration: "3.8s",
  serverBanner: "Nginx 1.24",
  waf: "Cloudflare",
};

export const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: "VULN-001",
    title: "Arbitrary Origin Reflection with Credentials in CORS Policy",
    severity: "CRITICAL",
    cweId: "CWE-942",
    owaspCategory: "A01:2021 - Broken Access Control",
    description:
      "Máy chủ phản chiếu nguyên vẹn giá trị header 'Origin: https://evil.test' từ client kèm chỉ thị 'Access-Control-Allow-Credentials: true'. Kẻ tấn công có thể dụ người dùng đăng nhập truy cập vào trang độc hại và đánh cắp dữ liệu JSON nhạy cảm.",
    evidence: `HTTP/1.1 200 OK
Server: nginx/1.24.0
Access-Control-Allow-Origin: https://evil-fintech.test
Access-Control-Allow-Credentials: true
Vary: Origin`,
    impactAnalysis:
      "Tấn công Cross-Site Data Hijacking; rò rỉ JWT session token và thông tin cá nhân của người dùng đã xác thực.",
    remediationGuidance:
      "Loại bỏ cơ chế phản chiếu Origin tùy tiện; sử dụng Whitelist danh sách tên miền tin cậy và kiểm tra nghiêm ngặt trước khi trả về Access-Control-Allow-Origin.",
    patchCode: `# Cấu hình Whitelist CORS an toàn cho Nginx
set $cors_origin "";
if ($http_origin ~* "^https?://(fintech-hubt\\.edu\\.vn|app\\.fintech-hubt\\.edu\\.vn)$") {
    set $cors_origin $http_origin;
}
add_header Access-Control-Allow-Origin $cors_origin always;
add_header Access-Control-Allow-Credentials "true" always;`,
  },
  {
    id: "VULN-002",
    title: "Missing Content-Security-Policy (CSP) & Strict HSTS",
    severity: "HIGH",
    cweId: "CWE-79 / CWE-319",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    description:
      "Ứng dụng hoàn toàn thiếu tiêu đề bảo mật Content-Security-Policy để ngăn ngừa mã độc XSS và thiếu Strict-Transport-Security (HSTS) để chống kỹ thuật hạ cấp giao thức SSL Stripping.",
    evidence: `Missing Security Headers:
- Content-Security-Policy
- Strict-Transport-Security (max-age>=31536000)
- X-Frame-Options (Clickjacking Risk)
- X-Content-Type-Options: nosniff`,
    impactAnalysis:
      "Người dùng có thể bị chèn mã script độc hại (Stored/Reflected XSS) hoặc bị nghe lén dữ liệu truyền tải trên mạng công cộng.",
    remediationGuidance:
      "Bổ sung bộ 6 Security Headers khuyến nghị bởi OWASP trong cấu hình web server hoặc ingress gateway.",
    patchCode: `# Bộ 6 Security Headers cốt lõi chuẩn OWASP cho Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'self';" always;`,
  },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    timestamp: "10:06:40",
    level: "info",
    message: "[*] AegisOps Agentic Engine v2.0 initialized on K3s node-1...",
  },
  {
    timestamp: "10:06:41",
    level: "info",
    message: "[*] [SSRF Guard] Phân tích trước DNS tên miền: 'api.fintech-hubt.edu.vn'",
  },
  {
    timestamp: "10:06:41",
    level: "success",
    message: "[✓] [SSRF Guard] IP đích: 103.142.139.12 (Public). Cho phép gửi request.",
  },
  {
    timestamp: "10:06:42",
    level: "info",
    message: "[*] [ReconAgent] Bắt đầu thăm dò 6 Security Headers và CORS Reflection...",
  },
  {
    timestamp: "10:06:43",
    level: "error",
    message: "[!] [ReconAgent] CẢNH BÁO: Phát hiện thiếu Content-Security-Policy & HSTS.",
  },
  {
    timestamp: "10:06:44",
    level: "action",
    message: "[?] [TriageAgent] Truy vấn RAG Vector Database (OWASP WSTG-CONF-07 & CWE-942)...",
  },
  {
    timestamp: "10:06:44",
    level: "error",
    message: "[!] [TriageAgent] XÁC THỰC LỖ HỔNG: CORS cho phép Origin lạ kèm Credentials!",
  },
  {
    timestamp: "10:06:45",
    level: "info",
    message: "[*] [AdvisoryAgent] Bắt đầu sinh mã nguồn vá lỗi (Drop-in Nginx / Express patch)...",
  },
  {
    timestamp: "10:06:46",
    level: "success",
    message: "[✓] [AdvisoryAgent] Hoàn tất báo cáo và sẵn sàng mở PR vá lỗi tự động.",
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Tôi đã phân tích trang web 'api.fintech-hubt.edu.vn'. Điểm yếu nghiêm trọng nhất là cấu hình CORS phản chiếu. Bạn có muốn tôi sinh mã vá lỗi cho Nginx hay Express.js không?",
    timestamp: "10:06",
  },
];
