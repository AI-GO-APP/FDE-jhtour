'use client';

/**
 * Ant Design 與 React Query Provider
 * 整合 ConfigProvider + QueryClientProvider
 */
import React, { useState } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '@/styles/theme';

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
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={zhTW}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
