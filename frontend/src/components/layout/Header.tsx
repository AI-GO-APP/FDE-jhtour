'use client';

/**
 * ERP 頂部導航列
 * 替代舊系統的 topFrame (使用者資訊、登出、通知)
 * 整合 RBAC 角色切換 + AI GO 認證登出
 */
import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Badge, Dropdown, Avatar, Space, Tag, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  KeyOutlined,
  SwapOutlined,
  CrownOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { useAuth } from '@/lib/auth-context';
import { ROLE_INFO } from '@/lib/rbac';
import { getPathLabel } from '@/lib/path-labels';
import type { Role } from '@/lib/rbac';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

// P4: 通知數 TTL 快取（60 秒有效期，避免每次渲染都打 API）
const NOTIFICATION_CACHE_TTL = 60_000; // 60 秒
let notificationCache: { count: number; timestamp: number } | null = null;

export default function Header({ collapsed, onToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  // P4: 動態取得未讀通知數（帶 TTL 快取）
  useEffect(() => {
    let cancelled = false;

    // 快取尚未過期 → 直接使用快取值
    if (notificationCache && Date.now() - notificationCache.timestamp < NOTIFICATION_CACHE_TTL) {
      setNotificationCount(notificationCache.count);
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/announcements?limit=1&count=true');
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            const count = json.pagination?.total ?? 0;
            setNotificationCount(count);
            notificationCache = { count, timestamp: Date.now() };
          }
        }
      } catch {
        // 靜默處理
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 產生麵包屑
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { title: '首頁', href: '/' },
    ...segments.map((seg) => ({
      title: getPathLabel(seg),
    })),
  ];

  /** 真實登出 — 清除 cookie + 前端狀態 */
  const handleLogout = async () => {
    try {
      await logout();
      message.success('已登出');
    } catch {
      message.error('登出失敗');
    }
    router.push('/login');
  };

  // 角色切換子選單（僅 ADMIN 可見）
  const roleSwitchItems: MenuProps['items'] = user?.role === 'ADMIN'
    ? (Object.keys(ROLE_INFO) as Role[]).map((r) => ({
        key: `switch-${r}`,
        label: `切換至 ${ROLE_INFO[r].label}`,
        icon: <SwapOutlined />,
        onClick: () => {
          switchRole(r);
          message.success(`已切換至 ${ROLE_INFO[r].label} 視角`);
        },
      }))
    : [];

  const userMenuItems: MenuProps['items'] = [
    // 顯示認證來源標示
    user?.isDemo
      ? { key: 'auth-source', label: '🧪 Demo 模式', disabled: true }
      : { key: 'auth-source', label: '☁️ AI GO 認證', icon: <CloudOutlined />, disabled: true },
    { type: 'divider' as const },
    { key: 'profile', label: '個人資料', icon: <UserOutlined /> },
    { key: 'password', label: '修改密碼', icon: <KeyOutlined />, onClick: () => router.push('/master-data/password') },
    { key: 'settings', label: '設定', icon: <SettingOutlined /> },
    ...(roleSwitchItems.length > 0 ? [
      { type: 'divider' as const },
      { key: 'switch-role', label: '角色切換', icon: <CrownOutlined />, children: roleSwitchItems },
    ] : []),
    { type: 'divider' as const },
    { key: 'logout', label: '登出', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  const roleInfo = user ? ROLE_INFO[user.role] : null;

  /** 顯示使用者名稱 */
  const displayName = user?.empName || user?.email || '訪客';

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.triggerBtn} onClick={onToggle}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.headerRight}>
        <Badge count={notificationCount} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className={styles.userInfo}>
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: roleInfo?.color, flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1.2, gap: 2 }}>
              <div className={styles.userName} style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
              <Tag color={roleInfo?.color} style={{ fontSize: 11, lineHeight: '16px', marginRight: 0, padding: '0 4px', border: 0 }}>
                {roleInfo?.label || '未登入'}
                {user?.isDemo ? ' (Demo)' : ''}
              </Tag>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
