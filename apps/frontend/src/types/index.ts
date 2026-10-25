export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface Vulnerability {
  id: string;
  title: string;
  severity: SeverityLevel;
  cvssScore: number;
  cweId: string;
  owaspCategory: string;
  endpoint: string;
  description: string;
  evidence: string;
  impactAnalysis: string;
  remediationGuidance: string;
  patchCode: string;
  status: "OPEN" | "IN_REVIEW" | "PR_CREATED" | "RESOLVED";
  createdAt: string;
}

export interface ScanTelemetry {
  targetUrl: string;
  status: "IDLE" | "SCANNING" | "COMPLETED" | "FAILED";
  score: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  headersMissingCount: number;
  totalHeaders: number;
  scanDuration: string;
  serverBanner: string;
  waf: string;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "success" | "warn" | "error" | "action";
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export interface AgentFleetMember {
  id: string;
  name: string;
  role: string;
  status: "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";
  model: string;
  latencyP50: string;
  latencyP99: string;
  tokensConsumed: number;
  tokenSavings: string;
  tools: string[];
  description: string;
}

export interface OwaspCategoryReport {
  code: string;
  name: string;
  status: "PASSED" | "FAILED" | "WARNING";
  severity: SeverityLevel;
  findingsCount: number;
  cvssMax: number;
  complianceRate: number;
  wstgTestCases: string[];
  summary: string;
}

export interface K3sNode {
  id: string;
  name: string;
  role: "master" | "worker";
  status: "Ready" | "NotReady";
  ip: string;
  cpuUsage: number;
  ramUsage: number;
  ramAllocated: string;
  podsRunning: number;
  uptime: string;
}

export interface MicroserviceStatus {
  name: string;
  version: string;
  language: string;
  replicas: string;
  status: "Healthy" | "Degraded" | "Failing";
  cpu: string;
  memory: string;
  endpoint: string;
  restarts: number;
}

export interface SystemSettings {
  llmProvider: "ollama" | "openai" | "anthropic" | "deepseek";
  ollamaBaseUrl: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  modelName: string;
  temperature: number;
  tokenCompressionLevel: "full" | "branch" | "summary" | "metrics";
  githubToken: string;
  githubRepo: string;
  githubBranch: string;
  prAutoAssign: boolean;
  ssrfBlacklistCidrs: string[];
  ssrfWhitelistDomains: string[];
  maxRedirects: number;
  timeoutMs: number;
  discordWebhookUrl: string;
  slackWebhookUrl: string;
  alertThreshold: "CRITICAL" | "HIGH" | "ALL";
}

// =========================================================================
// COMMERCIAL B2B SAAS TYPES (Multi-Tenancy, Billing, Team, Domain Verification)
// =========================================================================

export type SubscriptionTier = "STARTER" | "PRO" | "ENTERPRISE";

export interface OrganizationWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: SubscriptionTier;
  scansUsed: number;
  scansLimit: number;
  domainsCount: number;
  domainsLimit: number;
  membersCount: number;
  avatarUrl?: string;
}

export interface MonitoredDomain {
  id: string;
  domain: string;
  isVerified: boolean;
  verificationMethod: "DNS_TXT" | "META_TAG" | "FILE";
  verificationToken: string;
  dnsTxtRecord: string;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "FAILED";
  lastScanAt: string;
  securityScore: number;
  autoScanSchedule: "MANUAL" | "DAILY" | "WEEKLY";
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "SECURITY_ADMIN" | "DEVELOPER" | "AUDITOR";
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
  twoFactorEnabled: boolean;
  lastActive: string;
  avatar: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  fullKeyPreview: string;
  environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  createdAt: string;
  lastUsedAt: string;
  createdBy: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING" | "FAILED";
  pdfDownloadUrl: string;
  planName: string;
}
