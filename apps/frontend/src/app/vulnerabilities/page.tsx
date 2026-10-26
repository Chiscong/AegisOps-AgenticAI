"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PatchModal } from "@/components/dashboard/PatchModal";
import { api } from "@/lib/api";
import { Vulnerability, SeverityLevel } from "@/types";
import {
  ShieldAlert,
  Flame,
  Search,
  Filter,
  Download,
  GitPullRequest,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  FileCode,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function VulnerabilitiesPage() {
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPatch, setSelectedPatch] = useState<Vulnerability | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getVulnerabilities()
      .then((data) => {
        setVulns(data || []);
        if (data && data.length > 0) {
          setExpandedId(data[0].id);
        }
      })
      .catch((err) => {
        console.warn("[Vulnerabilities] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredVulns = vulns.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cweId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owaspCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "ALL" || v.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "ALL" || v.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-950/80 text-red-400 border-red-800 shadow-neon-red-sm";
      case "HIGH":
        return "bg-amber-950/80 text-amber-400 border-amber-800";
      case "MEDIUM":
        return "bg-yellow-950/80 text-yellow-400 border-yellow-800";
      case "LOW":
        return "bg-blue-950/80 text-blue-400 border-blue-800";
      default:
        return "bg-slate-900 text-slate-400 border-slate-700";
    }
  };

  const getStatusBadge = (status: Vulnerability["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-red-950 text-red-400 border-red-800";
      case "IN_REVIEW":
        return "bg-amber-950 text-amber-400 border-amber-800";
      case "PR_CREATED":
        return "bg-fuchsia-950 text-fuchsia-400 border-fuchsia-800";
      case "RESOLVED":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
    }
  };

  const handleCreatePr = (vuln: Vulnerability) => {
    setVulns((prev) =>
      prev.map((item) =>
        item.id === vuln.id ? { ...item, status: "PR_CREATED" } : item
      )
    );
    showToast(`Đã tự động tạo Pull Request cho ${vuln.id} trên GitHub!`);
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredVulns, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "aegisops-vulnerabilities.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã tải xuống báo cáo lỗ hổng định dạng JSON!");
  };

  return (
    <DashboardLayout>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-obsidian-900 border border-crimson text-white px-4 py-3 rounded-xl shadow-neon-red flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-crimson-muted gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Vulnerability Triage & Remediation Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thẩm định lỗ hổng theo tiêu chuẩn OWASP Top 10, phân loại CWE và tự động sinh mã vá lỗi Hardening.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-obsidian-850 hover:bg-obsidian-800 border border-crimson-muted hover:border-crimson/50 text-slate-200 text-xs font-medium rounded-xl flex items-center space-x-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </button>
          <button
            onClick={() => showToast("Đang kích hoạt quy trình Batch Auto-PR...")}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Batch Auto-PR (Tất cả)</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Tổng Lỗ Hổng
          </span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {vulns.length}
          </span>
        </div>
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-red-400 block">
            Critical
          </span>
          <span className="text-2xl font-extrabold text-red-400 mt-1 block">
            {vulns.filter((v) => v.severity === "CRITICAL").length}
          </span>
        </div>
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">
            High
          </span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
            {vulns.filter((v) => v.severity === "HIGH").length}
          </span>
        </div>
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-yellow-400 block">
            Medium
          </span>
          <span className="text-2xl font-extrabold text-yellow-400 mt-1 block">
            {vulns.filter((v) => v.severity === "MEDIUM").length}
          </span>
        </div>
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-blue-400 block">
            Low / Info
          </span>
          <span className="text-2xl font-extrabold text-blue-400 mt-1 block">
            {vulns.filter((v) => v.severity === "LOW").length}
          </span>
        </div>
        <div className="bg-obsidian-900 border border-crimson-muted rounded-xl p-3.5 shadow-card-dark">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">
            Đã Sinh Bản Vá
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
            100%
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-obsidian-900 p-3 rounded-2xl border border-crimson-muted shadow-card-dark">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, CWE, endpoint hoặc OWASP category..."
            className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition font-mono"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center space-x-1 bg-obsidian-950 p-1 rounded-xl border border-crimson-muted text-xs font-semibold overflow-x-auto w-full md:w-auto">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedSeverity(level)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedSeverity === level
                  ? "bg-crimson text-white shadow-neon-red-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-obsidian-950 border border-crimson-muted text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-crimson-neon"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="OPEN">Chưa xử lý (OPEN)</option>
            <option value="IN_REVIEW">Đang thẩm định (IN_REVIEW)</option>
            <option value="PR_CREATED">Đã tạo PR (PR_CREATED)</option>
            <option value="RESOLVED">Đã vá (RESOLVED)</option>
          </select>
        </div>
      </div>

      {/* Vulnerabilities Accordion List */}
      <div className="space-y-4">
        {filteredVulns.length === 0 ? (
          <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">
              Không tìm thấy lỗ hổng phù hợp
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc độ nghiêm trọng.
            </p>
          </div>
        ) : (
          filteredVulns.map((vuln) => {
            const isExpanded = expandedId === vuln.id;

            return (
              <div
                key={vuln.id}
                className="bg-obsidian-900 border border-crimson-muted hover:border-crimson/50 rounded-2xl overflow-hidden shadow-card-dark transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : vuln.id)
                  }
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-obsidian-850 transition"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(
                        vuln.severity
                      )}`}
                    >
                      {vuln.severity}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-obsidian-950 border border-crimson-muted text-slate-300">
                      CVSS {vuln.cvssScore}
                    </span>

                    <div className="truncate flex-1">
                      <h3 className="text-xs font-bold text-white truncate">
                        {vuln.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        {vuln.cweId} • Endpoint: {vuln.endpoint}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${getStatusBadge(
                        vuln.status
                      )}`}
                    >
                      {vuln.status}
                    </span>

                    <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400">
                      {vuln.owaspCategory}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-crimson-neon" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-5 border-t border-crimson-muted bg-obsidian-950/70 space-y-4">
                    {/* Description & Impact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-obsidian-900/60 p-3.5 rounded-xl border border-crimson-muted">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
                          Mô Tả & Cơ Chế Khai Thác
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {vuln.description}
                        </p>
                      </div>

                      <div className="bg-obsidian-900/60 p-3.5 rounded-xl border border-crimson-muted">
                        <span className="text-[10px] font-mono uppercase font-bold text-red-400 block mb-1">
                          Phân Tích Tác Động Rủi Ro
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {vuln.impactAnalysis}
                        </p>
                      </div>
                    </div>

                    {/* Evidence Snippet */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center space-x-1.5">
                          <Terminal className="w-3 h-3 text-crimson-neon" />
                          <span>Bằng Chứng Khai Thác (HTTP Evidence)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Ghi nhận lúc: {vuln.createdAt}
                        </span>
                      </div>
                      <pre className="bg-obsidian-950 p-3.5 rounded-xl border border-crimson-muted font-mono text-xs text-rose-300/90 overflow-x-auto leading-relaxed">
                        {vuln.evidence}
                      </pre>
                    </div>

                    {/* Patch Code Preview */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center space-x-1.5">
                          <FileCode className="w-3 h-3 text-emerald-400" />
                          <span>Mã Vá Lỗi Hardening Tự Động (Advisory Agent)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Engine: DeepSeek-Coder-V2 AST
                        </span>
                      </div>
                      <pre className="bg-obsidian-950 p-3.5 rounded-xl border border-crimson-muted font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                        {vuln.patchCode}
                      </pre>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-crimson-muted/50">
                      <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{vuln.remediationGuidance}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => setSelectedPatch(vuln)}
                          className="px-3 py-1.5 bg-obsidian-850 hover:bg-obsidian-800 border border-crimson-muted text-slate-200 text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5 text-crimson-neon" />
                          <span>Xem Bản Vá Toàn Diện</span>
                        </button>

                        <button
                          onClick={() => handleCreatePr(vuln)}
                          disabled={vuln.status === "PR_CREATED"}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer ${
                            vuln.status === "PR_CREATED"
                              ? "bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 opacity-80"
                              : "bg-crimson hover:bg-red-600 text-white shadow-neon-red-sm"
                          }`}
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                          <span>
                            {vuln.status === "PR_CREATED"
                              ? "PR #104 Đã Tạo"
                              : "Tạo GitHub PR"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Full Patch Modal */}
      <PatchModal
        isOpen={!!selectedPatch}
        onClose={() => setSelectedPatch(null)}
        patchCode={selectedPatch?.patchCode || ""}
      />
    </DashboardLayout>
  );
}
