"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Bot,
  Radar,
  Server,
  Settings,
  ChevronDown,
} from "lucide-react";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <aside className="w-64 bg-obsidian-900 border-r border-crimson-muted flex flex-col justify-between shrink-0 transition-all duration-300">
      <div className="p-4">
        {/* Brand Header */}
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

        {/* Environment Workspace Dropdown */}
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

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1 px-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition ${
              activeTab === "dashboard"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40 shadow-neon-red-sm"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Live Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("vulns")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-wide transition ${
              activeTab === "vulns"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="flex-1 text-left">Vulnerabilities</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 rounded">
              2 Crit
            </span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-wide transition ${
              activeTab === "agents"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Agent Fleet (3)</span>
          </button>

          <button
            onClick={() => setActiveTab("owasp")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-wide transition ${
              activeTab === "owasp"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>OWASP Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-wide transition ${
              activeTab === "infra"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Infrastructure</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-wide transition ${
              activeTab === "settings"
                ? "bg-crimson/10 text-crimson-neon border border-crimson/40"
                : "text-slate-400 hover:text-white hover:bg-obsidian-850"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & API</span>
          </button>
        </nav>
      </div>

      {/* Cluster Status & User Profile */}
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
  );
}
