"use client";

import React, { useState } from "react";
import { FileCode, X, Copy, Check } from "lucide-react";

interface PatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patchCode: string;
}

export function PatchModal({ isOpen, onClose, patchCode }: PatchModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(patchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-crimson rounded-2xl w-full max-w-2xl shadow-neon-red overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-crimson-muted flex items-center justify-between bg-obsidian-850">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-crimson-neon" />
            <span className="font-bold text-sm text-white">
              Mã Nguồn Vá Lỗi Tự Động (Drop-in Nginx Patch)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300">
            Chèn trực tiếp đoạn mã sau vào file cấu hình{" "}
            <code className="text-crimson-neon font-mono">
              /etc/nginx/conf.d/security.conf
            </code>
            :
          </p>

          <pre className="bg-obsidian-950 p-4 rounded-xl border border-crimson-muted font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {patchCode}
          </pre>

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-xs text-emerald-400 font-semibold transition ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              [✓] Đã sao chép vào bộ nhớ tạm!
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-crimson hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-neon-red-sm flex items-center space-x-2 transition cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Đã Sao Chép!" : "Sao Chép Mã Vá Lỗi"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
