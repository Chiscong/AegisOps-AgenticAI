"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Google OAuth Login handler
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMsg("");

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = typeof window !== "undefined" 
      ? `${window.location.origin}/api/auth/callback/google`
      : "";

    if (clientId && clientId !== "your-google-client-id-here") {
      // Production Google OAuth 2.0 Endpoint
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`;
      window.location.href = googleAuthUrl;
    } else {
      // Demo / Development Mode Simulation
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "aegisops_user",
            JSON.stringify({
              email: "congpc.devsecops@gmail.com",
              name: "Phùng Chí Công",
              provider: "google",
              role: "LEAD_AUDITOR",
            })
          );
        }
        setIsLoading(false);
        router.push("/");
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (mode === "register") {
      if (!fullName) {
        setErrorMsg("Vui lòng nhập họ và tên.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Mật khẩu xác nhận không khớp.");
        return;
      }
      if (!agreeTerms) {
        setErrorMsg("Vui lòng đồng ý với điều khoản sử dụng.");
        return;
      }
    }

    setIsLoading(true);

    // Giả lập xác thực hoặc gọi API Gateway
    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aegisops_user",
          JSON.stringify({
            email,
            name: fullName || email.split("@")[0],
            role: "AUDITOR",
          })
        );
      }
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col lg:flex-row antialiased select-none font-sans">
      
      {/* ===================================================================== */}
      {/* LEFT BRANDING & TERMINAL SHOWCASE (ẨN TRÊN MOBILE, HIỆN TRÊN DESKTOP) */}
      {/* ===================================================================== */}
      <aside className="hidden lg:flex lg:w-1/2 bg-obsidian-900 border-r border-crimson-muted relative overflow-hidden flex-col justify-between p-12">
        {/* Ambient Glows */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-crimson/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="p-2.5 bg-crimson/15 rounded-xl border border-crimson/50 shadow-neon-red-sm flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-crimson-neon" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-2xl tracking-wider text-white">AEGIS</span>
              <span className="font-extrabold text-2xl text-crimson-neon">OPS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Agentic DevSecOps Platform
            </p>
          </div>
        </div>

        {/* Center Presentation: Headline & Terminal Simulation */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/30 text-crimson-neon text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-crimson-neon animate-pulse"></span>
              <span>AEGISOPS SECURITY INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Bảo vệ Ứng dụng Web bằng <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-crimson to-rose-400">
                AI Agent Tự Hành Đa Tác Nhân
              </span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tự động hóa toàn bộ chu trình đánh giá an ninh mạng: từ trinh sát thụ động, loại trừ cảnh báo rác OWASP đến tự động tạo Pull Request vá lỗi trong 12 giây.
            </p>
          </div>

          {/* Terminal Mockup Card */}
          <div className="bg-obsidian-950 rounded-2xl border border-crimson/40 shadow-card-dark p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-crimson-muted text-[11px] text-slate-500">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span>AI FLEET STREAMING</span>
            </div>
            <p className="text-slate-400">[*] [Recon] Bắt đầu kiểm toán Security Headers & CORS...</p>
            <p className="text-emerald-400">[✓] [SSRF Guard] Phân tích trước DNS: IP an toàn.</p>
            <p className="text-red-400 font-bold">[!] [Triage] Phát hiện: CORS Reflection with Credentials.</p>
            <p className="text-fuchsia-400">[*] [Advisory] Sinh mã Nginx Hardening Patch tự động...</p>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="relative z-10 pt-6 border-t border-crimson-muted flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust Architecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-crimson-neon" />
            <span>OWASP WSTG v4.2 Compliant</span>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* RIGHT FORM CONTAINER: ĐĂNG NHẬP / ĐĂNG KÝ + GOOGLE OAUTH              */}
      {/* ===================================================================== */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {mode === "login" ? "Chào mừng trở lại" : "Khởi tạo tài khoản"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === "login" 
                    ? "Đăng nhập để truy cập Bảng điều khiển AegisOps AI" 
                    : "Tham gia nền tảng bảo mật tự hành thế hệ mới"}
                </p>
              </div>

              {/* Toggle Mode Button */}
              <div className="flex bg-obsidian-900 p-1 rounded-xl border border-crimson-muted">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setErrorMsg(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    mode === "login"
                      ? "bg-crimson text-white shadow-neon-red-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setErrorMsg(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    mode === "register"
                      ? "bg-crimson text-white shadow-neon-red-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-400 flex items-center space-x-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. GOOGLE OAUTH BUTTON */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-obsidian-900 hover:bg-obsidian-850 border border-crimson-muted hover:border-crimson/50 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-3 transition shadow-card-dark cursor-pointer disabled:opacity-50"
            >
              {/* Google Official Multicolored SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Tiếp tục với tài khoản Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-crimson-muted w-full"></div>
              <span className="bg-obsidian-950 px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider relative">
                hoặc dùng email
              </span>
            </div>
          </div>

          {/* 2. EMAIL / PASSWORD FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: Full Name (Chỉ hiện khi Đăng ký) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Phùng Chí Công"
                    className="w-full bg-obsidian-900 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Field: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email công việc</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-obsidian-900 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
                {mode === "login" && (
                  <a href="#" className="text-[11px] text-crimson-neon hover:underline">
                    Quên mật khẩu?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-obsidian-900 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field: Confirm Password (Chỉ hiện khi Đăng ký) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-obsidian-900 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Checkbox: Đồng ý điều khoản (Chỉ hiện khi Đăng ký) */}
            {mode === "register" && (
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-crimson-muted text-crimson focus:ring-crimson bg-obsidian-900"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-crimson-neon hover:underline">Điều khoản dịch vụ</a> và{" "}
                  <a href="#" className="text-crimson-neon hover:underline">Chính sách bảo mật</a> của AegisOps.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 via-crimson to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{mode === "login" ? "Đăng Nhập Vào AegisOps" : "Khởi Tạo Tài Khoản"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back to Home */}
          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              ← Trở về Trang Dashboard Xem Thử
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}
