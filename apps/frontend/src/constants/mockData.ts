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

// =========================================================================
// PRODUCTION INITIAL STATES (Dữ liệu rỗng chờ kết nối Services)
// =========================================================================

export const INITIAL_TELEMETRY: ScanTelemetry = {
  targetUrl: "",
  status: "IDLE",
  score: 0,
  criticalCount: 0,
  highCount: 0,
  mediumCount: 0,
  lowCount: 0,
  headersMissingCount: 0,
  totalHeaders: 6,
  scanDuration: "0.0s",
  serverBanner: "Chờ kết nối mục tiêu...",
  waf: "Chưa kích hoạt quét",
};

export const MOCK_WORKSPACES: OrganizationWorkspace[] = [
  {
    id: "ws-primary",
    name: "Không Gian Làm Việc Chính",
    slug: "main-workspace",
    plan: "PRO",
    scansUsed: 0,
    scansLimit: 50,
    domainsCount: 0,
    domainsLimit: 5,
    membersCount: 1,
  },
];

// Danh sách rỗng: Người dùng sẽ thêm và xác thực domain thực tế qua DNS TXT
export const MOCK_DOMAINS: MonitoredDomain[] = [];

// Danh sách rỗng: Người dùng sẽ mời thành viên thực tế qua email
export const MOCK_TEAM_MEMBERS: TeamMember[] = [];

// Danh sách rỗng: Người dùng sẽ tự tạo API Key thực tế cho CI/CD
export const MOCK_API_KEYS: ApiKeyRecord[] = [];

// Danh sách rỗng: Lịch sử hóa đơn thực tế từ cổng thanh toán
export const MOCK_INVOICES: InvoiceRecord[] = [];

// Danh sách rỗng: Lỗ hổng sẽ được cập nhật trực tiếp sau khi AI Fleet thực thi quét
export const MOCK_VULNERABILITIES: Vulnerability[] = [];

export const INITIAL_LOGS: LogEntry[] = [
  {
    timestamp: "--:--:--",
    level: "info",
    message: "[*] AegisOps Agentic Engine khởi động thành công trên Microservices Cluster.",
  },
  {
    timestamp: "--:--:--",
    level: "action",
    message: "[?] Sẵn sàng tiếp nhận mục tiêu. Nhập URL và nhấn 'Kích hoạt Quét' để bắt đầu.",
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "bot",
    text: "Xin chào! Tôi là AegisOps SecOps Copilot. Hãy nhập URL mục tiêu cần kiểm định an ninh để tôi phân tích lỗ hổng, loại trừ cảnh báo giả và tự động sinh mã vá lỗi cho hệ thống của bạn.",
    timestamp: "Live",
  },
];

// =========================================================================
// KIẾN TRÚC THAM CHIẾU: 4 AI FLEET AGENTS & 10 HẠNG MỤC OWASP
// =========================================================================

export const MOCK_AGENTS: AgentFleetMember[] = [
  {
    id: "agent-recon",
    name: "ReconAgent",
    role: "Trinh Sát Thụ Động & Thăm Dò Hạ Tầng",
    status: "IDLE",
    model: "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
    latencyP50: "1.2s",
    latencyP99: "2.1s",
    tokensConsumed: 0,
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
    tokensConsumed: 0,
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
    tokensConsumed: 0,
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
    tokensConsumed: 0,
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
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-ATHZ-02", "WSTG-CONF-07", "WSTG-INPV-04"],
    summary: "Kiểm tra quyền truy cập và phân quyền cross-origin theo WSTG-ATHZ-02.",
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
    summary: "Kiểm tra chứng chỉ TLS, thuật toán mã hóa và an toàn đường truyền.",
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
    summary: "Kiểm tra lỗ hổng Injection qua dữ liệu đầu vào và tham số URL.",
  },
  {
    code: "A04:2021",
    name: "Insecure Design",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-DSGN-01", "WSTG-DSGN-02"],
    summary: "Đánh giá thiết kế kiến trúc an toàn, giới hạn tốc độ và phòng thủ chủ động.",
  },
  {
    code: "A05:2021",
    name: "Security Misconfiguration",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-CONF-01", "WSTG-CONF-02", "WSTG-CONF-04"],
    summary: "Kiểm toán 6 tiêu đề bảo mật cốt lõi, banner máy chủ và file cấu hình rò rỉ.",
  },
  {
    code: "A06:2021",
    name: "Vulnerable and Outdated Components",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-CONF-05"],
    summary: "Đối chiếu phiên bản framework và thư viện client-side với cơ sở dữ liệu CVE.",
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
    summary: "Kiểm tra quản lý phiên cookie, cờ SameSite/Secure và cơ chế xác thực JWT/OAuth.",
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
    summary: "Kiểm tra toàn vẹn tài nguyên bên thứ ba thông qua Subresource Integrity (SRI).",
  },
  {
    code: "A09:2021",
    name: "Security Logging and Monitoring Failures",
    status: "PASSED",
    severity: "LOW",
    findingsCount: 0,
    cvssMax: 0,
    complianceRate: 100,
    wstgTestCases: ["WSTG-LOGG-01", "WSTG-LOGG-02"],
    summary: "Giám sát nhật ký kiểm toán và cảnh báo bất thường trong thời gian thực.",
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
    summary: "Bảo vệ bởi AegisOps SSRF Zero-Trust Guard: Tiền phân giải DNS và chặn dải IP Private.",
  },
];

export const MOCK_K3S_NODES: K3sNode[] = [
  {
    id: "node-1",
    name: "k3s-master-01",
    role: "master",
    status: "Ready",
    ip: "10.0.1.10",
    cpuUsage: 28,
    ramUsage: 64,
    ramAllocated: "2.5 / 4.0 GB",
    podsRunning: 8,
    uptime: "Online",
  },
  {
    id: "node-2",
    name: "k3s-worker-01",
    role: "worker",
    status: "Ready",
    ip: "10.0.1.11",
    cpuUsage: 42,
    ramUsage: 70,
    ramAllocated: "2.8 / 4.0 GB",
    podsRunning: 6,
    uptime: "Online",
  },
  {
    id: "node-3",
    name: "k3s-worker-02",
    role: "worker",
    status: "Ready",
    ip: "10.0.1.12",
    cpuUsage: 18,
    ramUsage: 48,
    ramAllocated: "1.9 / 4.0 GB",
    podsRunning: 5,
    uptime: "Online",
  },
];

export const MOCK_MICROSERVICES: MicroserviceStatus[] = [
  {
    name: "gateway-service",
    version: "v1.4.0",
    language: "Python 3.12 / FastAPI Proxy",
    replicas: "2/2",
    status: "Healthy",
    cpu: "24m",
    memory: "64Mi",
    endpoint: "http://gateway-service:8000",
    restarts: 0,
  },
  {
    name: "auth-service",
    version: "v1.2.1",
    language: "Python 3.12 / FastAPI + JWT",
    replicas: "2/2",
    status: "Healthy",
    cpu: "38m",
    memory: "128Mi",
    endpoint: "http://auth-service:8001",
    restarts: 0,
  },
  {
    name: "orchestrator-service",
    version: "v2.0.0",
    language: "Python LangGraph State Machine",
    replicas: "2/2",
    status: "Healthy",
    cpu: "82m",
    memory: "256Mi",
    endpoint: "http://orchestrator-service:8002",
    restarts: 0,
  },
  {
    name: "scanner-worker",
    version: "v1.8.0",
    language: "Python 3.12 Async Recon",
    replicas: "3/3",
    status: "Healthy",
    cpu: "115m",
    memory: "312Mi",
    endpoint: "http://scanner-worker:8004",
    restarts: 0,
  },
  {
    name: "knowledge-rag",
    version: "v1.1.0",
    language: "Python 3.12 / OWASP Vector RAG",
    replicas: "1/1",
    status: "Healthy",
    cpu: "65m",
    memory: "420Mi",
    endpoint: "http://knowledge-rag-service:8003",
    restarts: 0,
  },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  llmProvider: "ollama",
  ollamaBaseUrl: "http://localhost:11434",
  openaiApiKey: "",
  anthropicApiKey: "",
  modelName: "meta-llama/Llama-3-8b-instruct (QLoRA 4-bit)",
  temperature: 0.1,
  tokenCompressionLevel: "metrics",
  githubToken: "",
  githubRepo: "",
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
  ssrfWhitelistDomains: [],
  maxRedirects: 3,
  timeoutMs: 5000,
  discordWebhookUrl: "",
  slackWebhookUrl: "",
  alertThreshold: "HIGH",
};
