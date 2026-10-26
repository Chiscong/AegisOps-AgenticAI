"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  ShieldAlert,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, intendedAction, login, register } = useAuth();
  const [mode, setMode] = useState<"LOGIN" | "REGISTER" | "VERIFICATION_SENT">("LOGIN");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    email: string;
    verificationLink?: string;
  } | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
  };

  const handleSwitchMode = (newMode: "LOGIN" | "REGISTER") => {
    resetForm();
    setMode(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      resetForm();
      closeAuthModal();
    } catch (err: any) {
      setErrorMessage(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có độ dài tối thiểu 8 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(fullName.trim(), email.trim(), password);
      setSuccessInfo({
        email: email.trim(),
        verificationLink: res?.verification_link,
      });
      setMode("VERIFICATION_SENT");
    } catch (err: any) {
      setErrorMessage(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!successInfo?.email) return;
    setLoading(true);
    try {
      const res = await api.resendVerification(successInfo.email);
      if (res?.verification_link) {
        setSuccessInfo((prev) =>
          prev ? { ...prev, verificationLink: res.verification_link } : null
        );
      }
      setErrorMessage(null);
      alert("Đã gửi lại email xác thực thành công. Vui lòng kiểm tra hộp thư!");
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể gửi lại email xác thực.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-md shadow-neon-red overflow-hidden relative">
        {/* Nút đóng */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-obsidian-800 transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Modal */}
        <div className="p-6 bg-obsidian-950 border-b border-crimson-muted text-center space-y-2">
          <div className="w-12 h-12 bg-crimson/15 border border-crimson/50 rounded-2xl mx-auto flex items-center justify-center text-crimson-neon shadow-neon-red-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-wide">
            {mode === "VERIFICATION_SENT"
              ? "Bắt Buộc Xác Thực Email"
              : mode === "REGISTER"
              ? "Đăng Ký Tài Khoản Bảo Mật"
              : "Yêu Cầu Đăng Nhập"}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === "VERIFICATION_SENT"
              ? "Vui lòng xác thực quyền sở hữu hòm thư để kích hoạt quyền truy cập hệ thống."
              : intendedAction
              ? `Bạn cần đăng nhập để ${intendedAction}. Nền tảng tuân thủ chính sách Zero-Trust.`
              : "Chính sách an ninh: Vui lòng đăng nhập để sử dụng toàn bộ tính năng kiểm định an ninh."}
          </p>
        </div>

        {/* Tab chuyển Đăng nhập / Đăng ký */}
        {mode !== "VERIFICATION_SENT" && (
          <div className="flex border-b border-crimson-muted bg-obsidian-950/60 text-xs font-semibold">
            <button
              onClick={() => handleSwitchMode("LOGIN")}
              className={`flex-1 py-3 text-center transition cursor-pointer ${
                mode === "LOGIN"
                  ? "text-crimson-neon border-b-2 border-crimson bg-crimson/10 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => handleSwitchMode("REGISTER")}
              className={`flex-1 py-3 text-center transition cursor-pointer ${
                mode === "REGISTER"
                  ? "text-crimson-neon border-b-2 border-crimson bg-crimson/10 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tạo Tài Khoản Mới
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Thông báo lỗi */}
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-start space-x-2 text-xs text-red-300 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CHẾ ĐỘ 1: XÁC THỰC EMAIL BẮT BUỘC (VERIFICATION_SENT) */}
          {mode === "VERIFICATION_SENT" ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-obsidian-950 border border-crimson-muted rounded-xl space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Đã Gửi Liên Kết Kích Hoạt
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hệ thống đã gửi liên kết xác thực an toàn tới địa chỉ email:{" "}
                  <strong className="text-crimson-neon font-mono">{successInfo?.email}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và nhấp vào liên kết để tự động đăng nhập.
                </p>
              </div>

              {/* Nút Sandbox kích hoạt nhanh cho môi trường dev */}
              {successInfo?.verificationLink && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-2 text-left">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                    [Sandbox Developer Preview] Kích Hoạt Tức Thì:
                  </span>
                  <a
                    href={successInfo.verificationLink}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition"
                  >
                    <span>Nhấp Để Xác Thực & Đăng Nhập Ngay</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-slate-400 hover:text-white transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Gửi lại email</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("LOGIN")}
                  className="text-crimson-neon hover:underline font-semibold cursor-pointer"
                >
                  Trở lại Đăng nhập
                </button>
              </div>
            </div>
          ) : mode === "LOGIN" ? (
            /* CHẾ ĐỘ 2: ĐĂNG NHẬP */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email tài khoản</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xác thực bảo mật...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Nhập Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CHẾ ĐỘ 3: ĐĂNG KÝ MỚI (BẮT BUỘC XÁC THỰC EMAIL) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email công việc</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Mật khẩu bảo mật (Tối thiểu 8 ký tự, gồm chữ hoa, số & ký tự đặc biệt)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=""
                    className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-obsidian-950 rounded-xl border border-crimson-muted text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chính Sách Bảo Mật Cấp Cao Nhất</span>
                </div>
                <p>
                  Sau khi đăng ký, hệ thống sẽ gửi một liên kết xác thực vào email của bạn. Bạn bắt buộc phải nhấp vào liên kết để kích hoạt tài khoản.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang khởi tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Ký & Nhận Email Xác Thực</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
