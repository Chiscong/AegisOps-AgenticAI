"use client";

import React from "react";
import Link from "next/link";
import { Globe, Zap, Bell, Download, LogIn } from "lucide-react";

interface HeaderProps {
  targetUrl: string;
  onTargetUrlChange: (url: string) => void;
  isScanning: boolean;
  onStartScan: () => void;
}

export function Header({
  targetUrl,
  onTargetUrlChange,
  isScanning,
  onStartScan,
}: HeaderProps) {
  return (
    <header className="h-16 bg-obsidian-900/80 backdrop-blur-md border-b border-crimson-muted px-6 flex items-center justify-between shrink-0">
      {/* Target URL Input Bar */}
      <div className="flex items-center space-x-3 w-7/12">
        <div className="relative flex-1">
          <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => onTargetUrlChange(e.target.value)}
            placeholder="Nhập URL website cần kiểm định an ninh mạng..."
            className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-24 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-crimson-neon transition font-mono"
          />
          <div className="absolute right-2.5 top-2 flex items-center space-x-1 bg-obsidian-850 px-2 py-0.5 rounded border border-crimson-muted text-[10px] text-slate-400">
            <span>Standard</span>
          </div>
        </div>

        <button
          onClick={onStartScan}
          disabled={isScanning}
          className="px-5 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer shrink-0 active:scale-95 disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isScanning ? "Đang Quét..." : "Kích hoạt Quét"}</span>
        </button>
      </div>

      {/* Live AI Status & Quick Actions */}
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

        <button className="p-2 rounded-lg bg-obsidian-850 border border-crimson-muted text-slate-400 hover:text-white transition relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson-neon"></span>
        </button>

        <button className="p-2 rounded-lg bg-obsidian-850 border border-crimson-muted text-slate-400 hover:text-white transition cursor-pointer">
          <Download className="w-4 h-4" />
        </button>

        {/* Link tới trang Đăng nhập / Đăng ký */}
        <Link
          href="/login"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson/15 hover:bg-crimson/25 text-crimson-neon border border-crimson/40 text-xs font-semibold transition shadow-neon-red-sm"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng nhập</span>
        </Link>
      </div>
    </header>
  );
}
