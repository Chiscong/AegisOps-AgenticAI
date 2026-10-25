"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Scorecards } from "@/components/dashboard/Scorecards";
import { TerminalLogs } from "@/components/dashboard/TerminalLogs";
import { VulnerabilityAccordion } from "@/components/dashboard/VulnerabilityAccordion";
import { OwaspRadarChart } from "@/components/dashboard/OwaspRadarChart";
import { SecOpsCopilot } from "@/components/dashboard/SecOpsCopilot";
import { PatchModal } from "@/components/dashboard/PatchModal";

import {
  INITIAL_TELEMETRY,
  MOCK_VULNERABILITIES,
  INITIAL_LOGS,
  INITIAL_CHAT,
} from "@/constants/mockData";
import { ScanTelemetry, LogEntry, ChatMessage } from "@/types";

export default function AegisDashboard() {
  const [targetUrl, setTargetUrl] = useState("https://api.fintech-hubt.edu.vn");
  const [isScanning, setIsScanning] = useState(false);
  const [telemetry, setTelemetry] = useState<ScanTelemetry>(INITIAL_TELEMETRY);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const [activePatchCode, setActivePatchCode] = useState(
    MOCK_VULNERABILITIES[0].patchCode
  );

  const handleStartScan = () => {
    setIsScanning(true);
    setTelemetry((prev) => ({ ...prev, status: "SCANNING" }));
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "error",
        message: `[!] Kích hoạt quét mục tiêu: ${targetUrl}`,
      },
    ]);

    const simLogs: Array<{ level: LogEntry["level"]; text: string }> = [
      {
        level: "info",
        text: "[*] [SSRF Guard] Phân tích trước DNS: Host hợp lệ, không thuộc dải mạng cấm.",
      },
      {
        level: "info",
        text: "[*] [ReconAgent] Đang gửi 15 HTTP requests thăm dò Headers, CORS, SSL và Robots...",
      },
      {
        level: "error",
        text: "[!] [TriageAgent] Phát hiện: Access-Control-Allow-Origin phản chiếu nguồn tùy ý!",
      },
      {
        level: "action",
        text: "[*] [TriageAgent] Đối chiếu tiêu chuẩn bảo mật OWASP Top 10 (A01 - Broken Access Control)",
      },
      {
        level: "info",
        text: "[*] [AdvisoryAgent] Đang sinh mã vá lỗi Nginx và Dockerfile Hardening...",
      },
      {
        level: "success",
        text: "[✓] Hoàn thành phân tích toàn diện. Aegis Security Score: 40/100.",
      },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < simLogs.length) {
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            level: simLogs[i].level,
            message: simLogs[i].text,
          },
        ]);
        i++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setTelemetry((prev) => ({
          ...prev,
          status: "COMPLETED",
          score: 40,
        }));
      }
    }, 700);
  };

  const handleOpenPatchModal = (code: string) => {
    setActivePatchCode(code);
    setPatchModalOpen(true);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: `Tôi đã nhận được yêu cầu về "${text}". Đối với lỗi CORS Arbitrary Origin Reflection, bạn nên khóa cứng whitelist danh sách tên miền cụ thể trong reverse proxy thay vì phản chiếu giá trị Origin từ client.`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div
      className="flex h-screen bg-obsidian-950 text-slate-100 font-sans overflow-hidden antialiased"
      suppressHydrationWarning
    >
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden" suppressHydrationWarning>
        {/* Header Action Bar */}
        <Header
          targetUrl={targetUrl}
          onTargetUrlChange={setTargetUrl}
          isScanning={isScanning}
          onStartScan={handleStartScan}
        />

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6" suppressHydrationWarning>
          {/* Row 1: Scorecards */}
          <Scorecards telemetry={telemetry} />

          {/* Row 2: Terminal Logs & Radar Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" suppressHydrationWarning>
            <div className="lg:col-span-2">
              <TerminalLogs logs={logs} isScanning={isScanning} />
            </div>
            <div>
              <OwaspRadarChart />
            </div>
          </div>

          {/* Row 3: Vulnerabilities Accordion & SecOps Copilot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" suppressHydrationWarning>
            <div className="lg:col-span-2">
              <VulnerabilityAccordion
                vulnerabilities={MOCK_VULNERABILITIES}
                onSelectPatch={handleOpenPatchModal}
              />
            </div>
            <div>
              <SecOpsCopilot
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal xem bản vá mã nguồn */}
      <PatchModal
        isOpen={patchModalOpen}
        onClose={() => setPatchModalOpen(false)}
        patchCode={activePatchCode}
      />
    </div>
  );
}
