"use client";

import React from "react";
import { Radar } from "lucide-react";

export function OwaspRadarChart() {
  return (
    <div className="bg-obsidian-900 rounded-2xl border border-crimson-muted shadow-card-dark p-5">
      <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2">
          <Radar className="w-4 h-4 text-crimson-neon" />
          <span>Ma Trận Rủi Ro OWASP Top 10</span>
        </h3>
        <span className="text-[10px] font-mono text-slate-400">WSTG v4.2</span>
      </div>

      {/* Radar SVG Visualization */}
      <div className="mt-4 flex items-center justify-center relative">
        <svg className="w-56 h-56" viewBox="0 0 200 200">
          {/* Background Concentric Circles */}
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

          {/* Cross Axis Lines */}
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

          {/* Dynamic Vulnerability Polygon */}
          <polygon
            points="100,35 155,75 145,135 100,165 45,130 50,70"
            fill="rgba(239, 68, 68, 0.35)"
            stroke="#ff2a4b"
            strokeWidth="2"
          />

          {/* Corner Marker Dots */}
          <circle cx="100" cy="35" r="4" fill="#ff2a4b" />
          <circle cx="155" cy="75" r="4" fill="#ff2a4b" />
          <circle cx="145" cy="135" r="4" fill="#ff2a4b" />
          <circle cx="100" cy="165" r="4" fill="#ff2a4b" />
          <circle cx="45" cy="130" r="4" fill="#ff2a4b" />
          <circle cx="50" cy="70" r="4" fill="#ff2a4b" />
        </svg>
      </div>

      {/* Radar Category Badges */}
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
  );
}
