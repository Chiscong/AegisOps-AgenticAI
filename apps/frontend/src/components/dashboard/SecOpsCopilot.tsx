"use client";

import React, { useState } from "react";
import { Bot, Send } from "lucide-react";
import { ChatMessage } from "@/types";

interface SecOpsCopilotProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function SecOpsCopilot({ messages, onSendMessage }: SecOpsCopilotProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="bg-obsidian-900 rounded-2xl border border-crimson-muted shadow-card-dark p-5 flex flex-col justify-between h-[360px]">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-crimson-muted">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-crimson/20 rounded-lg border border-crimson/40">
              <Bot className="w-4 h-4 text-crimson-neon" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">SecOps Copilot</h3>
              <p className="text-[10px] text-slate-400">
                AI Tư Vấn Bảo Mật Trực Tiếp
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
        </div>

        {/* Message Stream */}
        <div className="mt-3 space-y-3 overflow-y-auto max-h-48 text-xs pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === "user"
                  ? "bg-crimson/20 border border-crimson/40 p-2.5 rounded-xl text-slate-200 text-right"
                  : "bg-obsidian-950 border border-crimson-muted p-2.5 rounded-xl text-slate-300"
              }
            >
              <p className="font-bold text-crimson-neon text-[10px] mb-0.5">
                {msg.sender === "user" ? "Bạn:" : "AegisOps Copilot:"}
              </p>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input & Quick Action Chips */}
      <div className="pt-3 border-t border-crimson-muted space-y-2">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 text-[10px]">
          <button
            onClick={() => handleQuickPrompt("Cách vá lỗi CORS trên Nginx?")}
            className="px-2.5 py-1 rounded bg-obsidian-950 border border-crimson-muted text-slate-400 hover:text-white hover:border-crimson/50 whitespace-nowrap transition cursor-pointer"
          >
            + Vá CORS Nginx
          </button>
          <button
            onClick={() => handleQuickPrompt("Sinh cấu hình CSP an toàn")}
            className="px-2.5 py-1 rounded bg-obsidian-950 border border-crimson-muted text-slate-400 hover:text-white hover:border-crimson/50 whitespace-nowrap transition cursor-pointer"
          >
            + Cấu hình CSP
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Đặt câu hỏi kỹ thuật cho Copilot..."
            className="w-full bg-obsidian-950 border border-crimson-muted focus:border-crimson-neon rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="absolute right-2.5 top-2 text-crimson-neon hover:text-white transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
