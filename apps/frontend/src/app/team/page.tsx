"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { TeamMember } from "@/types";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Trash2,
  Clock,
  KeyRound,
  Loader2,
} from "lucide-react";

export default function TeamPage() {
  const { requireAuth } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("DEVELOPER");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getTeamMembers()
      .then((data) => setMembers(data || []))
      .catch((err) => {
        console.warn("[Team] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const newMember = await api.inviteTeamMember(inviteEmail.trim(), inviteRole);
      setMembers([...members, newMember]);
      setInviteEmail("");
      setIsInviteModalOpen(false);
      showToast(`Đã gửi email mời ${inviteEmail} tham gia tổ chức với vai trò ${inviteRole}!`);
    } catch (err: any) {
      showToast(`Lỗi mời thành viên: ${err.message}`);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    try {
      await api.removeTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast(`Đã xóa thành viên ${name} khỏi tổ chức.`);
    } catch (err: any) {
      showToast(`Lỗi xóa: ${err.message}`);
    }
  };

  const handleRoleChange = async (id: string, newRole: TeamMember["role"]) => {
    try {
      await api.updateMemberRole(id, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
      );
      showToast(`Đã cập nhật vai trò thành công.`);
    } catch (err: any) {
      showToast(`Lỗi cập nhật vai trò: ${err.message}`);
    }
  };

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "OWNER":
        return "bg-red-950 text-red-400 border-red-800 shadow-neon-red-sm";
      case "SECURITY_ADMIN":
        return "bg-amber-950 text-amber-400 border-amber-800";
      case "DEVELOPER":
        return "bg-blue-950 text-blue-400 border-blue-800";
      case "AUDITOR":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
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
              Quản Lý Đội Ngũ & Phân Quyền (Team RBAC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              Role-Based Access Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thiết lập quyền hạn chi tiết giữa Security Lead, Developer và Đơn vị Kiểm toán bên ngoài.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => requireAuth(() => setIsInviteModalOpen(true), "mời thành viên vào tổ chức")}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center space-x-2 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Mời Thành Viên</span>
          </button>
        </div>
      </div>

      {/* Team Members Table Card */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl overflow-hidden shadow-card-dark">
        <div className="p-4 border-b border-crimson-muted flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-crimson-neon" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Danh Sách Thành Viên Tổ Chức ({members.length})
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Hỗ trợ xác thực 2 lớp (2FA) & SAML SSO
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-crimson-muted">
              <tr>
                <th className="p-3.5">Thành Viên</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Vai Trò (Role)</th>
                <th className="p-3.5">Bảo Mật 2FA</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Hoạt Động Gần Nhất</th>
                <th className="p-3.5 text-right">Tác Vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crimson-muted text-slate-300">
              {members.map((mem) => (
                <tr key={mem.id} className="hover:bg-obsidian-850/60 transition">
                  <td className="p-3.5 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-crimson/20 border border-crimson flex items-center justify-center font-bold text-xs text-crimson-neon shrink-0">
                      {mem.avatar}
                    </div>
                    <span className="font-bold text-white truncate">{mem.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-400">{mem.email}</td>
                  <td className="p-3.5">
                    {mem.role === "OWNER" ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${getRoleBadge(mem.role)}`}>
                        {mem.role}
                      </span>
                    ) : (
                      <select
                        value={mem.role}
                        onChange={(e) => handleRoleChange(mem.id, e.target.value as any)}
                        className="bg-obsidian-950 border border-crimson-muted text-[10px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-crimson-neon font-mono"
                      >
                        <option value="SECURITY_ADMIN">SECURITY_ADMIN</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="AUDITOR">AUDITOR</option>
                      </select>
                    )}
                  </td>
                  <td className="p-3.5">
                    {mem.twoFactorEnabled ? (
                      <span className="text-emerald-400 flex items-center space-x-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Bật (TOTP)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Chưa bật</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      mem.status === "ACTIVE"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}>
                      {mem.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{mem.lastActive}</td>
                  <td className="p-3.5 text-right">
                    {mem.role !== "OWNER" && (
                      <button
                        onClick={() => handleRemoveMember(mem.id, mem.name)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition cursor-pointer rounded-lg hover:bg-obsidian-850"
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Reference Guide */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-crimson-neon" />
          <span>Bảng Đối Chiếu Quyền Hạn (RBAC Matrix)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-obsidian-950 p-3 rounded-xl border border-crimson-muted">
            <span className="text-red-400 font-bold block mb-1">OWNER</span>
            <p className="text-slate-400 text-[11px]">Toàn quyền quản trị workspace, cấu hình thanh toán, quản lý hóa đơn và giải tán tổ chức.</p>
          </div>
          <div className="bg-obsidian-950 p-3 rounded-xl border border-crimson-muted">
            <span className="text-amber-400 font-bold block mb-1">SECURITY_ADMIN</span>
            <p className="text-slate-400 text-[11px]">Quản lý danh sách tên miền mục tiêu, cấu hình SSRF whitelist, phê duyệt bản vá và tạo API Keys.</p>
          </div>
          <div className="bg-obsidian-950 p-3 rounded-xl border border-crimson-muted">
            <span className="text-blue-400 font-bold block mb-1">DEVELOPER</span>
            <p className="text-slate-400 text-[11px]">Kích hoạt quét theo yêu cầu, xem chi tiết lỗ hổng, sao chép mã vá và tự động tạo Pull Request.</p>
          </div>
          <div className="bg-obsidian-950 p-3 rounded-xl border border-crimson-muted">
            <span className="text-emerald-400 font-bold block mb-1">AUDITOR</span>
            <p className="text-slate-400 text-[11px]">Chỉ xem báo cáo bảo mật, theo dõi ma trận tuân thủ OWASP Top 10 và xuất chứng chỉ PDF.</p>
          </div>
        </div>
      </div>

      {/* Modal: Mời Thành Viên Mới */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-md shadow-neon-red overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-950">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-crimson-neon" />
                <span className="font-bold text-sm text-white">Mời Thành Viên Mới Vào Tổ Chức</span>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email công việc</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Vai trò cấp phép</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-obsidian-950 border border-crimson-muted text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-crimson-neon font-mono"
                >
                  <option value="SECURITY_ADMIN">SECURITY_ADMIN (Quản trị viên An ninh)</option>
                  <option value="DEVELOPER">DEVELOPER (Lập trình viên)</option>
                  <option value="AUDITOR">AUDITOR (Chuyên viên Kiểm toán - Chỉ đọc)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold rounded-xl shadow-neon-red-sm transition cursor-pointer"
                >
                  Gửi Lời Mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
