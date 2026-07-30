"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  loginUser,
  registerUser as apiRegister,
  logoutUser,
  getCurrentUser,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });
  const router = useRouter();
  const pathname = usePathname();

  const clearSession = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_session_time");
    setState({ user: null, loading: false, authenticated: false });
  }, []);

  const refreshUser = useCallback(async () => {
    const sessionTimeStr = localStorage.getItem("auth_session_time");
    if (sessionTimeStr) {
      const elapsed = Date.now() - parseInt(sessionTimeStr, 10);
      if (elapsed > EIGHT_HOURS_MS) {
        console.warn("Session expired (> 8 hours). Logging out.");
        clearSession();
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace("/login");
        }
        return;
      }
    }

    try {
      const res = await getCurrentUser();
      if (res.success && res.data) {
        setState({ user: res.data, loading: false, authenticated: true });
      } else {
        clearSession();
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace("/login");
        }
      }
    } catch {
      clearSession();
      if (!PUBLIC_PATHS.includes(pathname)) {
        router.replace("/login");
      }
    }
  }, [clearSession, pathname, router]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setState({ user: null, loading: false, authenticated: false });
      if (!PUBLIC_PATHS.includes(pathname)) {
        router.replace("/login");
      }
      return;
    }
    refreshUser();
  }, [pathname, refreshUser, router]);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await loginUser(data);
    if (res.success && res.data) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("auth_session_time", Date.now().toString());
      await refreshUser();
    } else {
      throw new ApiError(res.message || "Login failed", 401);
    }
  }, [refreshUser]);

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await apiRegister(data);
    if (!res.success) {
      throw new ApiError(res.message || "Registration failed", 422);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // proceed even if backend fails
    }
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
