'use client';

/**
 * Ant Design 與 React Query Provider
 * 整合 ConfigProvider + QueryClientProvider + AuthProvider
 *
 * 包含 Token 自動刷新機制：
 * - 每 20 分鐘自動呼叫 /api/auth/refresh 延長 token 有效期
 * - refresh 失敗時自動登出並跳轉至登入頁
 */
import React, { useState, useEffect, useRef } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import theme from '@/styles/theme';

/** Token 自動 refresh 間隔（20 分鐘） */
const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

/** Token Refresh 管理器 */
function TokenRefreshManager({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, refreshToken, logout } = useAuth();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 僅對正式登入（非 Demo）使用者啟用 refresh
    if (!isLoggedIn || user?.isDemo) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 啟動定時 refresh
    timerRef.current = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        console.warn('[TokenRefresh] Token 刷新失敗，執行登出');
        await logout();
        window.location.href = '/login';
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoggedIn, user?.isDemo, refreshToken, logout]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,    // 5 分鐘
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <AuthProvider>
      <TokenRefreshManager>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme} locale={zhTW}>
            <AntdApp>{children}</AntdApp>
          </ConfigProvider>
        </QueryClientProvider>
      </TokenRefreshManager>
    </AuthProvider>
  );
}
