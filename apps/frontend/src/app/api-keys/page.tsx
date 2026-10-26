"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MOCK_API_KEYS } from "@/constants/mockData";
import { ApiKeyRecord } from "@/types";
import {
  Key,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  Terminal,
  ShieldCheck,
  FileCode,
  AlertTriangle,
} from "lucide-react";

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(MOCK_API_KEYS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<ApiKeyRecord["environment"]>("PRODUCTION");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawToken = `aegis_${newKeyEnv.toLowerCase() === "production" ? "live" : "test"}_${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const newKey: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyPrefix: newKeyEnv === "PRODUCTION" ? "aegis_live_" : "aegis_test_",
      fullKeyPreview: rawToken,
      environment: newKeyEnv,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsedAt: "Chưa sử dụng",
      createdBy: "Phùng Chí Công",
    };

    setApiKeys([newKey, ...apiKeys]);
    setGeneratedKey(rawToken);
    setNewKeyName("");
    showToast("Đã khởi tạo thành công API Key mới!");
  };

  const handleDeleteKey = (id: string, name: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast(`Đã thu hồi (Revoke) khóa API: ${name}`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast("Đã sao chép khóa API vào bộ nhớ tạm!");
  };

  const githubActionSnippet = `name: AegisOps Autonomous Security Gate

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger AegisOps Autonomous Scan
        env:
          AEGISOPS_API_KEY: \${{ secrets.AEGISOPS_API_KEY }}
          TARGET_URL: "https://api.fintech-hubt.edu.vn"
        run: |
          echo "[*] Gửi yêu cầu quét an ninh tự hành lên AegisOps SaaS..."
          RESPONSE=$(curl -s -X POST "https://api.aegisops.io/v1/scans" \\
            -H "Authorization: Bearer $AEGISOPS_API_KEY" \\
            -H "Content-Type: application/json" \\
            -d "{\\"target_url\\": \\"$TARGET_URL\\", \\"fail_on\\": \\"CRITICAL\\"}")
          
          echo "$RESPONSE"
          SCORE=$(echo "$RESPONSE" | jq -r '.score')
          CRITICAL=$(echo "$RESPONSE" | jq -r '.critical_count')
          
          if [ "$CRITICAL" -gt 0 ]; then
            echo "[!] Phát hiện $CRITICAL lỗ hổng CRITICAL! Khóa cứng Pull Request."
            exit 1
          fi
          echo "[✓] Kiểm định an ninh vượt qua. Score: $SCORE/100."`;

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
              CI/CD API Keys & Automation Gate
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              DevSecOps Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tự động hóa kiểm định an ninh mạng trong pipeline GitHub Actions, GitLab CI và Bitbucket của khách hàng.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setGeneratedKey(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo API Key Mới</span>
          </button>
        </div>
      </div>

      {/* Active API Keys List */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl overflow-hidden shadow-card-dark">
        <div className="p-4 border-b border-crimson-muted flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-crimson-neon" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Khóa API Đang Hoạt Động ({apiKeys.length})
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Mã hóa SHA-256 an toàn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-crimson-muted">
              <tr>
                <th className="p-3.5">Tên Định Danh</th>
                <th className="p-3.5">Môi Trường</th>
                <th className="p-3.5">Khóa Bí Mật (Token Preview)</th>
                <th className="p-3.5">Ngày Tạo</th>
                <th className="p-3.5">Lần Dùng Gần Nhất</th>
                <th className="p-3.5 text-right">Thu Hồi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crimson-muted text-slate-300">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-sans">
                    Chưa có API Key nào được tạo. Nhấn &quot;Tạo API Key Mới&quot; ở trên để tích hợp vào CI/CD pipeline.
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-obsidian-850/60 transition">
                  <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{key.name}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      key.environment === "PRODUCTION"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-blue-950 text-blue-400 border border-blue-800"
                    }`}>
                      {key.environment}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">
                        {key.keyPrefix}••••••••••••••••••••••••••••••••
                      </span>
                      <button
                        onClick={() => handleCopyText(key.fullKeyPreview)}
                        className="text-slate-500 hover:text-white"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400">{key.createdAt}</td>
                  <td className="p-3.5 text-slate-400">{key.lastUsedAt}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteKey(key.id, key.name)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition cursor-pointer rounded-lg hover:bg-obsidian-850"
                      title="Thu hồi khóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CI/CD Integration Guide & Workflow Snippet */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Mẫu Cấu Hình GitHub Actions Pipeline (.github/workflows/aegisops.yml)
            </span>
          </div>
          <button
            onClick={() => handleCopyText(githubActionSnippet)}
            className="px-3 py-1 bg-obsidian-950 hover:bg-obsidian-850 border border-crimson-muted text-slate-300 hover:text-white rounded-lg text-xs font-mono transition flex items-center space-x-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>Sao Chép Workflow</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Thêm khóa bí mật vào <strong className="text-slate-200">GitHub Repository Secrets (Settings → Secrets and variables → Actions)</strong> với tên <code className="text-crimson-neon font-mono">AEGISOPS_API_KEY</code>. Pipeline này sẽ tự động chặn mọi Pull Request có chứa lỗ hổng Critical!
        </p>

        <pre className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
          {githubActionSnippet}
        </pre>
      </div>

      {/* Modal: Tạo API Key Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-lg shadow-neon-red overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-950">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-crimson-neon" />
                <span className="font-bold text-sm text-white">Khởi Tạo API Key Mới</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {generatedKey ? (
              <div className="p-5 space-y-4 text-xs">
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 space-y-1">
                  <div className="flex items-center space-x-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>LƯU Ý BẢO MẬT QUAN TRỌNG:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Khóa API này chỉ hiển thị <strong>DUY NHẤT 1 LẦN NÀY</strong>. Hãy sao chép và lưu trữ an toàn vào trình quản lý bí mật (Secrets Manager) của bạn ngay bây giờ.
                  </p>
                </div>

                <div className="space-y-1.5 font-mono">
                  <span className="text-slate-400 text-[10px] uppercase">Mã Khóa API Mới:</span>
                  <div className="bg-obsidian-950 p-3 rounded-xl border border-crimson-muted flex items-center justify-between">
                    <span className="text-emerald-400 font-bold select-all break-all pr-2">
                      {generatedKey}
                    </span>
                    <button
                      onClick={() => handleCopyText(generatedKey)}
                      className="px-3 py-1.5 bg-crimson hover:bg-red-600 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey ? "Đã chép!" : "Sao chép"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2 bg-obsidian-850 hover:bg-obsidian-800 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Tôi Đã Lưu Khóa An Toàn
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Tên định danh khóa API</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: GitHub Actions Main Branch Gate"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Môi trường sử dụng</label>
                  <select
                    value={newKeyEnv}
                    onChange={(e) => setNewKeyEnv(e.target.value as any)}
                    className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                  >
                    <option value="PRODUCTION">PRODUCTION (aegis_live_...)</option>
                    <option value="STAGING">STAGING (aegis_test_...)</option>
                    <option value="DEVELOPMENT">DEVELOPMENT (aegis_dev_...)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 rounded-xl transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold rounded-xl shadow-neon-red-sm transition cursor-pointer"
                  >
                    Tạo Khóa API
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
