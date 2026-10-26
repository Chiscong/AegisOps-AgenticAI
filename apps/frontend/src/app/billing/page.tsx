"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { InvoiceRecord } from "@/types";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Shield,
  Download,
  Building2,
  Check,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<"STARTER" | "PRO" | "ENTERPRISE">("PRO");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    api.getBillingInfo()
      .then((data) => {
        if (data) {
          if (data.invoices) setInvoices(data.invoices);
          if (data.plan) setCurrentPlan(data.plan);
          if (data.billingCycle) setBillingCycle(data.billingCycle);
        }
      })
      .catch((err) => {
        console.warn("[Billing] Lỗi tải từ backend:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const plans = [
    {
      id: "STARTER",
      name: "Starter Community",
      price: "$0",
      description: "Dành cho nhà phát triển cá nhân và thử nghiệm bảo mật.",
      features: [
        "3 lượt quét an ninh / tháng",
        "1 Tên miền theo dõi",
        "Báo cáo tóm tắt trên web",
        "Mã vá lỗi Nginx cơ bản",
        "Hỗ trợ qua Community Discord",
      ],
      isPopular: false,
    },
    {
      id: "PRO",
      name: "Pro SecOps Fleet",
      price: billingCycle === "MONTHLY" ? "$49" : "$39",
      billingNote: billingCycle === "MONTHLY" ? "mỗi tháng" : "mỗi tháng (thanh toán năm)",
      description: "Dành cho Startup, Fintech và đội ngũ phát triển 5-20 kỹ sư.",
      features: [
        "50 lượt quét an ninh / tháng",
        "5 Tên miền theo dõi 24/7",
        "Trọn bộ mã vá (Nginx, Express, FastAPI)",
        "Tự động tạo GitHub Pull Request (Auto-PR)",
        "2 API Keys tích hợp CI/CD Pipeline",
        "Xuất Báo Cáo PDF & JSON Kiểm Định",
        "Hỗ trợ kỹ thuật 24/7 (SLA 8 giờ)",
      ],
      isPopular: true,
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise Dedicated",
      price: billingCycle === "MONTHLY" ? "$299" : "$249",
      billingNote: billingCycle === "MONTHLY" ? "mỗi tháng" : "mỗi tháng (thanh toán năm)",
      description: "Dành cho ngân hàng, tập đoàn thương mại điện tử quy mô lớn.",
      features: [
        "Không giới hạn số lượt quét an ninh",
        "Không giới hạn số tên miền bảo vệ",
        "Mô hình LLM QLoRA Private On-Premise",
        "Không giới hạn thành viên + SSO / SAML",
        "Không giới hạn CI/CD API Keys",
        "Báo cáo tuân thủ có dấu số doanh nghiệp",
        "Chuyên gia DevSecOps kèm 1:1 (SLA 1 giờ)",
      ],
      isPopular: false,
    },
  ];

  const handleUpgrade = (planId: "STARTER" | "PRO" | "ENTERPRISE") => {
    setCurrentPlan(planId);
    showToast(`Đã chuyển đổi thành công sang gói cước ${planId}!`);
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
              Gói Cước & Quản Lý Thanh Toán Thương Mại
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-crimson/15 text-crimson-neon border border-crimson/40">
              Commercial Billing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Minh bạch chi phí, nâng cấp hạn ngạch quét bảo mật và quản lý hóa đơn VAT doanh nghiệp.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center space-x-1 bg-obsidian-900 p-1 rounded-xl border border-crimson-muted text-xs font-semibold">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              billingCycle === "MONTHLY"
                ? "bg-crimson text-white shadow-neon-red-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Thanh Toán Hàng Tháng
          </button>
          <button
            onClick={() => setBillingCycle("YEARLY")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
              billingCycle === "YEARLY"
                ? "bg-crimson text-white shadow-neon-red-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Thanh Toán Năm</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-black font-extrabold">
              TIẾT KIỆM 20%
            </span>
          </button>
        </div>
      </div>

      {/* Current Quota Consumption Card */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-crimson-muted pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-crimson/15 rounded-xl border border-crimson/50 text-crimson-neon">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">
                  Gói Cước Đang Sử Dụng: <span className="text-crimson-neon font-mono">PRO SECOPS FLEET</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Đang Kích Hoạt
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kỳ hạn tiếp theo tự động gia hạn vào ngày <strong>01/11/2026</strong> ($49.00 USD).
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast("Đã gửi yêu cầu hóa đơn VAT về email công ty.")}
            className="px-3.5 py-1.5 bg-obsidian-850 hover:bg-obsidian-800 border border-crimson-muted text-slate-200 text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Phương Thức Thanh Toán (Thẻ •••• 4242)</span>
          </button>
        </div>

        {/* 3 Quota Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Meter 1 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Số Lượt Quét Đã Dùng</span>
              <span className="text-white font-bold">18 / 50</span>
            </div>
            <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
              <div className="bg-crimson h-full rounded-full" style={{ width: "36%" }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Còn 32 lượt quét trong chu kỳ</span>
          </div>

          {/* Meter 2 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Tên Miền Giám Sát</span>
              <span className="text-white font-bold">3 / 5 Domains</span>
            </div>
            <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "60%" }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Còn 2 vị trí tên miền khả dụng</span>
          </div>

          {/* Meter 3 */}
          <div className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">AI Remediation Tokens</span>
              <span className="text-white font-bold">182.4K / 500K</span>
            </div>
            <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "36.4%" }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Tiết kiệm 85.4% nhờ AST Slicing</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.id;

          return (
            <div
              key={p.id}
              className={`bg-obsidian-900 rounded-2xl p-6 shadow-card-dark flex flex-col justify-between transition relative ${
                p.isPopular
                  ? "border-2 border-crimson shadow-neon-red"
                  : "border border-crimson-muted hover:border-crimson/50"
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-crimson text-white text-[10px] font-bold font-mono tracking-wider uppercase shadow-neon-red-sm">
                  KHUYÊN DÙNG CHO STARTUP
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.description}</p>
                </div>

                <div className="flex items-baseline space-x-1 border-b border-crimson-muted pb-4">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{p.price}</span>
                  <span className="text-xs text-slate-500 font-mono">
                    USD {p.billingNote ? `/ ${p.billingNote}` : ""}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  onClick={() => handleUpgrade(p.id as any)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-2 ${
                    isCurrent
                      ? "bg-obsidian-950 border border-crimson-muted text-slate-400 cursor-default"
                      : p.isPopular
                      ? "bg-gradient-to-r from-red-600 via-crimson to-rose-600 text-white shadow-neon-red hover:opacity-90 active:scale-95"
                      : "bg-obsidian-850 hover:bg-obsidian-800 text-white border border-crimson-muted"
                  }`}
                >
                  {isCurrent ? (
                    <span>Gói Đang Sử Dụng</span>
                  ) : (
                    <span>Nâng Cấp Ngay</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices History Table */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl overflow-hidden shadow-card-dark">
        <div className="p-4 border-b border-crimson-muted flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-crimson-neon" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Lịch Sử Giao Dịch & Hóa Đơn VAT Doanh Nghiệp
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Tự động xuất biên lai điện tử
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-crimson-muted">
              <tr>
                <th className="p-3.5">Mã Hóa Đơn</th>
                <th className="p-3.5">Kỳ Thanh Toán</th>
                <th className="p-3.5">Số Tiền</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Ngày Lập</th>
                <th className="p-3.5 text-right">Tải Biên Lai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crimson-muted text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-obsidian-850/60 transition">
                  <td className="p-3.5 font-bold text-white">{inv.invoiceNumber}</td>
                  <td className="p-3.5 text-slate-300">{inv.planName}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{inv.amount}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{inv.date}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => showToast(`Đang tải hóa đơn ${inv.invoiceNumber}.pdf...`)}
                      className="px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-800 border border-crimson-muted text-slate-300 hover:text-white transition inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
