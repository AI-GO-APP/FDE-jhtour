'use client';

/**
 * ERP 側邊導航選單
 * 替代舊系統的 leftFrame (TreeView 導航)
 * 支援多層收合選單、路由導航
 */
import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { sidebarMenuItems, type SidebarMenuItem } from '@/lib/menu-config';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

/** 將 SidebarMenuItem 轉換為 Ant Design Menu items */
function toAntdMenuItems(items: SidebarMenuItem[]): MenuProps['items'] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    children: item.children ? toAntdMenuItems(item.children) : undefined,
  }));
}

/** 根據路徑找到選中的 menu key */
function findSelectedKey(items: SidebarMenuItem[], pathname: string): string[] {
  for (const item of items) {
    if (item.path === pathname) return [item.key];
    if (item.children) {
      const found = findSelectedKey(item.children, pathname);
      if (found.length) return found;
    }
  }
  return [];
}

/** 根據路徑找到展開的 parent keys */
function findOpenKeys(items: SidebarMenuItem[], pathname: string, parents: string[] = []): string[] {
  for (const item of items) {
    if (item.path === pathname) return parents;
    if (item.children) {
      const found = findOpenKeys(item.children, pathname, [...parents, item.key]);
      if (found.length) return found;
    }
  }
  return [];
}

/** 根據 key 找到對應的路徑 */
function findPathByKey(items: SidebarMenuItem[], key: string): string | undefined {
  for (const item of items) {
    if (item.key === key && item.path) return item.path;
    if (item.children) {
      const found = findPathByKey(item.children, key);
      if (found) return found;
    }
  }
  return undefined;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = useMemo(() => toAntdMenuItems(sidebarMenuItems), []);
  const selectedKeys = useMemo(() => findSelectedKey(sidebarMenuItems, pathname), [pathname]);
  const defaultOpenKeys = useMemo(() => findOpenKeys(sidebarMenuItems, pathname), [pathname]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const path = findPathByKey(sidebarMenuItems, key);
    if (path) {
      router.push(path);
    }
  };

  return (
    <Sider
      className={styles.sidebar}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      collapsedWidth={64}
      breakpoint="lg"
    >
      <div className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ''}`}>
        <h2>{collapsed ? '吉航' : '吉航旅遊 ERP'}</h2>
      </div>
      <div className={styles.menuContainer}>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={collapsed ? [] : defaultOpenKeys}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}
