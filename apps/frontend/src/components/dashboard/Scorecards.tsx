"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { ScanTelemetry } from "@/types";

interface ScorecardsProps {
  telemetry: ScanTelemetry;
}

export function Scorecards({ telemetry }: ScorecardsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-crimson-neon";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "AN TOÀN (LOW RISK)";
    if (score >= 50) return "CẦN LƯU Ý (MEDIUM RISK)";
    return "RỦI RO CAO (HIGH RISK)";
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* 1. Aegis Security Score */}
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
            <span
              className={`text-4xl font-extrabold font-mono tracking-tight ${getScoreColor(
                telemetry.score
              )}`}
            >
              {telemetry.score}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100 ĐIỂM</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-obsidian-950 h-2 rounded-full overflow-hidden p-0.5 border border-crimson-muted">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-crimson-neon rounded-full transition-all duration-1000"
              style={{ width: `${telemetry.score}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-red-400 font-semibold mt-1.5 flex items-center space-x-1">
            <span>●</span>
            <span>{getScoreLabel(telemetry.score)}</span>
          </p>
        </div>
      </div>

      {/* 2. Critical Threats */}
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
            {telemetry.criticalCount < 10
              ? `0${telemetry.criticalCount}`
              : telemetry.criticalCount}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400">
          <span>CORS Reflection & Rò rỉ Admin</span>
        </div>
      </div>

      {/* 3. Security Headers Missing */}
      <div className="p-5 bg-obsidian-850 rounded-2xl border border-crimson-muted shadow-card-dark flex flex-col justify-between hover:border-crimson/30 transition">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Security Headers
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-400 border border-amber-800 rounded font-mono font-bold">
              THIẾU {telemetry.headersMissingCount}/{telemetry.totalHeaders}
            </span>
          </div>
          <p className="text-4xl font-extrabold text-amber-400 mt-2 font-mono">
            0{telemetry.headersMissingCount}{" "}
            <span className="text-base text-slate-500 font-normal">
              / 0{telemetry.totalHeaders}
            </span>
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400 truncate">
          <span>Thiếu CSP, HSTS, X-Frame</span>
        </div>
      </div>

      {/* 4. Recon Telemetry */}
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
            {telemetry.scanDuration}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-crimson-muted/60 text-xs text-slate-400 flex justify-between">
          <span>WAF: {telemetry.waf}</span>
          <span>Server: {telemetry.serverBanner}</span>
        </div>
      </div>
    </section>
  );
}
