/**
 * 認證 Context — 管理使用者登入狀態與角色
 * 目前為 Mock 模式，後端接上後替換為實際 JWT/Session 認證
 */
'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Role } from './rbac';
import { ROLE_INFO } from './rbac';

// === [API] POST /api/auth/login === DB: users, user_groups === TODO: [替換] 改為實際認證 ===

/** 使用者資訊 */
export interface AuthUser {
  userId: string;
  empCd: string;
  empName: string;
  role: Role;
  compCd: string;   // 分公司代碼
  deptCd: string;   // 部門代碼
}

/** 預設 Mock 使用者（按角色） */
const MOCK_USERS: Record<Role, AuthUser> = {
  ADMIN:  { userId: 'U001', empCd: 'E001', empName: '系統管理員', role: 'ADMIN',  compCd: 'HQ', deptCd: 'IT' },
  SALES:  { userId: 'U002', empCd: 'E002', empName: '劉俊宏',     role: 'SALES',  compCd: 'HQ', deptCd: 'SALES' },
  OP:     { userId: 'U003', empCd: 'E003', empName: '陳怡君',     role: 'OP',     compCd: 'HQ', deptCd: 'OP' },
  TICKET: { userId: 'U004', empCd: 'E004', empName: '張雅婷',     role: 'TICKET', compCd: 'HQ', deptCd: 'TICKET' },
  VISA:   { userId: 'U005', empCd: 'E005', empName: '林志明',     role: 'VISA',   compCd: 'HQ', deptCd: 'VISA' },
  ACCT:   { userId: 'U006', empCd: 'E006', empName: '王建民',     role: 'ACCT',   compCd: 'HQ', deptCd: 'ACCT' },
};

/** Context 值 */
interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** 登入（Mock：直接用角色登入） */
  login: (role: Role) => void;
  /** 登出 */
  logout: () => void;
  /** 切換角色（ADMIN 專用） */
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** AuthProvider — 包裹在 layout 最外層 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // === [API] GET /api/auth/me === TODO: [替換] 改為實際 session 檢查 ===
  // 預設以 ACCT (會計) 登入 — 與舊系統 LOUIS 帳號保持一致
  const [user, setUser] = useState<AuthUser | null>(MOCK_USERS.ACCT);

  const login = useCallback((role: Role) => {
    setUser(MOCK_USERS[role]);
    // === [API] POST /api/auth/login === TODO: [替換] ===
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // === [API] POST /api/auth/logout === TODO: [替換] ===
  }, []);

  const switchRole = useCallback((role: Role) => {
    if (user) {
      setUser({ ...MOCK_USERS[role], empName: user.empName + ' (模擬:' + ROLE_INFO[role].label + ')' });
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    isLoggedIn: user !== null,
    login,
    logout,
    switchRole,
  }), [user, login, logout, switchRole]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

/** 取得認證狀態的 Hook */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return ctx;
}
