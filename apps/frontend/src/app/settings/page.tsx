"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { DEFAULT_SETTINGS } from "@/constants/mockData";
import { SystemSettings } from "@/types";
import {
  Settings,
  Cpu,
  GitBranch,
  ShieldAlert,
  Bell,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"llm" | "github" | "ssrf" | "webhooks">("llm");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => {
        console.warn("[Settings] Lỗi tải cấu hình:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      showToast("Đã lưu toàn bộ cấu hình hệ thống và áp dụng tức thì!");
    } catch (err: any) {
      showToast(`Lỗi lưu cấu hình: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    setSettings((prev) => ({
      ...prev,
      ssrfWhitelistDomains: [...prev.ssrfWhitelistDomains, newDomain.trim()],
    }));
    setNewDomain("");
    showToast("Đã thêm tên miền vào Whitelist SSRF.");
  };

  const handleRemoveDomain = (domain: string) => {
    setSettings((prev) => ({
      ...prev,
      ssrfWhitelistDomains: prev.ssrfWhitelistDomains.filter((d) => d !== domain),
    }));
    showToast("Đã xóa tên miền khỏi Whitelist.");
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
              System Settings & Integration Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cấu hình LLM Engine, kết nối GitHub Auto-PR, danh sách IP Blacklist phòng chống SSRF và Webhooks cảnh báo.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu Cấu Hình</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex space-x-2 bg-obsidian-900 p-1.5 rounded-2xl border border-crimson-muted overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("llm")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "llm"
              ? "bg-crimson text-white shadow-neon-red-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>LLM Engine & Model</span>
        </button>

        <button
          onClick={() => setActiveTab("github")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "github"
              ? "bg-crimson text-white shadow-neon-red-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>GitHub DevSecOps Auto-PR</span>
        </button>

        <button
          onClick={() => setActiveTab("ssrf")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "ssrf"
              ? "bg-crimson text-white shadow-neon-red-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SSRF Guard Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "webhooks"
              ? "bg-crimson text-white shadow-neon-red-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Webhooks & Alerts</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-6 shadow-card-dark space-y-6">
        
        {/* TAB 1: LLM Engine & Model */}
        {activeTab === "llm" && (
          <div className="space-y-5">
            <div className="border-b border-crimson-muted pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Cấu Hình Mô Hình Ngôn Ngữ Lớn (LLM Provider)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Lựa chọn mô hình Local QLoRA chạy nội bộ hoặc tích hợp Cloud API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nhà Cung Cấp LLM
                </label>
                <select
                  value={settings.llmProvider}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      llmProvider: e.target.value as any,
                    })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon"
                >
                  <option value="ollama">Ollama / vLLM (Local Model - Khuyến nghị)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="deepseek">DeepSeek (DeepSeek Coder V2)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Tên Mô Hình Cụ Thể
                </label>
                <input
                  type="text"
                  value={settings.modelName}
                  onChange={(e) =>
                    setSettings({ ...settings, modelName: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Ollama / Local Service URL
                </label>
                <input
                  type="text"
                  value={settings.ollamaBaseUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, ollamaBaseUrl: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  API Key (OpenAI / DeepSeek)
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={settings.openaiApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiApiKey: e.target.value })
                    }
                    className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Mức Độ Nén Token (Context Compression Level)
                </span>
                <span className="font-mono text-emerald-400">
                  {settings.tokenCompressionLevel.toUpperCase()} (-90% Token Reduction)
                </span>
              </div>
              <select
                value={settings.tokenCompressionLevel}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tokenCompressionLevel: e.target.value as any,
                  })
                }
                className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon"
              >
                <option value="metrics">Metrics & Signatures Only (-90% Tokens, Cực Nhanh)</option>
                <option value="branch">Branch & Control Flow (-60% Tokens)</option>
                <option value="summary">Summary & Signatures (-75% Tokens)</option>
                <option value="full">Full Context (Không nén)</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 2: GitHub & DevSecOps Auto-PR */}
        {activeTab === "github" && (
          <div className="space-y-5">
            <div className="border-b border-crimson-muted pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Tích Hợp GitHub DevSecOps Pull Request
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cho phép AdvisoryAgent tự động mở Pull Request vá lỗ hổng trực tiếp vào kho lưu trữ GitHub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  GitHub Personal Access Token (PAT)
                </label>
                <div className="relative">
                  <input
                    type={showGithubToken ? "text" : "password"}
                    value={settings.githubToken}
                    onChange={(e) =>
                      setSettings({ ...settings, githubToken: e.target.value })
                    }
                    className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGithubToken(!showGithubToken)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showGithubToken ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Target Repository (Owner/Repo)
                </label>
                <input
                  type="text"
                  value={settings.githubRepo}
                  onChange={(e) =>
                    setSettings({ ...settings, githubRepo: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Base Branch
                </label>
                <input
                  type="text"
                  value={settings.githubBranch}
                  onChange={(e) =>
                    setSettings({ ...settings, githubBranch: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="auto-assign"
                  checked={settings.prAutoAssign}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      prAutoAssign: e.target.checked,
                    })
                  }
                  className="rounded border-crimson-muted text-crimson focus:ring-crimson bg-obsidian-950 w-4 h-4"
                />
                <label htmlFor="auto-assign" className="text-xs text-slate-300 cursor-pointer">
                  Tự động gắn thẻ Reviewer và nhãn <code>security</code>, <code>automated-pr</code>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SSRF Guard Rules */}
        {activeTab === "ssrf" && (
          <div className="space-y-5">
            <div className="border-b border-crimson-muted pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Chính Sách Phòng Chống Server-Side Request Forgery (SSRF Guard)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quy định dải IP Private cấm quét và danh sách tên miền tin cậy.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Dải IP Blacklist Bắt Buộc (RFC 1918 & Cloud Metadata)
              </label>
              <div className="flex flex-wrap gap-2">
                {settings.ssrfBlacklistCidrs.map((cidr, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-red-950 text-red-400 border border-red-800 text-xs font-mono"
                  >
                    {cidr}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Whitelist Tên Miền Cho Phép Quét
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Thêm tên miền, ví dụ: myapp.company.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1 bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-crimson-neon font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddDomain}
                  className="px-3.5 py-2 bg-crimson hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="space-y-1.5 mt-2">
                {settings.ssrfWhitelistDomains.map((domain, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-950 border border-crimson-muted text-xs font-mono"
                  >
                    <span className="text-slate-200">{domain}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDomain(domain)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Webhooks & Alerts */}
        {activeTab === "webhooks" && (
          <div className="space-y-5">
            <div className="border-b border-crimson-muted pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Kênh Cảnh Báo Tức Thời (Webhooks)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bắn thông báo trực tiếp khi phát hiện lỗ hổng nghiêm trọng (Critical) hoặc khi tạo PR vá lỗi.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Discord Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.discordWebhookUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, discordWebhookUrl: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Slack Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.slackWebhookUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, slackWebhookUrl: e.target.value })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Ngưỡng Cảnh Báo (Alert Threshold)
                </label>
                <select
                  value={settings.alertThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      alertThreshold: e.target.value as any,
                    })
                  }
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon"
                >
                  <option value="CRITICAL">Chỉ bắn cảnh báo khi có lỗ hổng CRITICAL</option>
                  <option value="HIGH">Bắn cảnh báo khi có lỗ hổng HIGH & CRITICAL</option>
                  <option value="ALL">Bắn cảnh báo cho TẤT CẢ các sự kiện quét</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-crimson-muted flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Toàn Bộ Cấu Hình</span>
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
}
