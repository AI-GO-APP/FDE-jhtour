'use client';

/**
 * ERP 頂部導航列
 * 替代舊系統的 topFrame (使用者資訊、登出、通知)
 */
import React from 'react';
import { Layout, Breadcrumb, Badge, Dropdown, Avatar, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** 路徑到中文名稱映射 */
const PATH_LABELS: Record<string, string> = {
  'master-data': '基本資料',
  passengers: '旅客資料管理',
  agents: '同業資料管理',
  companies: '機關行號客戶',
  airlines: '航空公司',
  employees: '員工管理',
  orders: '訂單管理',
  sales: '業務員訂單作業',
  op: 'OP 人員訂單作業',
  products: '商品管理',
  'group-sales': '團銷管理',
  ticketing: '票務管理',
  visa: '證照管理',
  accounting: '帳務管理',
  messaging: '訊息管理',
  settings: '系統設定',
  maintenance: '系統維護',
  'tour-leaders': '領隊及導遊',
  geo: '地理資訊',
  currencies: '幣別匯率',
  flights: '航班時刻表',
  'travel-info': '旅遊輔助資訊',
  attendance: '員工出勤',
  'local-agents': '國外 Local',
  'visa-units': '辦證單位',
  restaurants: '餐廳管理',
  suppliers: '廠商管理',
  cruise: '輪船公司',
  'car-rentals': '租車公司',
  'scenic-spots': '旅遊景點',
  channels: '通路類別',
  hotel: '旅館管理',
  'tour-template': '共用基本行程',
  'master-group': '基本團型管理',
  'create-group': '開團作業',
  control: '團體銷售控管',
  import: '機票進票作業',
  detail: '機票明細資料',
  record: '旅客辦證記錄',
  receivable: '應收憑單',
  payable: '應付憑單',
  bbs: '訊息編輯',
  news: '公佈欄',
};

/** // TODO: [替換] 改為從 auth context 取得使用者資訊 */
const userMenuItems: MenuProps['items'] = [
  { key: 'profile', label: '個人資料', icon: <UserOutlined /> },
  { key: 'password', label: '修改密碼', icon: <KeyOutlined /> },
  { key: 'settings', label: '設定', icon: <SettingOutlined /> },
  { type: 'divider' },
  { key: 'logout', label: '登出', icon: <LogoutOutlined />, danger: true },
];

export default function Header({ collapsed, onToggle }: HeaderProps) {
  const pathname = usePathname();

  // 產生麵包屑
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { title: '首頁', href: '/' },
    ...segments.map((seg) => ({
      title: PATH_LABELS[seg] || seg,
    })),
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.triggerBtn} onClick={onToggle}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.headerRight}>
        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Badge>

        {/* TODO: [替換] 改為從 auth context/API 取得實際登入使用者 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className={styles.userInfo}>
            <Avatar icon={<UserOutlined />} size="small" />
            <div>
              <div className={styles.userName}>LOUIS</div>
              <div className={styles.userRole}>會計</div>
            </div>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
