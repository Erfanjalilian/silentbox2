"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_USER_STORAGE_KEY = "authUser";

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { user: AuthUser | null };
  return data.user ?? null;
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserAndStore = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    writeStoredUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await fetchMe();
    setUserAndStore(u);
    return u;
  }, [setUserAndStore]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    void (async () => {
      const storedUser = readStoredUser();
      if (storedUser && !cancelled) {
        setUser(storedUser);
      }

      const u = await fetchMe();
      if (!cancelled) {
        setUserAndStore(u);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUserAndStore]);

  const login = useCallback(() => {
    router.push("/login");
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    setUserAndStore(null);
    router.push("/");
  }, [router, setUserAndStore]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
