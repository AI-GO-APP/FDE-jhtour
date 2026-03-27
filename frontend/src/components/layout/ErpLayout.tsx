'use client';

/**
 * ERP 總體 Layout
 * 替代舊系統的五框架 Frameset (top/left/center/msg/main)
 * 結構：左側 Sidebar + 上方 Header + 中間內容區
 * 登入頁 (/login) 不套用 ERP Layout
 */
import React, { useState } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './ErpLayout.module.css';

const { Content } = Layout;

interface ErpLayoutProps {
  children: React.ReactNode;
}

/** 不套用 ERP Layout 的路由 */
const EXCLUDE_PATHS = ['/login'];

export default function ErpLayout({ children }: ErpLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // 登入頁不套用 sidebar/header
  if (EXCLUDE_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <Layout className={styles.layout}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className={styles.mainLayout} style={{ marginLeft: collapsed ? 64 : 260 }}>
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
