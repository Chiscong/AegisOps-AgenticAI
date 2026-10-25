import {
  Vulnerability,
  ScanTelemetry,
  LogEntry,
  ChatMessage,
  AgentFleetMember,
  OwaspCategoryReport,
  K3sNode,
  MicroserviceStatus,
  SystemSettings,
  OrganizationWorkspace,
  MonitoredDomain,
  TeamMember,
  ApiKeyRecord,
  InvoiceRecord,
} from "@/types";

export const INITIAL_TELEMETRY: ScanTelemetry = {
  targetUrl: "https://api.fintech-hubt.edu.vn",
  status: "IDLE",
  score: 40,
  criticalCount: 2,
  highCount: 1,
  mediumCount: 1,
  lowCount: 1,
  headersMissingCount: 6,
  totalHeaders: 6,
  scanDuration: "3.8s",
  serverBanner: "Nginx 1.24.0 (Ubuntu)",
  waf: "Cloudflare Community WAF (Bypassed passive check)",
};

export const MOCK_WORKSPACES: OrganizationWorkspace[] = [
  {
    id: "ws-1",
    name: "FinTech Hubt Corporation",
    slug: "fintech-hubt",
    plan: "PRO",
    scansUsed: 18,
    scansLimit: 50,
    domainsCount: 3,
    domainsLimit: 5,
    membersCount: 4,
  },
  {
    id: "ws-2",
    name: "Acme Cloud Security Inc",
    slug: "acme-sec",
    plan: "ENTERPRISE",
    scansUsed: 142,
    scansLimit: 9999,
    domainsCount: 12,
    domainsLimit: 9999,
    membersCount: 18,
  },
  {
    id: "ws-3",
    name: "Personal Workspace",
    slug: "personal-sandbox",
    plan: "STARTER",
    scansUsed: 2,
    scansLimit: 3,
    domainsCount: 1,
    domainsLimit: 1,
    membersCount: 1,
  },
];

export const MOCK_DOMAINS: MonitoredDomain[] = [
  {
    id: "dom-1",
    domain: "api.fintech-hubt.edu.vn",
    isVerified: true,
    verificationMethod: "DNS_TXT",
    verificationToken: "aegisops-verify=7f8a9b2c3d4e5f6a",
    dnsTxtRecord: "_aegisops-challenge.api.fintech-hubt.edu.vn",
    status: "VERIFIED",
    lastScanAt: "2026-10-25 10:14:02",
    securityScore: 40,
    autoScanSchedule: "DAILY",
    createdAt: "2026-10-01",
  },
  {
    id: "dom-2",
    domain: "app.fintech-hubt.edu.vn",
    isVerified: true,
    verificationMethod: "DNS_TXT",
    verificationToken: "aegisops-verify=3b2a1c9f8e7d6c5b",
    dnsTxtRecord: "_aegisops-challenge.app.fintech-hubt.edu.vn",
    status: "VERIFIED",
    lastScanAt: "2026-10-24 18:30:00",
    securityScore: 85,
    autoScanSchedule: "WEEKLY",
    createdAt: "2026-10-05",
  },
  {
    id: "dom-3",
    domain: "staging.fintech-hubt.edu.vn",
    isVerified: false,
    verificationMethod: "DNS_TXT",
    verificationToken: "aegisops-verify=9c4a8b1d2e3f4a5b",
    dnsTxtRecord: "_aegisops-challenge.staging.fintech-hubt.edu.vn",
    status: "PENDING_VERIFICATION",
    lastScanAt: "Chưa quét",
    securityScore: 0,
    autoScanSchedule: "MANUAL",
    createdAt: "2026-10-25",
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "mem-1",
    name: "Phùng Chí Công",
    email: "chiscong.hubt@gmail.com",
    role: "OWNER",
    status: "ACTIVE",
    twoFactorEnabled: true,
    lastActive: "Vừa xong",
    avatar: "CP",
  },
  {
    id: "mem-2",
    name: "Nguyễn Hoàng Anh",
    email: "hoanganh@fintech-hubt.edu.vn",
    role: "SECURITY_ADMIN",
    status: "ACTIVE",
    twoFactorEnabled: true,
    lastActive: "15 phút trước",
    avatar: "HA",
  },
  {
    id: "mem-3",
    name: "Trần Minh Đức",
    email: "duc.tran@fintech-hubt.edu.vn",
    role: "DEVELOPER",
    status: "ACTIVE",
    twoFactorEnabled: true,
    lastActive: "2 giờ trước",
    avatar: "MD",
  },
  {
    id: "mem-4",
    name: "Lê Thu Trang",
    email: "trang.le@fintech-hubt.edu.vn",
    role: "AUDITOR",
    status: "INVITED",
    twoFactorEnabled: false,
    lastActive: "Chờ chấp thuận",
    avatar: "TT",
  },
];

export const MOCK_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-1",
    name: "GitHub Actions CI/CD Pipeline",
    keyPrefix: "aegis_live_",
    fullKeyPreview: "aegis_live_839af0182c44938102a9930f7e819a3f91",
    environment: "PRODUCTION",
    createdAt: "2026-10-10",
    lastUsedAt: "10 phút trước",
    createdBy: "Phùng Chí Công",
  },
  {
    id: "key-2",
    name: "GitLab Staging Security Gate",
    keyPrefix: "aegis_test_",
    fullKeyPreview: "aegis_test_210bc881902f349911ea7728190088aa",
    environment: "STAGING",
    createdAt: "2026-10-18",
    lastUsedAt: "Hôm qua",
    createdBy: "Nguyễn Hoàng Anh",
  },
];

export const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0010",
    date: "01/10/2026",
    amount: "$49.00 USD",
    status: "PAID",
    pdfDownloadUrl: "#",
    planName: "Pro SecOps Plan (Tháng 10/2026)",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0009",
    date: "01/09/2026",
    amount: "$49.00 USD",
    status: "PAID",
    pdfDownloadUrl: "#",
    planName: "Pro SecOps Plan (Tháng 09/2026)",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-0008",
    date: "01/08/2026",
    amount: "$49.00 USD",
    status: "PAID",
    pdfDownloadUrl: "#",
    planName: "Pro SecOps Plan (Tháng 08/2026)",
  },
];

export const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: "VULN-001",
    title: "Arbitrary Origin Reflection with Credentials in CORS Policy",
    severity: "CRITICAL",
    cvssScore: 9.1,
    cweId: "CWE-942",
    owaspCategory: "A01:2021 - Broken Access Control",
    endpoint: "/api/v1/auth/session",
    description:
      "Máy chủ phản chiếu nguyên vẹn giá trị header 'Origin: https://evil.test' từ client kèm chỉ thị 'Access-Control-Allow-Credentials: true'. Kẻ tấn công có thể dụ người dùng đã xác thực truy cập website lừa đảo để đánh cắp JWT cookies hoặc token nhạy cảm.",
    evidence: `HTTP/1.1 200 OK
Server: nginx/1.24.0
Access-Control-Allow-Origin: https://attacker-controlled.site
Access-Control-Allow-Credentials: true
Vary: Origin`,
    impactAnalysis:
      "Cross-Site Data Hijacking toàn diện; kẻ tấn công có quyền giả mạo phiên làm việc của người dùng và chiếm đoạt tài khoản.",
    remediationGuidance:
      "Khóa cứng whitelist các origin hợp lệ. Tuyệt đối không phản chiếu biến $http_origin trực tiếp vào header phản hồi khi bật credentials.",
    patchCode: `# 1. Whitelist danh sách tên miền CORS an toàn
set $cors_origin "";
if ($http_origin ~* "^https?://(fintech-hubt\\.edu\\.vn|app\\.fintech-hubt\\.edu\\.vn)$") {
    set $cors_origin $http_origin;
}
add_header Access-Control-Allow-Origin $cors_origin always;
add_header Access-Control-Allow-Credentials "true" always;`,
    status: "OPEN",
    createdAt: "2026-10-25 10:14:02",
  },
  {
    id: "VULN-002",
    title: "Missing Content-Security-Policy (CSP) & Strict HSTS",
    severity: "HIGH",
    cvssScore: 7.5,
    cweId: "CWE-693 / CWE-319",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    endpoint: "/* (Toàn bộ web app)",
    description:
      "Ứng dụng hoàn toàn thiếu tiêu đề bảo mật Content-Security-Policy để ngăn ngừa mã độc XSS và thiếu Strict-Transport-Security (HSTS) để chống kỹ thuật hạ cấp giao thức SSL Stripping qua mạng công cộng.",
    evidence: `Missing Response Headers:
- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options`,
    impactAnalysis:
      "Người dùng đối mặt với nguy cơ bị chèn script độc hại (Stored/Reflected XSS), tấn công Clickjacking qua iFrame và đánh cắp thông tin tài khoản qua mạng Wi-Fi không bảo mật.",
    remediationGuidance:
      "Bổ sung trọn bộ 6 Security Headers khuyến nghị bởi OWASP WSTG v4.2 vào cấu hình reverse proxy hoặc ingress controller.",
    patchCode: `# Bộ 6 Security Headers cốt lõi chuẩn OWASP cho Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'self';" always;`,
    status: "IN_REVIEW",
    createdAt: "2026-10-25 10:14:05",
  },
  {
    id: "VULN-003",
    title: "Detailed Server & Technology Stack Disclosure via Server Header",
    severity: "MEDIUM",
    cvssScore: 5.3,
    cweId: "CWE-200",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    endpoint: "/api/v1/healthz",
    description:
      "Header 'Server: nginx/1.24.0 (Ubuntu)' và 'X-Powered-By: Express' để lộ chính xác phiên bản phần mềm máy chủ, giúp kẻ tấn công tra cứu 1-day/0-day exploits mục tiêu.",
    evidence: `Server: nginx/1.24.0 (Ubuntu)
X-Powered-By: Express`,
    impactAnalysis:
      "Rút ngắn thời gian trinh sát của kẻ tấn công, tạo điều kiện thuận lợi cho việc khai thác lỗ hổng đã biết trên phiên bản Nginx hoặc NodeJS cụ thể.",
    remediationGuidance:
      "Tắt tính năng hiển thị phiên bản máy chủ với chỉ thị 'server_tokens off;' trong Nginx và 'app.disable(\"x-powered-by\");' trong Express.",
    patchCode: `# Ẩn thông tin máy chủ Nginx
server_tokens off;

# Trong Express.js:
# app.disable('x-powered-by');`,
    status: "OPEN",
    createdAt: "2026-10-25 10:14:08",
  },
  {
    id: "VULN-004",
    title: "Session Cookie Missing SameSite=Strict & Secure Flags",
    severity: "HIGH",
    cvssScore: 7.2,
    cweId: "CWE-614 / CWE-1275",
    owaspCategory: "A01:2021 - Broken Access Control",
    endpoint: "/api/v1/auth/login",
    description:
      "Cookie xác thực 'session_id' không được gắn cờ 'SameSite=Strict' và cờ 'Secure', cho phép trình duyệt gửi kèm cookie trong các yêu cầu cross-origin ngoài ý muốn.",
    evidence: `Set-Cookie: session_id=s%3A83bf29...; Path=/; HttpOnly`,
    impactAnalysis:
      "Gia tăng nguy cơ tấn công Cross-Site Request Forgery (CSRF) vào các tác vụ nhạy cảm như chuyển tiền hoặc đổi mật khẩu.",
    remediationGuidance:
      "Cấu hình Cookie Flags: HttpOnly; Secure; SameSite=Strict; Partitioned.",
    patchCode: `// Express Session Cookie Hardening
app.use(session({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
}));`,
    status: "PR_CREATED",
    createdAt: "2026-10-25 10:14:12",
  },
  {
    id: "VULN-005",
    title: "Sensitive Admin Endpoints Leaked in robots.txt",
    severity: "LOW",
    cvssScore: 3.1,
    cweId: "CWE-548",
    owaspCategory: "A05:2021 - Security Misconfiguration",
    endpoint: "/robots.txt",
    description:
      "Tệp robots.txt liệt kê các đường dẫn nội bộ nhạy cảm: Disallow: /admin-console-v2/, Disallow: /backup-db.sql.gz.",
    evidence: `User-agent: *
Disallow: /admin-console-v2/
Disallow: /backup-db.sql.gz
Disallow: /api/private/`,
    impactAnalysis:
      "Chỉ điểm cho kẻ tấn công các trang quản trị nhạy cảm cần nhắm tới thay vì ẩn giấu.",
    remediationGuidance:
      "Loại bỏ các đường dẫn nhạy cảm khỏi robots.txt và kiểm soát truy cập trực tiếp bằng Gateway Auth / VPN.",
    patchCode: `# robots.txt chuẩn an toàn
User-agent: *
Allow: /
Sitemap: https://app.fintech-hubt.edu.vn/sitemap.xml`,
    status: "RESOLVED",
    createdAt: "2026-10-25 10:14:15",
  },
];

export const MOCK_AGENTS: AgentFleetMember[] = [
  {
    id: "agent-recon",
    name: "ReconAgent",
    role: "Trinh Sát Thụ Động & Thăm Dò Hạ Tầng",
    status: "IDLE",
    model: "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
    latencyP50: "1.2s",
    latencyP99: "2.1s",
    tokensConsumed: 1420,
    tokenSavings: "90% via AST/Filter",
    tools: [
      "SSRF Pre-DNS Resolver",
      "Security Headers Prober (6 core)",
      "CORS Reflection Auditor",
      "SSL/TLS Cipher Inspector",
      "Robots.txt & Sitemap Harvester",
    ],
    description:
      "Chịu trách nhiệm gửi request kiểm tra an toàn, bảo vệ hệ thống khỏi SSRF thông qua DNS pre-check và thu thập siêu dữ liệu phản hồi.",
  },
  {
    id: "agent-triage",
    name: "TriageAgent",
    role: "Thẩm Định Lỗ Hổng & Lọc Cảnh Báo Giả (False Positives)",
    status: "IDLE",
    model: "Fine-tuned QLoRA DevSecOps 8B",
    latencyP50: "2.4s",
    latencyP99: "3.8s",
    tokensConsumed: 2150,
    tokenSavings: "65% via Vector Cache",
    tools: [
      "OWASP WSTG v4.2 Knowledge RAG",
      "CWE/CVSS v3.1 Scoring Engine",
      "False Positive Elimination Rulebase",
      "Attack Surface Mapper",
    ],
    description:
      "Đối chiếu phát hiện từ Recon với cơ sở tri thức RAG Qdrant, tính điểm CVSS chính xác và loại bỏ các cảnh báo nhiễu trước khi báo cáo.",
  },
  {
    id: "agent-advisory",
    name: "AdvisoryAgent",
    role: "Chuyên Gia Cố Vấn Vá Lỗi & Tự Động Hóa DevSecOps",
    status: "IDLE",
    model: "DeepSeek-Coder-V2-Instruct",
    latencyP50: "3.1s",
    latencyP99: "4.9s",
    tokensConsumed: 3200,
    tokenSavings: "78% via AST Slicing",
    tools: [
      "AST Syntax Tree Parser",
      "Nginx / Traefik Config Hardener",
      "Express / FastAPI Middleware Patcher",
      "GitHub Pull Request Automator",
    ],
    description:
      "Sinh mã vá lỗi chuẩn sản xuất, tự động tạo branch mới và gửi Pull Request trực tiếp lên repository GitHub của dự án.",
  },
  {
    id: "agent-orchestrator",
    name: "OrchestratorSwarm",
    role: "Điều Phối Bầy Đàn Tự Hành (LangGraph DAG)",
    status: "IDLE",
    model: "State Graph Concurrent Engine (6 luồng)",
    latencyP50: "0.4s",
    latencyP99: "0.8s",
    tokensConsumed: 640,
    tokenSavings: "Zero-copy I/O",
    tools: [
      "LangGraph State Machine",
      "Cycle & Infinite Loop Guard",
      "Human-in-the-Loop Approval Gate",
      "Distributed Task Scheduler",
    ],
    description:
      "Quản lý vòng đời tác vụ, điều phối dữ liệu qua lại giữa các Agent và duy trì trạng thái kiểm định không bị gián đoạn.",
  },
];

export const MOCK_OWASP_MATRIX: OwaspCategoryReport[] = [
  {
    code: "A01:2021",
    name: "Broken Access Control",
    status: "FAILED",
    severity: "CRITICAL",
    findingsCount: 2,
    cvssMax: 9.1,
    complianceRate: 60,
    wstgTestCases: ["WSTG-ATHZ-02", "WSTG-CONF-07", "WSTG-INPV-04"],
    summary:
      "Phát hiện lỗi CORS Origin Reflection kèm Credentials và thiếu thuộc tính SameSite trên Cookie phiên.",
  },
  {
    code: "A02:2021",
    name: "Cryptographic Failures",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-CRYP-01", "WSTG-CRYP-02", "WSTG-CRYP-03"],
    summary:
      "Chứng chỉ SSL/TLS 1.3 hợp lệ, thuật toán mã hóa mạnh (ECDHE-RSA-AES256-GCM-SHA384), không rò rỉ private key.",
  },
  {
    code: "A03:2021",
    name: "Injection",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-INPV-01", "WSTG-INPV-05", "WSTG-INPV-11"],
    summary:
      "Tất cả truy vấn CSDL đều sử dụng Parameterized Queries ORM; không phát hiện SQLi hoặc Command Injection.",
  },
  {
    code: "A04:2021",
    name: "Insecure Design",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 95,
    wstgTestCases: ["WSTG-DSGN-01", "WSTG-DSGN-02"],
    summary:
      "Hệ thống đã triển khai cơ chế Rate Limiting chống DoS và circuit breaker tại Ingress Gateway.",
  },
  {
    code: "A05:2021",
    name: "Security Misconfiguration",
    status: "FAILED",
    severity: "HIGH",
    findingsCount: 2,
    cvssMax: 7.5,
    complianceRate: 45,
    wstgTestCases: ["WSTG-CONF-01", "WSTG-CONF-02", "WSTG-CONF-04"],
    summary:
      "Thiếu bộ 6 Security Headers cốt lõi (CSP, HSTS) và để lộ thông tin phiên bản máy chủ Nginx 1.24.",
  },
  {
    code: "A06:2021",
    name: "Vulnerable and Outdated Components",
    status: "WARNING",
    severity: "MEDIUM",
    findingsCount: 1,
    cvssMax: 5.3,
    complianceRate: 85,
    wstgTestCases: ["WSTG-CONF-05"],
    summary:
      "Phát hiện 1 thư viện npm phụ thuộc có bản cập nhật bảo mật khả dụng (đã có khuyến nghị nâng cấp).",
  },
  {
    code: "A07:2021",
    name: "Identification and Authentication Failures",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-ATHN-01", "WSTG-ATHN-03", "WSTG-ATHN-04"],
    summary:
      "Xác thực qua Google OAuth 2.0 và JWT Rotation có hạn dùng ngắn, mã hóa chữ ký SHA-256 an toàn.",
  },
  {
    code: "A08:2021",
    name: "Software and Data Integrity Failures",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-CONF-06"],
    summary:
      "Pipeline CI/CD áp dụng ký số mã nguồn và kiểm tra Subresource Integrity (SRI) đối với CDN scripts.",
  },
  {
    code: "A09:2021",
    name: "Security Logging and Monitoring Failures",
    status: "WARNING",
    severity: "MEDIUM",
    findingsCount: 1,
    cvssMax: 4.8,
    complianceRate: 80,
    wstgTestCases: ["WSTG-LOGG-01", "WSTG-LOGG-02"],
    summary:
      "Nhật ký kiểm toán an ninh ghi nhận tốt nhưng thời gian đồng bộ hóa tập trung về SIEM đôi khi trễ > 5 giây.",
  },
  {
    code: "A10:2021",
    name: "Server-Side Request Forgery (SSRF)",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-INPV-12"],
    summary:
      "Cơ chế AegisOps SSRF Guard tiền phân giải DNS và chặn dải IP Private/Metadata (169.254.169.254) hoạt động hoàn hảo.",
  },
];

export const MOCK_K3S_NODES: K3sNode[] = [
  {
    id: "node-1",
    name: "k3s-master-01",
    role: "master",
    status: "Ready",
    ip: "10.0.1.10",
    cpuUsage: 32,
    ramUsage: 68,
    ramAllocated: "2.7 / 4.0 GB",
    podsRunning: 8,
    uptime: "28 ngày 14 giờ",
  },
  {
    id: "node-2",
    name: "k3s-worker-01",
    role: "worker",
    status: "Ready",
    ip: "10.0.1.11",
    cpuUsage: 48,
    ramUsage: 74,
    ramAllocated: "2.9 / 4.0 GB",
    podsRunning: 6,
    uptime: "28 ngày 14 giờ",
  },
  {
    id: "node-3",
    name: "k3s-worker-02",
    role: "worker",
    status: "Ready",
    ip: "10.0.1.12",
    cpuUsage: 22,
    ramUsage: 51,
    ramAllocated: "2.0 / 4.0 GB",
    podsRunning: 5,
    uptime: "28 ngày 14 giờ",
  },
];

export const MOCK_MICROSERVICES: MicroserviceStatus[] = [
  {
    name: "gateway-service",
    version: "v1.4.0",
    language: "Go 1.22 / Traefik",
    replicas: "2/2",
    status: "Healthy",
    cpu: "24m",
    memory: "64Mi",
    endpoint: "https://gateway.aegisops.internal",
    restarts: 0,
  },
  {
    name: "auth-service",
    version: "v1.2.1",
    language: "Python 3.12 / FastAPI",
    replicas: "2/2",
    status: "Healthy",
    cpu: "38m",
    memory: "128Mi",
    endpoint: "http://auth-service.aegisops.internal:8000",
    restarts: 0,
  },
  {
    name: "orchestrator-service",
    version: "v2.0.0",
    language: "Python LangGraph State",
    replicas: "2/2",
    status: "Healthy",
    cpu: "82m",
    memory: "256Mi",
    endpoint: "http://orchestrator.aegisops.internal:8080",
    restarts: 1,
  },
  {
    name: "scanner-worker",
    version: "v1.8.0",
    language: "Async Celery / Redis",
    replicas: "3/3",
    status: "Healthy",
    cpu: "115m",
    memory: "312Mi",
    endpoint: "http://scanner-worker.aegisops.internal:9000",
    restarts: 0,
  },
  {
    name: "knowledge-rag",
    version: "v1.1.0",
    language: "Qdrant Vector DB / Python",
    replicas: "1/1",
    status: "Healthy",
    cpu: "65m",
    memory: "420Mi",
    endpoint: "http://qdrant.aegisops.internal:6333",
    restarts: 0,
  },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  llmProvider: "ollama",
  ollamaBaseUrl: "http://localhost:11434",
  openaiApiKey: "sk-proj-************************************",
  anthropicApiKey: "sk-ant-************************************",
  modelName: "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
  temperature: 0.1,
  tokenCompressionLevel: "metrics",
  githubToken: "ghp_************************************",
  githubRepo: "Chiscong/AegisOps-AgenticAI",
  githubBranch: "main",
  prAutoAssign: true,
  ssrfBlacklistCidrs: [
    "127.0.0.0/8",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "169.254.169.254/32",
    "::1/128",
    "fc00::/7",
  ],
  ssrfWhitelistDomains: [
    "app.fintech-hubt.edu.vn",
    "fintech-hubt.edu.vn",
    "hubt.edu.vn",
  ],
  maxRedirects: 3,
  timeoutMs: 5000,
  discordWebhookUrl: "https://discord.com/api/webhooks/...",
  slackWebhookUrl: "https://hooks.slack.com/services/...",
  alertThreshold: "HIGH",
};

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
    message: "[!] [TriageAgent] XÁC NHẬN: Lỗ hổng CORS Arbitrary Origin Reflection (CVSS 9.1).",
  },
  {
    timestamp: "10:06:45",
    level: "action",
    message: "[*] [AdvisoryAgent] Bắt đầu tổng hợp mã vá lỗi tự động Nginx Hardening Patch...",
  },
  {
    timestamp: "10:06:46",
    level: "success",
    message: "[✓] [AdvisoryAgent] Đã sinh xong mã vá lỗi và sẵn sàng tạo Pull Request #104.",
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Chào bạn! Tôi là AegisOps Copilot. Tôi đã phân tích xong hệ thống Fintech Portal và ghi nhận 2 lỗ hổng nghiêm trọng về CORS và HSTS. Bạn cần tôi hỗ trợ gì về mã vá lỗi hay phương án khắc phục?",
    timestamp: "10:07",
  },
];
