"use client";

import React, { useEffect, useRef } from "react";
import { LogEntry } from "@/types";

interface TerminalLogsProps {
  logs: LogEntry[];
  isScanning: boolean;
}

export function TerminalLogs({ logs, isScanning }: TerminalLogsProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-400 font-bold";
      case "success":
        return "text-emerald-400 font-bold";
      case "action":
        return "text-fuchsia-400";
      case "warn":
        return "text-amber-400";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div className="bg-obsidian-950 rounded-2xl border border-crimson/50 shadow-card-dark overflow-hidden flex flex-col">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-obsidian-900 border-b border-crimson-muted flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 font-mono text-xs font-bold text-slate-300">
            LIVE AGENTIC SSE STREAM — REASONING FEED
          </span>
        </div>
        <span
          className={`text-[10px] font-mono text-crimson-neon px-2 py-0.5 rounded bg-crimson/10 border border-crimson/30 ${
            isScanning ? "animate-pulse" : ""
          }`}
        >
          {isScanning ? "REC ● 150 tok/s" : "STANDBY"}
        </span>
      </div>

      {/* Terminal Log Output Window */}
      <div
        ref={terminalRef}
        className="p-4 font-mono text-xs space-y-2 h-64 overflow-y-auto bg-obsidian-950 text-slate-300 leading-relaxed"
      >
        {logs.map((log, idx) => (
          <p key={idx} className={getLogClass(log.level)}>
            <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
            {log.message}
          </p>
        ))}
        {isScanning && (
          <span className="inline-block w-2 h-4 bg-crimson-neon animate-pulse"></span>
        )}
      </div>
    </div>
  );
}
