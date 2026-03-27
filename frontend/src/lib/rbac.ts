/**
 * RBAC 角色權限定義
 * 定義 6 個核心角色與頁面路由的存取權限映射
 */

/** 系統角色 */
export type Role = 'ADMIN' | 'SALES' | 'OP' | 'TICKET' | 'VISA' | 'ACCT';

/** 頁面存取權限等級 */
export type Permission = 'full' | 'readonly' | 'hidden';

/** 角色顯示資訊 */
export interface RoleInfo {
  code: Role;
  label: string;
  color: string;
  icon: string;       // Ant Design icon name
  defaultPath: string; // 登入後預設首頁
  description: string;
}

/** 角色完整定義 */
export const ROLE_INFO: Record<Role, RoleInfo> = {
  ADMIN:  { code: 'ADMIN',  label: '系統管理員', color: '#f5222d', icon: 'CrownOutlined',         defaultPath: '/',                   description: '全部功能存取 + 系統設定' },
  SALES:  { code: 'SALES',  label: '業務員',     color: '#1677ff', icon: 'UserOutlined',          defaultPath: '/orders/sales',        description: '訂單銷售、客戶維護、業績查詢' },
  OP:     { code: 'OP',     label: 'OP 人員',    color: '#52c41a', icon: 'ScheduleOutlined',      defaultPath: '/group-sales/control', description: '團體操作、出團執行、行政安排' },
  TICKET: { code: 'TICKET', label: '票務人員',   color: '#722ed1', icon: 'FileTextOutlined',      defaultPath: '/ticketing/detail',    description: '機票進退票、BSP 對帳' },
  VISA:   { code: 'VISA',   label: '證照人員',   color: '#eb2f96', icon: 'SafetyCertificateOutlined', defaultPath: '/visa/record',     description: '護照/簽證辦理流程追蹤' },
  ACCT:   { code: 'ACCT',   label: '會計人員',   color: '#fa8c16', icon: 'DollarOutlined',        defaultPath: '/accounting/receivable', description: '帳務憑單、應收/應付、報表' },
};

/**
 * 角色頁面權限矩陣
 * key = 路由前綴，value = Permission
 * 使用前綴匹配（如 '/orders' 匹配所有 /orders/* 子路由）
 * 若路由未在定義中，預設為 'hidden'
 */
export const ROLE_PERMISSIONS: Record<Role, Record<string, Permission>> = {
  ADMIN: {
    '*': 'full', // 管理員全部開放
  },

  SALES: {
    '/': 'full',
    // A. 基本資料
    '/master-data/passengers': 'full',
    '/master-data/agents': 'full',
    '/master-data/companies': 'full',
    '/master-data/airlines': 'readonly',
    '/master-data/local-agents': 'readonly',
    '/master-data/restaurants': 'readonly',
    '/master-data/suppliers': 'readonly',
    '/master-data/cruise': 'readonly',
    '/master-data/car-rentals': 'readonly',
    '/master-data/scenic-spots': 'readonly',
    '/master-data/channels': 'full',
    '/master-data/export': 'full',
    '/master-data/geo': 'readonly',
    '/master-data/currencies': 'readonly',
    '/master-data/flights': 'readonly',
    '/master-data/travel-info': 'readonly',
    '/master-data/tour-leaders': 'readonly',
    '/master-data/password': 'full',
    // B. 訂單管理
    '/orders/sales': 'full',
    '/orders/card-query': 'readonly',
    '/orders/performance': 'full',
    // D. 團銷管理
    '/group-sales/control': 'full',
    '/group-sales/report': 'full',
    '/group-sales/log': 'readonly',
    // C. 商品（唯讀）
    '/products/tour-template': 'readonly',
    '/products/master-group': 'readonly',
    '/products/group-management': 'readonly',
    '/products/personal-fit': 'readonly',
    '/products/group-fit': 'readonly',
    '/products/hotel': 'readonly',
    '/products/visa-product': 'readonly',
    '/products/misc-product': 'readonly',
    '/products/local-package': 'readonly',
    // N. 訊息
    '/messaging/bbs': 'full',
    '/messaging/news': 'full',
    '/messaging/sms-send': 'full',
    '/messaging/sms-promo': 'full',
    '/messaging/sms-group': 'full',
    '/messaging/sms-schedule': 'full',
    '/messaging/sms-log': 'readonly',
  },

  OP: {
    '/': 'full',
    // A. 基本資料
    '/master-data/passengers': 'readonly',
    '/master-data/agents': 'readonly',
    '/master-data/companies': 'readonly',
    '/master-data/airlines': 'readonly',
    '/master-data/local-agents': 'full',
    '/master-data/restaurants': 'full',
    '/master-data/suppliers': 'full',
    '/master-data/cruise': 'full',
    '/master-data/car-rentals': 'full',
    '/master-data/scenic-spots': 'full',
    '/master-data/tour-leaders': 'full',
    '/master-data/geo': 'readonly',
    '/master-data/currencies': 'readonly',
    '/master-data/flights': 'readonly',
    '/master-data/travel-info': 'readonly',
    '/master-data/image-library': 'full',
    '/master-data/password': 'full',
    // B. 訂單管理
    '/orders/op': 'full',
    '/orders/group-cost': 'full',
    // C. 商品管理（全部）
    '/products/tour-template': 'full',
    '/products/survey': 'full',
    '/products/master-group': 'full',
    '/products/create-group': 'full',
    '/products/group-management': 'full',
    '/products/personal-fit': 'full',
    '/products/group-fit': 'full',
    '/products/hotel': 'full',
    '/products/hotel-profit': 'full',
    '/products/hotel-gross': 'full',
    '/products/hotel-cancel': 'full',
    '/products/hotel-promo': 'full',
    '/products/hotel-pay-rule': 'full',
    '/products/hotel-device': 'full',
    '/products/hotel-breakfast': 'full',
    '/products/hotel-op': 'full',
    '/products/hotel-cost-dept': 'full',
    '/products/visa-product': 'full',
    '/products/misc-product': 'full',
    '/products/local-package': 'full',
    // D. 團銷管理
    '/group-sales/control': 'full',
    '/group-sales/report': 'full',
    '/group-sales/room': 'full',
    '/group-sales/car': 'full',
    '/group-sales/log': 'readonly',
    '/group-sales/gov-apply': 'full',
    // N. 訊息
    '/messaging/bbs': 'full',
    '/messaging/news': 'full',
  },

  TICKET: {
    '/': 'full',
    // A. 基本資料
    '/master-data/passengers': 'readonly',
    '/master-data/agents': 'full',
    '/master-data/airlines': 'full',
    '/master-data/geo': 'readonly',
    '/master-data/currencies': 'readonly',
    '/master-data/flights': 'readonly',
    '/master-data/export': 'full',
    '/master-data/password': 'full',
    // E. 票務管理（全部）
    '/ticketing/import': 'full',
    '/ticketing/detail': 'full',
    '/ticketing/refund': 'full',
    '/ticketing/area': 'full',
    '/ticketing/report': 'full',
    '/ticketing/agent-sales': 'full',
    '/ticketing/price-notify': 'full',
    '/ticketing/blank-ticket': 'full',
    // N. 訊息
    '/messaging/bbs': 'full',
    '/messaging/news': 'full',
  },

  VISA: {
    '/': 'full',
    // A. 基本資料
    '/master-data/passengers': 'readonly',
    '/master-data/visa-units': 'full',
    '/master-data/geo': 'readonly',
    '/master-data/travel-info': 'readonly',
    '/master-data/password': 'full',
    // F. 證照管理（全部）
    '/visa/record': 'full',
    '/visa/detail': 'full',
    '/visa/ed-card': 'full',
    '/visa/expire': 'full',
    '/visa/report': 'full',
    // N. 訊息
    '/messaging/bbs': 'full',
    '/messaging/news': 'full',
  },

  ACCT: {
    '/': 'full',
    // A. 基本資料
    '/master-data/passengers': 'readonly',
    '/master-data/agents': 'readonly',
    '/master-data/companies': 'readonly',
    '/master-data/geo': 'readonly',
    '/master-data/currencies': 'readonly',
    '/master-data/export': 'full',
    '/master-data/password': 'full',
    // B. 訂單管理
    '/orders/sales': 'readonly',
    '/orders/op': 'readonly',
    '/orders/card-query': 'full',
    '/orders/payment-request': 'full',
    '/orders/receipt': 'full',
    '/orders/group-cost': 'full',
    '/orders/payment-log': 'full',
    '/orders/batch-payment': 'full',
    '/orders/pay-store': 'full',
    '/orders/cash-setting': 'full',
    '/orders/batch-modify': 'full',
    '/orders/card-refund': 'full',
    '/orders/performance': 'full',
    // D. 團銷
    '/group-sales/log': 'readonly',
    '/group-sales/performance': 'full',
    '/group-sales/report': 'full',
    // E. 票務（唯讀）
    '/ticketing/detail': 'readonly',
    '/ticketing/report': 'readonly',
    // K. 帳務管理（全部）
    '/accounting/receivable': 'full',
    '/accounting/payable': 'full',
    '/accounting/e-transfer': 'full',
    '/accounting/e-batch': 'full',
    '/accounting/buyer-edit': 'full',
    '/accounting/e-print': 'full',
    '/accounting/report': 'full',
    // N. 訊息
    '/messaging/bbs': 'full',
    '/messaging/news': 'full',
  },
};

/**
 * 取得指定角色對某路由的存取權限
 * @param role 角色
 * @param pathname 頁面路由路徑
 * @returns Permission
 */
export function getPermission(role: Role, pathname: string): Permission {
  const perms = ROLE_PERMISSIONS[role];

  // ADMIN 萬用
  if (perms['*']) return perms['*'];

  // 精確匹配
  if (perms[pathname]) return perms[pathname];

  // 前綴匹配（例如 /orders/payment-log 匹配 /orders）
  const segments = pathname.split('/').filter(Boolean);
  while (segments.length > 1) {
    segments.pop();
    const prefix = '/' + segments.join('/');
    if (perms[prefix]) return perms[prefix];
  }

  // 預設隱藏
  return 'hidden';
}

/**
 * 檢查路由是否可見（非 hidden）
 */
export function isRouteVisible(role: Role, pathname: string): boolean {
  return getPermission(role, pathname) !== 'hidden';
}

/**
 * 檢查路由是否可編輯（full 權限）
 */
export function isRouteEditable(role: Role, pathname: string): boolean {
  return getPermission(role, pathname) === 'full';
}
