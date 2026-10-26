"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession, openAuthModal } = useAuth();

  const token = searchParams.get("token");
  const [status, setStatus] = useState<"VERIFYING" | "SUCCESS" | "ERROR">("VERIFYING");
  const [message, setMessage] = useState<string>("Đang kiểm tra chữ ký mật mã và kích hoạt tài khoản...");

  useEffect(() => {
    if (!token) {
      setStatus("ERROR");
      setMessage("Không tìm thấy mã token xác thực trong liên kết. Vui lòng kiểm tra lại email.");
      return;
    }

    api.verifyEmail(token)
      .then((res) => {
        setStatus("SUCCESS");
        setMessage(res.message || "Xác thực email thành công!");
        if (res.access_token && res.user) {
          setSession(res.access_token, res.user);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      })
      .catch((err) => {
        setStatus("ERROR");
        setMessage(err.message || "Liên kết xác thực không hợp lệ hoặc đã hết hạn.");
      });
  }, [token, router, setSession]);

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-md shadow-neon-red p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-neon-red-sm border transition">
          {status === "VERIFYING" ? (
            <div className="w-16 h-16 bg-crimson/15 border border-crimson/50 rounded-2xl flex items-center justify-center text-crimson-neon">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          ) : status === "SUCCESS" ? (
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-950/80 border border-red-800 rounded-2xl flex items-center justify-center text-red-400">
              <XCircle className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">
            {status === "VERIFYING"
              ? "Đang Xác Thực Quyền Sở Hữu Email"
              : status === "SUCCESS"
              ? "Kích Hoạt Tài Khoản Thành Công!"
              : "Xác Thực Email Thất Bại"}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {status === "SUCCESS" && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đang chuyển hướng bạn tới Live Dashboard an toàn...</span>
          </div>
        )}

        {status === "ERROR" && (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("yêu cầu gửi lại email hoặc đăng nhập")}
              className="w-full py-2.5 bg-crimson hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-neon-red flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Mở Hộp Thoại Đăng Nhập / Đăng Ký Lại</span>
            </button>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition inline-block"
            >
              Về Trang Chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-white text-xs">
          Đang tải thông tin xác thực...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
