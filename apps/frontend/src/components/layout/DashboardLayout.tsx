"use client";

import React, { useState } from "react";
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

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 4500);
  };

  return (
    <div
      className="flex h-screen bg-obsidian-950 text-slate-100 font-sans overflow-hidden antialiased"
      suppressHydrationWarning
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden" suppressHydrationWarning>
        <Header
          targetUrl={targetUrl}
          onTargetUrlChange={setTargetUrl}
          isScanning={isScanning}
          onStartScan={handleStartScan}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </div>
  );
}
