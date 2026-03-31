/**
 * 認證 Context — 管理使用者登入狀態與角色
 *
 * 正式模式：透過 AI GO Platform Auth（One-Time Code）認證
 * - cookie 由 API Route（/api/auth/callback）設定
 * - 前端從 aigo_user cookie 讀取使用者資訊
 * - 所有 AI GO 登入的使用者預設為 ADMIN 角色
 *
 * Demo 模式：僅在 development 環境下可用，用於本地開發測試
 */
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { Role } from './rbac';
import { ROLE_INFO } from './rbac';

/** 使用者資訊 */
export interface AuthUser {
  userId: string;
  empCd: string;
  empName: string;
  role: Role;
  compCd: string;
  deptCd: string;
  /** AI GO 使用者 ID */
  aigoId?: string;
  /** AI GO email */
  email?: string;
  /** 是否為 Demo 使用者 */
  isDemo?: boolean;
}

/** 預設 Mock 使用者（按角色）— 僅 Demo 模式使用 */
const MOCK_USERS: Record<Role, AuthUser> = {
  ADMIN:  { userId: 'U001', empCd: 'E001', empName: '系統管理員', role: 'ADMIN',  compCd: 'HQ', deptCd: 'IT', isDemo: true },
  SALES:  { userId: 'U002', empCd: 'E002', empName: '劉俊宏',     role: 'SALES',  compCd: 'HQ', deptCd: 'SALES', isDemo: true },
  OP:     { userId: 'U003', empCd: 'E003', empName: '陳怡君',     role: 'OP',     compCd: 'HQ', deptCd: 'OP', isDemo: true },
  TICKET: { userId: 'U004', empCd: 'E004', empName: '張雅婷',     role: 'TICKET', compCd: 'HQ', deptCd: 'TICKET', isDemo: true },
  VISA:   { userId: 'U005', empCd: 'E005', empName: '林志明',     role: 'VISA',   compCd: 'HQ', deptCd: 'VISA', isDemo: true },
  ACCT:   { userId: 'U006', empCd: 'E006', empName: '王建民',     role: 'ACCT',   compCd: 'HQ', deptCd: 'ACCT', isDemo: true },
};

/** Context 值 */
interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** 認證狀態載入中 */
  isLoading: boolean;
  /** 使用 AI GO 登入（跳轉） */
  loginWithAigo: () => Promise<void>;
  /** Demo 角色登入（僅開發環境） */
  loginDemo: (role: Role) => void;
  /** 登出 */
  logout: () => Promise<void>;
  /** 切換角色（ADMIN 專用） */
  switchRole: (role: Role) => void;
  /** 重新檢查認證狀態 */
  checkAuth: () => Promise<void>;
  /** 刷新 token */
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 從 cookie 字串解析特定 cookie 值
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * 從 aigo_user cookie 建構 AuthUser
 * 所有 AI GO 登入的使用者預設為 ADMIN 角色
 */
function buildUserFromCookie(): AuthUser | null {
  const raw = getCookie('aigo_user');
  if (!raw) return null;
  try {
    const aigoUser = JSON.parse(raw) as { id: string; email: string; name: string };
    return {
      userId: aigoUser.id,
      empCd: '',
      empName: aigoUser.name || aigoUser.email,
      role: 'ADMIN', // 所有 AI GO 使用者預設為 ADMIN
      compCd: 'HQ',
      deptCd: '',
      aigoId: aigoUser.id,
      email: aigoUser.email,
      isDemo: false,
    };
  } catch {
    return null;
  }
}

/** AuthProvider — 包裹在 layout 最外層 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：從 cookie 讀取使用者狀態
  useEffect(() => {
    const cookieUser = buildUserFromCookie();
    if (cookieUser) {
      setUser(cookieUser);
    }
    setIsLoading(false);
  }, []);

  /** 透過 API 驗證 session */
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            userId: data.user.id,
            empCd: '',
            empName: data.user.name || data.user.email,
            role: 'ADMIN',
            compCd: 'HQ',
            deptCd: '',
            aigoId: data.user.id,
            email: data.user.email,
            isDemo: false,
          });
          return;
        }
      }
      // 未認證
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  /** AI GO 登入 — 跳轉到 AI GO 平台 */
  const loginWithAigo = useCallback(async () => {
    const res = await fetch('/api/auth/login', { method: 'POST' });
    const data = await res.json();
    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      throw new Error('無法取得 AI GO 登入 URL');
    }
  }, []);

  /** Demo 角色登入（僅開發環境） */
  const loginDemo = useCallback((role: Role) => {
    setUser(MOCK_USERS[role]);
  }, []);

  /** 登出 */
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/me', { method: 'DELETE' });
    } catch {
      // 清除 cookie 失敗不影響前端登出
    }
    setUser(null);
  }, []);

  /** 切換角色（ADMIN 專用） */
  const switchRole = useCallback((role: Role) => {
    if (user) {
      if (user.isDemo) {
        // Demo 模式：完整切換
        setUser({ ...MOCK_USERS[role], empName: user.empName + ' (模擬:' + ROLE_INFO[role].label + ')' });
      } else {
        // 正式模式：僅切換角色標籤（權限視角）
        setUser({ ...user, role });
      }
    }
  }, [user]);

  /** 刷新 Token */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isLoggedIn: user !== null,
    isLoading,
    loginWithAigo,
    loginDemo,
    logout,
    switchRole,
    checkAuth,
    refreshToken,
  }), [user, isLoading, loginWithAigo, loginDemo, logout, switchRole, checkAuth, refreshToken]);

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
