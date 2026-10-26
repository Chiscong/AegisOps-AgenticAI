"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { OwaspCategoryReport } from "@/types";
import {
  Radar,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  ExternalLink,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function OwaspPage() {
  const [matrix, setMatrix] = useState<OwaspCategoryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getOwaspMatrix()
      .then((data) => setMatrix(data || []))
      .catch((err) => {
        console.warn("[OWASP] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMatrix = matrix.filter((item) => {
    if (selectedFilter === "PASSED") return item.status === "PASSED";
    if (selectedFilter === "FAILED") return item.status === "FAILED";
    if (selectedFilter === "WARNING") return item.status === "WARNING";
    return true;
  });

  const passedCount = matrix.filter((m) => m.status === "PASSED").length;
  const failedCount = matrix.filter((m) => m.status === "FAILED").length;
  const warningCount = matrix.filter((m) => m.status === "WARNING").length;

  const averageCompliance = Math.round(
    matrix.reduce((acc, curr) => acc + curr.complianceRate, 0) / matrix.length
  );

  const getStatusBadge = (status: OwaspCategoryReport["status"]) => {
    switch (status) {
      case "PASSED":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "FAILED":
        return "bg-red-950 text-red-400 border-red-800 shadow-neon-red-sm";
      case "WARNING":
        return "bg-amber-950 text-amber-400 border-amber-800";
    }
  };

  const handleExportCertificate = () => {
    showToast("Đang kết xuất Chứng Chỉ Kiểm Định OWASP Compliance Certificate (PDF)...");
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
              OWASP Top 10 (2021) & WSTG v4.2 Compliance Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              Audit Standard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Báo cáo đối soát 10 hạng mục an ninh mạng ứng dụng web hàng đầu thế giới với hệ thống kiểm thử tự hành.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCertificate}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Xuất Chứng Nhận OWASP (PDF)</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Score */}
        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Tỷ Lệ Tuân Thủ
            </span>
            <Radar className="w-4 h-4 text-crimson-neon" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">
              {averageCompliance}%
            </span>
            <span className="text-xs font-semibold text-amber-400">
              Hạng B (Cần Vá Lỗi)
            </span>
          </div>
          <div className="w-full bg-obsidian-950 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-crimson h-full rounded-full shadow-neon-red-sm"
              style={{ width: `${averageCompliance}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Passed */}
        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Đạt Chuẩn (Passed)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-4xl font-extrabold text-emerald-400 mt-3">
            {passedCount} / 10
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Cryptographic, Injection, SSRF Safe
          </span>
        </div>

        {/* Card 3: Failed */}
        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Không Đạt (Failed)
            </span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-4xl font-extrabold text-red-400 mt-3">
            {failedCount}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            A01 (Access Control) & A05 (Misconfig)
          </span>
        </div>

        {/* Card 4: Warnings */}
        <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Cảnh Báo (Warning)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-4xl font-extrabold text-amber-400 mt-3">
            {warningCount}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            A06 (Components) & A09 (Logging)
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-obsidian-900 p-1.5 rounded-2xl border border-crimson-muted w-fit text-xs font-semibold">
        {[
          { key: "ALL", label: `Tất cả (${matrix.length})` },
          { key: "FAILED", label: `Không đạt (${failedCount})` },
          { key: "WARNING", label: `Cảnh báo (${warningCount})` },
          { key: "PASSED", label: `Đạt chuẩn (${passedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              selectedFilter === tab.key
                ? "bg-crimson text-white shadow-neon-red-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OWASP Matrix Cards */}
      <div className="space-y-3.5">
        {filteredMatrix.map((item) => (
          <div
            key={item.code}
            className="bg-obsidian-900 border border-crimson-muted hover:border-crimson/50 rounded-2xl p-5 shadow-card-dark transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-obsidian-950 border border-crimson-muted text-crimson-neon">
                  {item.code}
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {item.name}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                <span className="text-xs font-mono text-slate-400">
                  Tuân thủ: <strong className="text-white">{item.complianceRate}%</strong>
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-950/60 p-3 rounded-xl border border-crimson-muted">
              {item.summary}
            </p>

            {/* Footer with WSTG tests and link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-500">
                <span>WSTG Tests:</span>
                <div className="flex space-x-1.5">
                  {item.wstgTestCases.map((tc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-obsidian-950 border border-crimson-muted text-slate-300 text-[10px]"
                    >
                      {tc}
                    </span>
                  ))}
                </div>
              </div>

              {item.findingsCount > 0 ? (
                <Link
                  href="/vulnerabilities"
                  className="inline-flex items-center space-x-1 text-crimson-neon hover:underline font-semibold text-xs"
                >
                  <span>Xem {item.findingsCount} Lỗ Hổng & Bản Vá</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-emerald-400 flex items-center space-x-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Không phát hiện rủi ro</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
