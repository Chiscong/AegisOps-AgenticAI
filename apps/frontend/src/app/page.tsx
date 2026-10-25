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
        text: `Tôi đã nhận được câu hỏi về "${text}". Đối với lỗ hổng này, bạn nên cấu hình whitelist domain cụ thể và loại bỏ ký tự wildcard '*' khi bật credentials để tuân thủ RFC 6454.`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleOpenPatchModal = (patch: string) => {
    setActivePatchCode(patch);
    setPatchModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-obsidian-950 text-slate-100 font-sans overflow-hidden antialiased select-none">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Command Bar */}
        <Header
          targetUrl={targetUrl}
          onTargetUrlChange={setTargetUrl}
          isScanning={isScanning}
          onStartScan={handleStartScan}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* A. 4 Metric Scorecards */}
          <Scorecards telemetry={telemetry} />

          {/* B. Main Generative Canvas: 7 : 5 Split Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 Cols): Terminal Logs + Vulnerability Triage */}
            <div className="lg:col-span-7 space-y-6">
              <TerminalLogs logs={logs} isScanning={isScanning} />
              <VulnerabilityAccordion
                vulnerabilities={MOCK_VULNERABILITIES}
                onSelectPatch={handleOpenPatchModal}
              />
            </div>

            {/* Right Column (5 Cols): OWASP Radar + Copilot Chat */}
            <div className="lg:col-span-5 space-y-6">
              <OwaspRadarChart />
              <SecOpsCopilot
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </section>
        </main>
      </div>

      {/* 3. Drop-in Remediation Patch Modal */}
      <PatchModal
        isOpen={patchModalOpen}
        onClose={() => setPatchModalOpen(false)}
        patchCode={activePatchCode}
      />
    </div>
  );
}
