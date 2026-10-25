"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MOCK_K3S_NODES, MOCK_MICROSERVICES } from "@/constants/mockData";
import { K3sNode, MicroserviceStatus } from "@/types";
import {
  Server,
  Cpu,
  Layers,
  Activity,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Terminal,
  ArrowUpRight,
} from "lucide-react";

export default function InfrastructurePage() {
  const [nodes] = useState<K3sNode[]>(MOCK_K3S_NODES);
  const [services] = useState<MicroserviceStatus[]>(MOCK_MICROSERVICES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
              K3s Cluster & Microservices Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              3 Nodes Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kiến trúc Microservices tinh gọn & tối ưu chi phí cực hạn (&lt;$15/tháng) bảo vệ toàn diện với K8s NetworkPolicy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => showToast("Đã đồng bộ lại metrics hạ tầng K3s")}
            className="px-3.5 py-2 bg-obsidian-850 hover:bg-obsidian-800 border border-crimson-muted hover:border-crimson/50 text-slate-200 text-xs font-medium rounded-xl flex items-center space-x-2 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đồng Bộ Metrics</span>
          </button>
        </div>
      </div>

      {/* Cost Telemetry Card */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/15 rounded-2xl border border-emerald-500/40 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
                Chi Phí Vận Hành Cụm K3s
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  $14.20
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  / $15.00 giới hạn tháng
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Tiết Kiệm 88% vs AWS EKS
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between space-x-6">
              <span>Hạ tầng:</span>
              <strong className="text-slate-200">3x VPS Cloud (Hetzner / Spot)</strong>
            </div>
            <div className="flex justify-between space-x-6">
              <span>Mạng:</span>
              <strong className="text-slate-200">Flannel CNI + WireGuard Encrypted</strong>
            </div>
          </div>
        </div>
      </div>

      {/* K3s Nodes Status Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
          <Server className="w-4 h-4 text-crimson-neon" />
          <span>Danh Sách Máy Chủ Node (3 Nodes)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="bg-obsidian-900 border border-crimson-muted hover:border-crimson/50 rounded-2xl p-4 shadow-card-dark transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">
                    {node.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    IP: {node.ip} • Role: {node.role}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {node.status}
                </span>
              </div>

              {/* CPU Usage Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">CPU Usage</span>
                  <span className="text-white font-bold">{node.cpuUsage}%</span>
                </div>
                <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-crimson h-full rounded-full transition-all duration-500"
                    style={{ width: `${node.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              {/* RAM Usage Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">RAM Allocated</span>
                  <span className="text-slate-300">{node.ramAllocated}</span>
                </div>
                <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${node.ramUsage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-crimson-muted/50 flex justify-between text-[10px] font-mono text-slate-500">
                <span>Pods: {node.podsRunning} running</span>
                <span>Uptime: {node.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Microservices Fleet Table */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl overflow-hidden shadow-card-dark">
        <div className="p-4 border-b border-crimson-muted flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-crimson-neon" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Trạng Thái 5 Microservices Cốt Lõi
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Health Check: /healthz 200 OK
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian-950 text-slate-400 uppercase text-[10px] border-b border-crimson-muted">
              <tr>
                <th className="p-3.5">Service Name</th>
                <th className="p-3.5">Tech Stack</th>
                <th className="p-3.5">Replicas</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">CPU / RAM</th>
                <th className="p-3.5">Restarts</th>
                <th className="p-3.5">Internal Endpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crimson-muted text-slate-300">
              {services.map((svc) => (
                <tr key={svc.name} className="hover:bg-obsidian-850/60 transition">
                  <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{svc.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-400">{svc.language}</td>
                  <td className="p-3.5 text-slate-200">{svc.replicas}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {svc.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {svc.cpu} / {svc.memory}
                  </td>
                  <td className="p-3.5 text-slate-400">{svc.restarts}</td>
                  <td className="p-3.5 text-[11px] text-slate-500 truncate max-w-xs">
                    {svc.endpoint}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NetworkPolicy SSRF Shield Box */}
      <div className="bg-obsidian-900 border border-crimson-muted rounded-2xl p-5 shadow-card-dark space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              K8s NetworkPolicy: SSRF Zero-Trust Isolation
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            Policy: Active & Enforced
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Toàn bộ Pod thuộc <code className="text-crimson-neon font-mono">scanner-worker</code> được cô lập bằng Kubernetes Egress NetworkPolicy. Bất kỳ nỗ lực gửi yêu cầu đến dải IP Private (<code className="font-mono text-slate-400">10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</code>) hoặc AWS Metadata (<code className="font-mono text-rose-400">169.254.169.254</code>) đều bị kernel iptables chặn đứng tại tầng socket.
        </p>
      </div>
    </DashboardLayout>
  );
}
