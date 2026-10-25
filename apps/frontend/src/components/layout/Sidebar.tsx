"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Bot,
  Radar,
  Server,
  Settings,
  Globe,
  Users,
  CreditCard,
  Key,
  ChevronDown,
  Building2,
  Check,
  Plus,
  Sparkles,
  LogOut,
} from "lucide-react";
import { MOCK_WORKSPACES } from "@/constants/mockData";

export function Sidebar() {
  const pathname = usePathname();
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [selectedWorkspace, setSelectedWorkspace] = useState(MOCK_WORKSPACES[0]);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const isCurrentActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const navSections = [
    {
      title: "TÁC CHIẾN BẢO MẬT",
      items: [
        {
          href: "/",
          label: "Live Dashboard",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          href: "/vulnerabilities",
          label: "Vulnerabilities",
          icon: ShieldAlert,
          badge: "2 Crit",
        },
        {
          href: "/agents",
          label: "AI Agent Fleet",
          icon: Bot,
          badge: "4 Active",
        },
        {
          href: "/owasp",
          label: "OWASP Matrix",
          icon: Radar,
          badge: "78%",
        },
      ],
    },
    {
      title: "DOANH NGHIỆP & CI/CD",
      items: [
        {
          href: "/domains",
          label: "Tên Miền & Xác Thực",
          icon: Globe,
          badge: "3",
        },
        {
          href: "/team",
          label: "Đội Ngũ & Phân Quyền",
          icon: Users,
          badge: null,
        },
        {
          href: "/api-keys",
          label: "CI/CD API Keys",
          icon: Key,
          badge: null,
        },
        {
          href: "/billing",
          label: "Gói Cước & Hóa Đơn",
          icon: CreditCard,
          badge: "PRO",
        },
      ],
    },
    {
      title: "HỆ THỐNG",
      items: [
        {
          href: "/infrastructure",
          label: "Hạ Tầng K3s Nodes",
          icon: Server,
          badge: null,
        },
        {
          href: "/settings",
          label: "Cấu Hình & Rules",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-obsidian-900 border-r border-crimson-muted flex flex-col justify-between shrink-0 transition-all duration-300 select-none z-30">
      <div className="p-4 overflow-y-auto">
        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center space-x-3 px-2 py-3 border-b border-crimson-muted group"
        >
          <div className="p-2.5 bg-crimson/15 rounded-xl border border-crimson/50 shadow-neon-red-sm flex items-center justify-center group-hover:scale-105 transition">
            <ShieldAlert className="w-6 h-6 text-crimson-neon" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">
                AEGIS
              </span>
              <span className="font-extrabold text-lg text-crimson-neon">
                OPS
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              B2B DevSecOps SaaS
            </p>
          </div>
        </Link>

        {/* Multi-Tenancy Organization Workspace Switcher Dropdown */}
        <div className="mt-4 px-1 relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Workspace Tổ Chức
            </label>
            <span className="text-[9px] font-mono text-crimson-neon font-bold uppercase">
              {selectedWorkspace.plan} PLAN
            </span>
          </div>

          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-obsidian-950 border border-crimson-muted hover:border-crimson/50 rounded-xl text-xs cursor-pointer transition text-left"
          >
            <div className="flex items-center space-x-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-crimson-neon shrink-0" />
              <span className="font-semibold text-slate-200 truncate">
                {selectedWorkspace.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Workspace Switcher Menu Popup */}
          {isWorkspaceDropdownOpen && (
            <div className="absolute left-1 right-1 mt-1 bg-obsidian-900 border border-crimson rounded-xl shadow-neon-red p-1 z-50 text-xs">
              <div className="px-2 py-1.5 text-[10px] font-mono text-slate-500 uppercase border-b border-crimson-muted">
                Chuyển Đổi Workspace
              </div>
              <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-obsidian-850 text-slate-300 hover:text-white transition cursor-pointer text-left"
                  >
                    <div className="truncate">
                      <p className="font-semibold truncate">{ws.name}</p>
                      <p className="text-[9px] font-mono text-slate-500">
                        {ws.plan} • {ws.scansUsed}/{ws.scansLimit} lượt quét
                      </p>
                    </div>
                    {ws.id === selectedWorkspace.id && (
                      <Check className="w-3.5 h-3.5 text-crimson-neon shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <Link
                href="/billing"
                onClick={() => setIsWorkspaceDropdownOpen(false)}
                className="w-full flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border-t border-crimson-muted text-crimson-neon hover:bg-crimson/10 text-[11px] font-semibold transition"
              >
                <Plus className="w-3 h-3" />
                <span>Nâng cấp hoặc Tạo mới</span>
              </Link>
            </div>
          )}

          {/* Quota bar */}
          <div className="mt-2 px-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Lượt quét tháng này</span>
              <span className="text-slate-300 font-bold">
                {selectedWorkspace.scansUsed} / {selectedWorkspace.scansLimit}
              </span>
            </div>
            <div className="w-full bg-obsidian-950 h-1 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-crimson h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (selectedWorkspace.scansUsed / selectedWorkspace.scansLimit) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Grouped Navigation */}
        <nav className="mt-5 space-y-4 px-1">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isCurrentActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs tracking-wide transition ${
                      active
                        ? "bg-crimson/10 text-crimson-neon border border-crimson/40 font-semibold shadow-neon-red-sm"
                        : "text-slate-400 hover:text-white hover:bg-obsidian-850 font-medium"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono bg-red-950 text-red-400 border border-red-800 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Commercial User & Billing Profile Card */}
      <div className="p-4 border-t border-crimson-muted bg-obsidian-950/60">
        <div className="flex items-center justify-between">
          <Link
            href="/billing"
            className="flex items-center space-x-2.5 truncate flex-1 hover:opacity-80 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-crimson/20 border border-crimson flex items-center justify-center font-bold text-xs text-crimson-neon shrink-0">
              CP
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-semibold text-white truncate">
                  Phùng Chí Công
                </p>
                <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-crimson text-white">
                  OWNER
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                chiscong.hubt@gmail.com
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            title="Đăng xuất / Chuyển tài khoản"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-obsidian-850 transition"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
