export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface Vulnerability {
  id: string;
  title: string;
  severity: SeverityLevel;
  cweId: string;
  owaspCategory: string;
  description: string;
  evidence: string;
  impactAnalysis: string;
  remediationGuidance: string;
  patchCode: string;
}

export interface ScanTelemetry {
  targetUrl: string;
  status: "IDLE" | "SCANNING" | "COMPLETED" | "FAILED";
  score: number;
  criticalCount: number;
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
