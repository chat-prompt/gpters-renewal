"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  username: string;
  role: "member" | "leader" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  /** 현재 로그인 유저가 해당 username의 소유자인지 확인 */
  isOwner: (username: string) => boolean;
  /** 데모용: 로그인/로그아웃 토글 */
  toggle: () => void;
}

const MOCK_USER: AuthUser = {
  name: "홍길동",
  username: "honggildong",
  role: "admin",
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  isOwner: () => false,
  toggle: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value: AuthContextValue = {
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === "admin",
    isOwner: (username: string) => user?.username === username,
    toggle: () => setUser((prev) => (prev ? null : MOCK_USER)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
