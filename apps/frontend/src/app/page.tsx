"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Terminal,
  Activity,
  Send,
  Zap,
  ChevronDown,
  Globe,
  Bell,
  Download,
  ShieldCheck,
  ListChecks,
  Radar,
  Bot,
  Copy,
  Wrench,
  X,
  FileCode,
  LayoutDashboard,
  Server,
  Settings,
} from "lucide-react";

export default function AegisDashboard() {
  const [targetUrl, setTargetUrl] = useState("https://api.fintech-hubt.edu.vn");
  const [isScanning, setIsScanning] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    vuln1: true,
    vuln2: false,
  });
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState(40);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "bot" | "user"; text: string }>
  >([
    {
      sender: "bot",
      text: "Tôi đã phân tích trang web 'api.fintech-hubt.edu.vn'. Điểm yếu nghiêm trọng nhất là cấu hình CORS phản chiếu. Bạn có muốn tôi sinh mã vá lỗi cho Nginx hay Express.js không?",
    },
  ]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[10:06:40] [*] AegisOps Agentic Engine v2.0 initialized on K3s node-1...",
    "[10:06:41] [*] [SSRF Guard] Phân tích trước DNS tên miền: 'api.fintech-hubt.edu.vn'",
    "[10:06:41] [✓] [SSRF Guard] IP đích: 103.142.139.12 (Public). Cho phép gửi request.",
    "[10:06:42] [*] [ReconAgent] Bắt đầu thăm dò 6 Security Headers và CORS Reflection...",
    "[10:06:43] [!] [ReconAgent] CẢNH BÁO: Phát hiện thiếu Content-Security-Policy & HSTS.",
    "[10:06:44] [?] [TriageAgent] Truy vấn RAG Vector Database (OWASP WSTG-CONF-07 & CWE-942)...",
    "[10:06:44] [!] [TriageAgent] XÁC THỰC LỖ HỔNG: CORS cho phép Origin lạ kèm Credentials!",
    "[10:06:45] [*] [AdvisoryAgent] Bắt đầu sinh mã nguồn vá lỗi (Drop-in Nginx / Express patch)...",
    "[10:06:46] [✓] [AdvisoryAgent] Hoàn tất báo cáo và sẵn sàng mở PR vá lỗi tự động.",
  ]);

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startScan = () => {
    setIsScanning(true);
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] [!] Kích hoạt quét mục tiêu: ${targetUrl}`,
    ]);

    const simLogs = [
      "[*] [SSRF Guard] Phân tích trước DNS: Host hợp lệ, không thuộc dải mạng cấm.",
      "[*] [ReconAgent] Đang gửi 15 HTTP requests thăm dò Headers, CORS, SSL và Robots...",
      "[!] [TriageAgent] Phát hiện: Access-Control-Allow-Origin phản chiếu nguồn tùy ý!",
      "[*] [TriageAgent] Đối chiếu tiêu chuẩn bảo mật OWASP Top 10 (A01 - Broken Access Control)",
      "[*] [AdvisoryAgent] Đang sinh mã vá lỗi Nginx và Dockerfile Hardening...",
      "[✓] Hoàn thành phân tích toàn diện. Aegis Security Score: 40/100.",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < simLogs.length) {
        setTerminalLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${simLogs[i]}`,
        ]);
        i++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScore(40);
      }
    }, 700);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Tôi đã nhận được câu hỏi về "${userText}". Đối với lỗ hổng này, bạn nên cấu hình whitelist domain cụ thể và loại bỏ ký tự wildcard '*' khi bật credentials để tuân thủ RFC 6454.`,
        },
      ]);
    }, 600);
  };

  const handleCopyPatch = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex h-screen bg-obsidian-950 text-slate-100 font-sans overflow-hidden antialiased select-none">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-obsidian-900 border-r border-crimson-muted flex flex-col justify-between shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-crimson-muted">
            <div className="p-2.5 bg-crimson/15 rounded-xl border border-crimson/50 shadow-neon-red-sm flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-crimson-neon" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  AEGIS
                </span>
                <span className="font-extrabold text-lg text-crimson-neon">
                  OPS
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                Agentic SecOps AI
              </p>
            </div>
          </div>

          <div className="mt-4 px-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Environment
            </label>
            <div className="flex items-center justify-between px-3 py-2 bg-obsidian-950 border border-crimson-muted rounded-lg text-xs cursor-pointer hover:border-crimson/40 transition">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200 truncate">
                  K3s Prod (hubt-connect)
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <nav className="mt-6 space-y-1 px-1">
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-crimson/10 text-crimson-neon border border-crimson/40 font-semibold text-xs tracking-wide shadow-neon-red-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Live Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium text-xs tracking-wide transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="flex-1">Vulnerabilities</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 rounded">
                2 Crit
              </span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium text-xs tracking-wide transition"
            >
              <Bot className="w-4 h-4" />
              <span>Agent Fleet (3)</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium text-xs tracking-wide transition"
            >
              <Radar className="w-4 h-4" />
              <span>OWASP Matrix</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium text-xs tracking-wide transition"
            >
              <Server className="w-4 h-4" />
              <span>Infrastructure</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium text-xs tracking-wide transition"
            >
              <Settings className="w-4 h-4" />
              <span>Settings & API</span>
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-crimson-muted">
          <div className="p-3 bg-obsidian-850 rounded-xl border border-crimson-muted text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Cluster Status
              </span>
              <span className="flex items-center space-x-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Online</span>
              </span>
            </div>
            <p className="text-slate-300 font-semibold mt-1">3 Nodes Active</p>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex justify-between">
              <span>RAM: 3.2/8GB</span>
              <span>Cost: &lt;$15/mo</span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-3 px-1 pt-1">
            <div className="w-8 h-8 rounded-full bg-crimson/20 border border-crimson flex items-center justify-center font-bold text-xs text-crimson-neon">
              CP
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                Phùng Chí Công
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Lead DevSecOps
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Command Bar */}
        <header className="h-16 bg-obsidian-900/80 backdrop-blur-md border-b border-crimson-muted px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 w-7/12">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Nhập URL website cần kiểm định an ninh..."
                className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-24 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-crimson-neon transition font-mono"
              />
              <div className="absolute right-2.5 top-2 flex items-center space-x-1 bg-obsidian-850 px-2 py-0.5 rounded border border-crimson-muted text-[10px] text-slate-400">
                <span>Standard</span>
              </div>
            </div>

            <button
              onClick={startScan}
              disabled={isScanning}
              className="px-5 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer shrink-0 active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isScanning ? "Đang Quét..." : "Kích hoạt Quét"}</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-850 border border-crimson-muted text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isScanning
                    ? "bg-amber-400 animate-ping"
                    : "bg-emerald-400 animate-pulse"
                }`}
              ></span>
              <span className="text-slate-300 font-mono text-[11px]">
                {isScanning ? "AI Fleet: Scanning..." : "AI Fleet: Standby"}
              </span>
            </div>
            <button className="p-2 rounded-lg bg-obsidian-850 border border-crimson-muted text-slate-400 hover:text-white transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson-neon"></span>
            </button>
            <button className="p-2 rounded-lg bg-obsidian-850 border border-crimson-muted text-slate-400 hover:text-white transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* A. 4 SECURITY SCORECARD CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Scorecard 1: Aegis Security Score Gauge */}
            <div className="p-5 bg-obsidian-850 rounded-2xl border border-crimson/40 shadow-card-dark relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-crimson/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Aegis Security Score
                  </span>
                  <ShieldCheck className="w-4 h-4 text-crimson-neon" />
                </div>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-extrabold text-crimson-neon font-mono tracking-tight">
                    {score}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    / 100 ĐIỂM
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-obsidian-950 h-2 rounded-full overflow-hidden p-0.5 border border-crimson-muted">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-crimson-neon rounded-full transition-all duration-1000"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-red-400 font-semibold mt-1.5 flex items-center space-x-1">
                  <span>●</span>
                  <span>RỦI RO CAO (HIGH RISK)</span>
                </p>
              </div>
            </div>

            {/* Scorecard 2: Critical Threats */}
            <div className="p-5 bg-obsidian-850 rounded-2xl border border-crimson-muted shadow-card-dark flex flex-col justify-between hover:border-crimson/30 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Lỗ hổng Critical
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-400 border border-red-800 rounded font-mono font-bold">
                    CẤP BÁCH
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-white mt-2 font-mono">
                  02
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400">
                <span>CORS Reflection & Rò rỉ Admin</span>
              </div>
            </div>

            {/* Scorecard 3: Missing Headers */}
            <div className="p-5 bg-obsidian-850 rounded-2xl border border-crimson-muted shadow-card-dark flex flex-col justify-between hover:border-crimson/30 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Security Headers
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-400 border border-amber-800 rounded font-mono font-bold">
                    THIẾU 6/6
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-amber-400 mt-2 font-mono">
                  06{" "}
                  <span className="text-base text-slate-500 font-normal">
                    / 06
                  </span>
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400 truncate">
                <span>Thiếu CSP, HSTS, X-Frame</span>
              </div>
            </div>

            {/* Scorecard 4: Recon Telemetry */}
            <div className="p-5 bg-obsidian-850 rounded-2xl border border-crimson-muted shadow-card-dark flex flex-col justify-between hover:border-crimson/30 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Thẩm định An Toàn
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono font-bold">
                    THỤ ĐỘNG
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-emerald-400 mt-2 font-mono">
                  3.8s
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400 flex justify-between">
                <span>WAF: Cloudflare</span>
                <span>Server: Nginx</span>
              </div>
            </div>
          </section>

          {/* B. MAIN GENERATIVE CANVAS (SPLIT SCREEN 7 : 5) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Live Terminal Logs + Vulnerability Triage (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Live Terminal Agentic Thought Stream */}
              <div className="bg-obsidian-950 rounded-2xl border border-crimson/50 shadow-card-dark overflow-hidden flex flex-col">
                <div className="px-4 py-3 bg-obsidian-900 border-b border-crimson-muted flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 font-mono text-xs font-bold text-slate-300">
                      LIVE AGENTIC SSE STREAM — REASONING FEED
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-crimson-neon px-2 py-0.5 rounded bg-crimson/10 border border-crimson/30 animate-pulse">
                    REC ● 150 tok/s
                  </span>
                </div>

                <div className="p-4 font-mono text-xs space-y-2 h-64 overflow-y-auto bg-obsidian-950 text-slate-300 leading-relaxed">
                  {terminalLogs.map((log, idx) => (
                    <p
                      key={idx}
                      className={
                        log.includes("!")
                          ? "text-red-400 font-bold"
                          : log.includes("✓")
                          ? "text-emerald-400 font-bold"
                          : log.includes("?")
                          ? "text-fuchsia-400"
                          : "text-slate-300"
                      }
                    >
                      {log}
                    </p>
                  ))}
                  <span className="inline-block w-2 h-4 bg-crimson-neon animate-pulse"></span>
                </div>
              </div>

              {/* 2. Vulnerability Triage Accordion List */}
              <div className="bg-obsidian-900 rounded-2xl border border-crimson-muted shadow-card-dark p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 text-crimson-neon" />
                      <span>Danh Sách Lỗ Hổng & Điểm Yếu Thẩm Định</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Đã được TriageAgent đối chiếu và loại bỏ 100% cảnh báo giả
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-obsidian-950 px-2.5 py-1 rounded-lg border border-crimson-muted">
                    2 Phát hiện
                  </span>
                </div>

                {/* Finding Item 1: CORS Reflection (CRITICAL) */}
                <div className="border border-red-500/40 rounded-xl bg-obsidian-950 overflow-hidden transition">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-obsidian-850/50"
                    onClick={() => toggleAccordion("vuln1")}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-red-950 text-red-400 border border-red-800 rounded">
                        CRITICAL
                      </span>
                      <span className="font-bold text-xs text-white">
                        Arbitrary Origin Reflection with Credentials in CORS
                        Policy
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                      <span className="px-2 py-0.5 bg-obsidian-850 rounded border border-crimson-muted">
                        CWE-942
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          accordionOpen.vuln1 ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {accordionOpen.vuln1 && (
                    <div className="p-4 border-t border-crimson-muted bg-obsidian-900/60 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Mô tả kỹ thuật:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          Máy chủ phản chiếu nguyên vẹn giá trị{" "}
                          <code className="text-red-400 font-mono">
                            Origin: https://evil.test
                          </code>{" "}
                          gửi từ trình duyệt người dùng kết hợp với chỉ thị{" "}
                          <code className="text-red-400 font-mono">
                            Access-Control-Allow-Credentials: true
                          </code>
                          .
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Bằng chứng thực nghiệm (Raw Evidence):
                        </span>
                        <pre className="bg-obsidian-950 p-3 rounded-lg border border-crimson-muted font-mono text-[11px] text-red-300 overflow-x-auto">
                          {`HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil-fintech.test
Access-Control-Allow-Credentials: true
Vary: Origin`}
                        </pre>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">
                          OWASP:{" "}
                          <strong>A01:2021 - Broken Access Control</strong>
                        </span>
                        <button
                          onClick={() => setIsPatchModalOpen(true)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson/20 text-crimson-neon hover:bg-crimson/30 border border-crimson/50 font-medium text-xs transition cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Xem & Copy Bản Vá</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Finding Item 2: Missing CSP (HIGH) */}
                <div className="border border-amber-500/40 rounded-xl bg-obsidian-950 overflow-hidden transition">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-obsidian-850/50"
                    onClick={() => toggleAccordion("vuln2")}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-950 text-amber-400 border border-amber-800 rounded">
                        HIGH
                      </span>
                      <span className="font-bold text-xs text-white">
                        Missing Content-Security-Policy (CSP) & HSTS
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                      <span className="px-2 py-0.5 bg-obsidian-850 rounded border border-crimson-muted">
                        CWE-79 / CWE-319
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          accordionOpen.vuln2 ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {accordionOpen.vuln2 && (
                    <div className="p-4 border-t border-crimson-muted bg-obsidian-900/60 space-y-3 text-xs">
                      <p className="text-slate-300 leading-relaxed">
                        Thiếu hoàn toàn tiêu đề CSP bảo vệ chống lại các cuộc
                        tấn công Cross-Site Scripting (XSS) và chèn dữ liệu độc
                        hại từ bên ngoài.
                      </p>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setIsPatchModalOpen(true)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson/20 text-crimson-neon hover:bg-crimson/30 border border-crimson/50 font-medium text-xs transition cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Tải Cấu hình Nginx Header</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Copilot Chat + OWASP Radar SVG (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* 1. OWASP Top 10 Threat Radar SVG Visualization */}
              <div className="bg-obsidian-900 rounded-2xl border border-crimson-muted shadow-card-dark p-5">
                <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
                  <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                    <Radar className="w-4 h-4 text-crimson-neon" />
                    <span>Ma Trận Rủi Ro OWASP Top 10</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    WSTG v4.2
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-center relative">
                  <svg className="w-56 h-56" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#261a22"
                      strokeWidth="1"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="55"
                      fill="none"
                      stroke="#261a22"
                      strokeWidth="1"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="30"
                      fill="none"
                      stroke="#261a22"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="20"
                      x2="100"
                      y2="180"
                      stroke="#261a22"
                      strokeWidth="1"
                    />
                    <line
                      x1="20"
                      y1="100"
                      x2="180"
                      y2="100"
                      stroke="#261a22"
                      strokeWidth="1"
                    />
                    <polygon
                      points="100,35 155,75 145,135 100,165 45,130 50,70"
                      fill="rgba(239, 68, 68, 0.35)"
                      stroke="#ff2a4b"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="35" r="4" fill="#ff2a4b" />
                    <circle cx="155" cy="75" r="4" fill="#ff2a4b" />
                    <circle cx="145" cy="135" r="4" fill="#ff2a4b" />
                    <circle cx="100" cy="165" r="4" fill="#ff2a4b" />
                    <circle cx="45" cy="130" r="4" fill="#ff2a4b" />
                    <circle cx="50" cy="70" r="4" fill="#ff2a4b" />
                  </svg>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-crimson-neon"></span>
                    <span>A01: Access Control (85%)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>A05: Misconfig (70%)</span>
                  </div>
                </div>
              </div>

              {/* 2. SecOps Copilot Interactive Chatbox */}
              <div className="bg-obsidian-900 rounded-2xl border border-crimson-muted shadow-card-dark p-5 flex flex-col justify-between h-[360px]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-crimson/20 rounded-lg border border-crimson/40">
                        <Bot className="w-4 h-4 text-crimson-neon" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-white">
                          SecOps Copilot
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          AI Tư Vấn Bảo Mật Trực Tiếp
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ● Online
                    </span>
                  </div>

                  <div className="mt-3 space-y-3 overflow-y-auto max-h-48 text-xs pr-1">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={
                          msg.sender === "user"
                            ? "bg-crimson/20 border border-crimson/40 p-2.5 rounded-xl text-slate-200 text-right"
                            : "bg-obsidian-950 border border-crimson-muted p-2.5 rounded-xl text-slate-300"
                        }
                      >
                        <p className="font-bold text-crimson-neon text-[10px] mb-0.5">
                          {msg.sender === "user" ? "Bạn:" : "AegisOps Copilot:"}
                        </p>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-crimson-muted space-y-2">
                  <div className="flex space-x-1.5 overflow-x-auto pb-1 text-[10px]">
                    <button
                      onClick={() => {
                        setChatInput("Cách vá lỗi CORS trên Nginx?");
                      }}
                      className="px-2.5 py-1 rounded bg-obsidian-950 border border-crimson-muted text-slate-400 hover:text-white hover:border-crimson/50 whitespace-nowrap transition cursor-pointer"
                    >
                      + Vá CORS Nginx
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("Sinh cấu hình CSP an toàn");
                      }}
                      className="px-2.5 py-1 rounded bg-obsidian-950 border border-crimson-muted text-slate-400 hover:text-white hover:border-crimson/50 whitespace-nowrap transition cursor-pointer"
                    >
                      + Cấu hình CSP
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Đặt câu hỏi kỹ thuật cho Copilot..."
                      className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute right-2.5 top-2 text-crimson-neon hover:text-white transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 3. MODAL: DROP-IN REMEDIATION PATCH VIEWER */}
      {isPatchModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-2xl shadow-neon-red overflow-hidden">
            <div className="px-5 py-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-850">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-crimson-neon" />
                <span className="font-bold text-sm text-white">
                  Mã Nguồn Vá Lỗi Tự Động (Drop-in Nginx Patch)
                </span>
              </div>
              <button
                onClick={() => setIsPatchModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300">
                Chèn trực tiếp đoạn mã sau vào file cấu hình{" "}
                <code className="text-crimson-neon font-mono">
                  /etc/nginx/conf.d/security.conf
                </code>
                :
              </p>

              <pre className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                {`# 1. Khóa cứng Origin CORS, cấm phản chiếu tự do
set $cors_origin "";
if ($http_origin ~* "^https?://(fintech-hubt\\.edu\\.vn|app\\.fintech-hubt\\.edu\\.vn)$") {
    set $cors_origin $http_origin;
}
add_header Access-Control-Allow-Origin $cors_origin always;
add_header Access-Control-Allow-Credentials "true" always;

# 2. Bộ 6 Security Headers cốt lõi
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;`}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`text-xs text-emerald-400 font-semibold transition ${
                    copied ? "opacity-100" : "opacity-0"
                  }`}
                >
                  [✓] Đã sao chép vào bộ nhớ tạm!
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyPatch}
                    className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-neon-red-sm flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Sao Chép Mã Vá Lỗi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
