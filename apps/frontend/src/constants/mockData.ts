import {
  Vulnerability,
  ScanTelemetry,
  LogEntry,
  ChatMessage,
  SystemSettings,
  OrganizationWorkspace,
  MonitoredDomain,
  TeamMember,
  ApiKeyRecord,
  InvoiceRecord,
} from "@/types";

// =========================================================================
// PRODUCTION INITIAL STATES (Standby mode chờ kết nối API)
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
    name: "AegisOps Production Workspace",
    slug: "aegisops-prod",
    plan: "PRO",
    scansUsed: 0,
    scansLimit: 50,
    domainsCount: 0,
    domainsLimit: 5,
    membersCount: 1,
  },
];

// Danh sách rỗng: Tự động tải từ Gateway API
export const MOCK_DOMAINS: MonitoredDomain[] = [];
export const MOCK_TEAM_MEMBERS: TeamMember[] = [];
export const MOCK_API_KEYS: ApiKeyRecord[] = [];
export const MOCK_INVOICES: InvoiceRecord[] = [];
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
    message: "[?] Sẵn sàng tiếp nhận mục tiêu. Nhập URL và nhấn 'Bắt Đầu Quét' để kích hoạt AI Fleet.",
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
