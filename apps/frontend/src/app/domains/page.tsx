"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MonitoredDomain } from "@/types";
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Plus,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Play,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function DomainsPage() {
  const { requireAuth } = useAuth();
  const [domains, setDomains] = useState<MonitoredDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState("");
  const [selectedDomainForVerify, setSelectedDomainForVerify] = useState<MonitoredDomain | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getDomains()
      .then((data) => setDomains(data || []))
      .catch((err) => {
        console.warn("[Domains] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;

    const domainName = newDomainInput.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    try {
      const added = await api.addDomain(domainName);
      setDomains([added, ...domains]);
      setNewDomainInput("");
      setIsAddModalOpen(false);
      setSelectedDomainForVerify(added);
      showToast(`Đã thêm tên miền ${domainName}. Hãy thêm bản ghi DNS TXT để xác thực quyền sở hữu!`);
    } catch (err: any) {
      showToast(`Lỗi thêm tên miền: ${err.message}`);
    }
  };

  const handleVerifyDns = async (domain: MonitoredDomain) => {
    setVerifyingId(domain.id);
    showToast(`Đang truy vấn bản ghi DNS TXT của ${domain.domain}...`);

    try {
      await api.verifyDomain(domain.id);
      setDomains((prev) =>
        prev.map((d) =>
          d.id === domain.id
            ? {
                ...d,
                isVerified: true,
                status: "VERIFIED",
                securityScore: 82,
                lastScanAt: "Vừa xong",
              }
            : d
        )
      );
      if (selectedDomainForVerify?.id === domain.id) {
        setSelectedDomainForVerify(null);
      }
      showToast(`[✓] Xác thực thành công quyền sở hữu ${domain.domain}! Đã mở khóa quét tự động.`);
    } catch (err: any) {
      showToast(`Lỗi xác thực: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteDomain = async (id: string, domainName: string) => {
    try {
      await api.deleteDomain(id);
      setDomains((prev) => prev.filter((d) => d.id !== id));
      showToast(`Đã xóa tên miền ${domainName}`);
    } catch (err: any) {
      showToast(`Lỗi xóa: ${err.message}`);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    showToast("Đã sao chép token xác thực vào bộ nhớ tạm!");
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
              Quản Lý Tên Miền & Xác Thực Quyền Sở Hữu
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              Legal Compliance Guard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bảo vệ pháp lý bắt buộc: Khách hàng chỉ được phép quét an ninh các website đã chứng minh quyền sở hữu qua bản ghi DNS TXT.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => requireAuth(() => setIsAddModalOpen(true), "thêm tên miền mới")}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Tên Miền Mới</span>
          </button>
        </div>
      </div>

      {/* Legal & Security Explainer Box */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-4 shadow-card-dark flex items-start space-x-3.5">
        <div className="p-2.5 bg-amber-500/15 rounded-xl border border-amber-500/40 text-amber-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-slate-200">
            Quy Định An Ninh & Điều Khoản Sử Dụng Nền Tảng Thương Mại
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Để bảo vệ hệ thống của bạn và tuân thủ Điều 289 Bộ luật Hình sự về an toàn thông tin mạng, AegisOps yêu cầu xác thực quyền sở hữu tên miền trước khi kích hoạt tính năng quét lỗ hổng và giám sát 24/7. Tên miền chưa xác thực sẽ bị khóa chức năng quét tự động.
          </p>
        </div>
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {domains.length === 0 ? (
          <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-12 text-center">
            <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">
              Chưa có tên miền nào được giám sát
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Thêm tên miền của doanh nghiệp bạn và xác thực bản ghi DNS TXT để kích hoạt quét an ninh tự hành và bảo vệ pháp lý.
            </p>
            <button
              onClick={() => requireAuth(() => setIsAddModalOpen(true), "thêm tên miền mới")}
              className="mt-4 px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-neon-red-sm inline-flex items-center space-x-2 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Tên Miền Đầu Tiên</span>
            </button>
          </div>
        ) : (
          domains.map((dom) => (
          <div
            key={dom.id}
            className="bg-obsidian-900 border border-crimson-muted hover:border-crimson/50 rounded-2xl p-5 shadow-card-dark transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-obsidian-950 rounded-xl border border-crimson-muted text-crimson-neon">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white font-mono">
                      {dom.domain}
                    </h3>
                    {dom.isVerified ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đã Xác Thực</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Chờ Xác Thực DNS</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Thêm ngày: {dom.createdAt} • Lịch quét: {dom.autoScanSchedule}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {dom.isVerified && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">
                      Điểm An Ninh
                    </span>
                    <span className={`text-sm font-extrabold font-mono ${
                      dom.securityScore >= 80 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {dom.securityScore} / 100
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {dom.isVerified ? (
                    <Link
                      href="/"
                      className="px-3.5 py-1.5 bg-crimson hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-neon-red-sm flex items-center space-x-1.5 transition"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Quét Ngay</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setSelectedDomainForVerify(dom)}
                      className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <span>Xem Hướng Dẫn DNS</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteDomain(dom.id, dom.domain)}
                    className="p-2 text-slate-500 hover:text-red-400 transition cursor-pointer rounded-lg hover:bg-obsidian-850"
                    title="Xóa tên miền"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* If pending verification, show inline snippet */}
            {!dom.isVerified && (
              <div className="bg-obsidian-950 p-4 rounded-xl border border-amber-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
                  <span>CẤU HÌNH BẢN GHI DNS TXT ĐỂ MỞ KHÓA</span>
                  <button
                    onClick={() => handleVerifyDns(dom)}
                    disabled={verifyingId === dom.id}
                    className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[10px] hover:bg-amber-400 transition cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${verifyingId === dom.id ? "animate-spin" : ""}`} />
                    <span>{verifyingId === dom.id ? "Đang kiểm tra..." : "Kiểm Tra DNS Ngay"}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-obsidian-900 p-2 rounded border border-crimson-muted">
                    <span className="text-slate-500 block text-[9px]">TÊN BẢN GHI (HOST)</span>
                    <span className="text-slate-200 select-all">{dom.dnsTxtRecord}</span>
                  </div>
                  <div className="bg-obsidian-900 p-2 rounded border border-crimson-muted flex items-center justify-between">
                    <div className="truncate pr-2">
                      <span className="text-slate-500 block text-[9px]">GIÁ TRỊ (VALUE)</span>
                      <span className="text-emerald-400 select-all truncate block">{dom.verificationToken}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(dom.verificationToken)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Sao chép"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )))}
      </div>

      {/* Modal: Thêm Tên Miền Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-lg shadow-neon-red overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-950">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-crimson-neon" />
                <span className="font-bold text-sm text-white">Thêm Tên Miền Cần Bảo Vệ</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">
                  Tên miền máy chủ (Domain / FQDN)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: payment.company.com hoặc app.fintech.vn"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Chỉ nhập tên miền của tổ chức bạn sở hữu hoặc được ủy quyền kiểm định an ninh.
                </p>
              </div>

              <div className="p-3 bg-obsidian-950 rounded-xl border border-crimson-muted text-[11px] text-slate-400 space-y-1 leading-relaxed">
                <span className="font-bold text-amber-400 block">Quy trình sau khi thêm:</span>
                <p>1. Hệ thống tạo một chuỗi mã xác thực (Token) duy nhất.</p>
                <p>2. Bạn thêm bản ghi TXT tương ứng vào bảng quản lý DNS tên miền.</p>
                <p>3. Nhấn Xác thực để mở khóa toàn bộ tính năng quét AI tự hành.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold rounded-xl shadow-neon-red-sm transition cursor-pointer"
                >
                  Thêm & Tạo Token DNS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hướng Dẫn Xác Thực DNS */}
      {selectedDomainForVerify && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-xl shadow-neon-red overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-950">
              <span className="font-bold text-sm text-white">
                Xác Thực Quyền Sở Hữu: {selectedDomainForVerify.domain}
              </span>
              <button
                onClick={() => setSelectedDomainForVerify(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Đăng nhập vào nhà cung cấp DNS của bạn (Cloudflare, AWS Route53, GoDaddy, Nhân Hòa, v.v.) và thêm bản ghi sau:
              </p>

              <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted font-mono space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Loại bản ghi (Record Type)</span>
                  <span className="text-crimson-neon font-bold text-sm">TXT</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Tên / Host</span>
                  <span className="text-white select-all">{selectedDomainForVerify.dnsTxtRecord}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 uppercase">Giá trị (Value / Content)</span>
                    <button
                      onClick={() => handleCopyText(selectedDomainForVerify.verificationToken)}
                      className="text-crimson-neon hover:underline text-[10px] flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedToken ? "Đã chép!" : "Sao chép"}</span>
                    </button>
                  </div>
                  <span className="text-emerald-400 select-all block bg-obsidian-900 p-2 rounded border border-crimson-muted break-all">
                    {selectedDomainForVerify.verificationToken}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">TTL</span>
                  <span className="text-slate-300">Auto hoặc 300 giây</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  Lưu ý: DNS có thể mất 1-5 phút để lan truyền toàn cầu.
                </span>
                <button
                  onClick={() => handleVerifyDns(selectedDomainForVerify)}
                  disabled={verifyingId === selectedDomainForVerify.id}
                  className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold rounded-xl shadow-neon-red-sm flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${verifyingId === selectedDomainForVerify.id ? "animate-spin" : ""}`} />
                  <span>{verifyingId === selectedDomainForVerify.id ? "Đang xác thực..." : "Xác Thực Ngay"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
