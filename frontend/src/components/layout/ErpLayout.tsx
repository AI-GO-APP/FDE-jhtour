'use client';

/**
 * ERP 總體 Layout
 * 替代舊系統的五框架 Frameset (top/left/center/msg/main)
 * 結構：左側 Sidebar + 上方 Header + 中間內容區
 */
import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './ErpLayout.module.css';

const { Content } = Layout;

interface ErpLayoutProps {
  children: React.ReactNode;
}

export default function ErpLayout({ children }: ErpLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

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
