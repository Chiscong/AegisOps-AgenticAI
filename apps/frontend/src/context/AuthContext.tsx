"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization_id?: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (intendedActionDescription?: string) => void;
  closeAuthModal: () => void;
  intendedAction: string | null;
  requireAuth: (action?: () => void, actionDescription?: string) => boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (fullName: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  setSession: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [intendedAction, setIntendedAction] = useState<string | null>(null);

  useEffect(() => {
    // Khôi phục phiên làm việc từ localStorage nếu có token
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("aegis_access_token");
      const savedUser = localStorage.getItem("aegis_user");

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          api.setToken(savedToken);
        } catch {
          localStorage.removeItem("aegis_access_token");
          localStorage.removeItem("aegis_user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (actionDesc?: string) => {
    if (actionDesc) {
      setIntendedAction(actionDesc);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setIntendedAction(null);
  };

  /**
   * Cổng chặn an ninh (Auth Gate):
   * Bất kỳ khi nào người dùng chưa đăng nhập nhấp vào dùng tính năng,
   * hàm này sẽ chặn lại, bung Pop-up bắt buộc đăng nhập và trả về false.
   */
  const requireAuth = (action?: () => void, actionDescription?: string): boolean => {
    if (user && token) {
      if (action) action();
      return true;
    }

    openAuthModal(actionDescription || "sử dụng tính năng này");
    return false;
  };

  const setSession = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    api.setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("aegis_access_token", newToken);
      localStorage.setItem("aegis_user", JSON.stringify(newUser));
    }
    closeAuthModal();
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res && res.access_token) {
      setSession(res.access_token, res.user);
    }
    return res;
  };

  const register = async (fullName: string, email: string, password: string) => {
    return await api.register(fullName, email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    api.clearToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("aegis_access_token");
      localStorage.removeItem("aegis_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        intendedAction,
        requireAuth,
        login,
        register,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
