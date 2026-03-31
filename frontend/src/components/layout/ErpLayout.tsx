'use client';

/**
 * ERP 總體 Layout
 * 替代舊系統的五框架 Frameset (top/left/center/msg/main)
 * 結構：左側 Sidebar + 上方 Header + 中間內容區
 *
 * - 登入頁 (/login) 和 callback 頁面不套用 ERP Layout
 * - 已整合 AuthGuard：未登入狀態下自動引導至登入頁
 */
import React, { useState } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthGuard from './AuthGuard';
import styles from './ErpLayout.module.css';

const { Content } = Layout;

interface ErpLayoutProps {
  children: React.ReactNode;
}

/** 不套用 ERP Layout 的路由 */
const EXCLUDE_PATHS = ['/login', '/auth/callback'];

export default function ErpLayout({ children }: ErpLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // 登入頁及 callback 不套用 sidebar/header/guard
  if (EXCLUDE_PATHS.some(p => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <Layout className={styles.layout}>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout className={styles.mainLayout} style={{ marginLeft: collapsed ? 64 : 260 }}>
          <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}
