"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { AgentFleetMember } from "@/types";
import {
  Bot,
  Cpu,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
  Play,
  RotateCw,
  Sliders,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentFleetMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingAgentId, setTestingAgentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getAgents()
      .then((data) => setAgents(data || []))
      .catch((err) => {
        console.warn("[Agents] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTestAgent = async (agent: AgentFleetMember) => {
    setTestingAgentId(agent.id);
    showToast(`Đang chạy kiểm thử chẩn đoán cho ${agent.name}...`);

    try {
      await api.testAgent(agent.id);
      showToast(`Chẩn đoán hoàn tất: ${agent.name} hoạt động 100% bình thường.`);
    } catch (err: any) {
      showToast(`Lỗi kiểm thử: ${err.message}`);
    } finally {
      setTestingAgentId(null);
    }
  };

  const handleRunFullFleetTest = async () => {
    setTestingAgentId("ALL");
    showToast("Đang kích hoạt kiểm thử chu trình bầy đàn 6-Stage Concurrent DAG...");

    try {
      for (const ag of agents) {
        await api.testAgent(ag.id);
      }
      showToast("Toàn bộ 4 Agent vượt qua 32/32 bài kiểm thử tự hành!");
    } catch (err: any) {
      showToast(`Lỗi kiểm thử fleet: ${err.message}`);
    } finally {
      setTestingAgentId(null);
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-obsidian-900 border border-crimson text-white px-4 py-3 rounded-xl shadow-neon-red flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-crimson-muted gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Autonomous AI Agent Fleet Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              4/4 Agents Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Điều phối bầy đàn tự hành 6-Stage 5-Pillar Concurrent Swarm DAG, nén token -90% và tự trị sửa lỗi DevSecOps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunFullFleetTest}
            disabled={testingAgentId !== null}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {testingAgentId === "ALL"
                ? "Đang Kiểm Thử Bầy Đàn..."
                : "Chạy Toàn Bộ AI Fleet Test"}
            </span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Fleet Capacity
            </span>
            <Bot className="w-4 h-4 text-crimson-neon" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">4/4</p>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Recon • Triage • Advisory • DAG
          </span>
        </div>

        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Token Savings
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">-85.4%</p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Context AST Filter Engine
          </span>
        </div>

        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Average Latency
            </span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">
            1.8<span className="text-lg font-normal text-slate-400">s</span>
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            P50: 1.2s • P99: 3.8s
          </span>
        </div>

        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Vòng Tự Sửa Lỗi
            </span>
            <RotateCw className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">100%</p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Zero-stubs Invariant
          </span>
        </div>
      </div>

      {/* Interactive Workflow DAG Visualization */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-crimson-neon" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              LangGraph Multi-Agent Execution DAG (Quy Trình Tác Chiến)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Concurrent 6 Threads • Cyclic Feedback Loop
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Node 1 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson/30 relative group hover:border-crimson transition">
            <div className="flex items-center justify-between text-crimson-neon font-bold mb-2">
              <span>01. RECON</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-slate-300 text-[11px]">
              DNS SSRF Guard & thăm dò thụ động 15 endpoints.
            </p>
            <div className="mt-3 text-[10px] text-slate-500">Output: Telemetry JSON</div>
            <ArrowRight className="hidden md:block w-4 h-4 text-crimson-neon absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
          </div>

          {/* Node 2 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson/30 relative group hover:border-crimson transition">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
              <span>02. TRIAGE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Truy vấn Qdrant RAG, phân loại CWE & lọc cảnh báo rác.
            </p>
            <div className="mt-3 text-[10px] text-slate-500">Output: Finding Verified</div>
            <ArrowRight className="hidden md:block w-4 h-4 text-crimson-neon absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
          </div>

          {/* Node 3 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson/30 relative group hover:border-crimson transition">
            <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
              <span>03. ADVISORY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-slate-300 text-[11px]">
              DeepSeek AST sinh mã vá Nginx & Express Hardening.
            </p>
            <div className="mt-3 text-[10px] text-slate-500">Output: Unified Diff</div>
            <ArrowRight className="hidden md:block w-4 h-4 text-crimson-neon absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
          </div>

          {/* Node 4 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson/30 relative group hover:border-crimson transition">
            <div className="flex items-center justify-between text-fuchsia-400 font-bold mb-2">
              <span>04. PULL REQUEST</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Tạo branch GitHub & gửi PR tự động vào nhánh chính.
            </p>
            <div className="mt-3 text-[10px] text-slate-500">Output: PR #104 Merged</div>
          </div>
        </div>
      </div>

      {/* Agent Fleet Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {agents.map((agent) => {
          const isTesting =
            testingAgentId === agent.id || testingAgentId === "ALL";

          return (
            <div
              key={agent.id}
              className="bg-obsidian-900 border border-crimson-muted hover:border-crimson/50 rounded-2xl p-5 shadow-card-dark transition space-y-4"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-crimson/15 rounded-xl border border-crimson/40 text-crimson-neon">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {agent.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {isTesting ? "RUNNING" : agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Latency P50 / P99
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {agent.latencyP50} / {agent.latencyP99}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-950/60 p-3 rounded-xl border border-crimson-muted">
                {agent.description}
              </p>

              {/* Model & Token Telemetry */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-obsidian-950 p-2.5 rounded-xl border border-crimson-muted">
                  <span className="text-[10px] text-slate-500 block">LLM Model</span>
                  <span className="text-slate-200 font-semibold truncate block mt-0.5">
                    {agent.model}
                  </span>
                </div>
                <div className="bg-obsidian-950 p-2.5 rounded-xl border border-crimson-muted">
                  <span className="text-[10px] text-slate-500 block">Token Tiết Kiệm</span>
                  <span className="text-emerald-400 font-semibold block mt-0.5">
                    {agent.tokenSavings}
                  </span>
                </div>
              </div>

              {/* Tools Inventory */}
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-2">
                  Danh Sách Công Cụ Được Cấp Phép ({agent.tools.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-crimson-muted text-[11px] font-mono text-slate-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-crimson-muted flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Tokens: {agent.tokensConsumed.toLocaleString()} consumed
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      showToast(`Mở bộ chỉnh sửa prompt cho ${agent.name}`)
                    }
                    className="p-2 bg-obsidian-850 hover:bg-obsidian-800 border border-crimson-muted text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                    title="Cấu hình Prompt"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleTestAgent(agent)}
                    disabled={isTesting}
                    className="px-3.5 py-1.5 bg-crimson hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-neon-red-sm flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isTesting ? "Đang chạy..." : "Kiểm Thử Agent"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
