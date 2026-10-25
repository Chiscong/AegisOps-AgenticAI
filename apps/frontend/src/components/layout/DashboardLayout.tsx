"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  defaultTargetUrl?: string;
}

export function DashboardLayout({
  children,
  defaultTargetUrl = "https://app.fintech-hubt.edu.vn",
}: DashboardLayoutProps) {
  const [targetUrl, setTargetUrl] = useState(defaultTargetUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 4500);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-obsidian-950 text-slate-100 font-sans items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">
            Khởi động AegisOps SecOps Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-obsidian-950 text-slate-100 font-sans overflow-hidden antialiased"
      suppressHydrationWarning
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          targetUrl={targetUrl}
          onTargetUrlChange={setTargetUrl}
          isScanning={isScanning}
          onStartScan={handleStartScan}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
