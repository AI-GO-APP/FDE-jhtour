'use client';

/**
 * Dashboard 首頁
 * 根據登入角色動態載入對應的 KPI / 資料區塊
 * 替代舊系統的 mainFrame 初始頁面 (N/L_news.asp 公佈欄)
 */
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'ADMIN';

  return <RoleDashboard role={role} />;
}
