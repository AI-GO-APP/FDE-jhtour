/**
 * ERP 側邊選單配置
 * 對應舊系統的 leftFrame (TreeView 導航)
 * 路由結構與舊系統 A~Z 模組一致
 */
import {
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  MessageOutlined,
  SettingOutlined,
  ToolOutlined,
  DashboardOutlined,
  ContactsOutlined,
  GlobalOutlined,
  IdcardOutlined,
  BankOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  ScheduleOutlined,
  CreditCardOutlined,
  SendOutlined,
} from '@ant-design/icons';
import React from 'react';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarMenuItem[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    key: 'dashboard',
    label: '首頁儀表板',
    icon: React.createElement(DashboardOutlined),
    path: '/',
  },
  {
    key: 'master-data',
    label: 'A. 基本資料',
    icon: React.createElement(ContactsOutlined),
    children: [
      {
        key: 'master-data-customer',
        label: '客戶及供應商',
        children: [
          { key: 'passengers', label: '旅客資料管理', path: '/master-data/passengers' },
          { key: 'agents', label: '同業資料管理', path: '/master-data/agents' },
          { key: 'companies', label: '機關行號客戶', path: '/master-data/companies' },
          { key: 'airlines', label: '航空公司', path: '/master-data/airlines' },
          { key: 'local-agents', label: '國外 Local', path: '/master-data/local-agents' },
          { key: 'visa-units', label: '辦證單位', path: '/master-data/visa-units' },
          { key: 'restaurants', label: '餐廳管理', path: '/master-data/restaurants' },
          { key: 'suppliers', label: '廠商管理', path: '/master-data/suppliers' },
          { key: 'cruise', label: '輪船公司', path: '/master-data/cruise' },
          { key: 'car-rentals', label: '租車公司', path: '/master-data/car-rentals' },
          { key: 'scenic-spots', label: '旅遊景點', path: '/master-data/scenic-spots' },
          { key: 'channels', label: '通路類別', path: '/master-data/channels' },
          { key: 'export', label: '資料匯出', path: '/master-data/export' },
        ],
      },
      {
        key: 'master-data-hr',
        label: '員工管理',
        icon: React.createElement(IdcardOutlined),
        children: [
          { key: 'employees', label: '員工管理', path: '/master-data/employees' },
          { key: 'tour-leaders', label: '領隊及導遊', path: '/master-data/tour-leaders' },
        ],
      },
      {
        key: 'master-data-travel',
        label: '旅遊資訊',
        icon: React.createElement(GlobalOutlined),
        children: [
          { key: 'geo', label: '洲/國/城市/機場', path: '/master-data/geo' },
          { key: 'currencies', label: '幣別匯率', path: '/master-data/currencies' },
          { key: 'flights', label: '航班時刻表', path: '/master-data/flights' },
          { key: 'travel-info', label: '旅遊輔助資訊', path: '/master-data/travel-info' },
          { key: 'image-library', label: '圖庫管理', path: '/master-data/image-library' },
        ],
      },
      {
        key: 'master-data-attendance',
        label: '員工出勤',
        icon: React.createElement(ScheduleOutlined),
        children: [
          { key: 'leave', label: '差假狀況表', path: '/master-data/attendance/leave' },
          { key: 'clock', label: '刷卡狀況表', path: '/master-data/attendance/clock' },
          { key: 'summary', label: '考勤狀況表', path: '/master-data/attendance/summary' },
          { key: 'emp-swap', label: '業務員替換', path: '/master-data/attendance/emp-swap' },
        ],
      },
      { key: 'password', label: '個人密碼修改', path: '/master-data/password' },
    ],
  },
  {
    key: 'orders',
    label: 'B. 訂單管理',
    icon: React.createElement(ShoppingCartOutlined),
    children: [
      { key: 'order-sales', label: '業務員訂單作業', path: '/orders/sales' },
      { key: 'order-op', label: 'OP 人員訂單作業', path: '/orders/op' },
      { key: 'card-query', label: '信用卡刷卡查詢', path: '/orders/card-query' },
      { key: 'payment-request', label: '請款單作業', path: '/orders/payment-request' },
      { key: 'receipt', label: '繳款單作業', path: '/orders/receipt' },
      { key: 'group-cost', label: '團體成本請款', path: '/orders/group-cost' },
      {
        key: 'online-payment',
        label: '線上支付',
        icon: React.createElement(CreditCardOutlined),
        children: [
          { key: 'payment-log', label: '支付通知紀錄', path: '/orders/payment-log' },
          { key: 'batch-payment', label: '多單支付通知', path: '/orders/batch-payment' },
          { key: 'pay-store', label: '支付店家列表', path: '/orders/pay-store' },
          { key: 'cash-setting', label: '金流網站設定', path: '/orders/cash-setting' },
          { key: 'batch-modify', label: '批次請款/取消', path: '/orders/batch-modify' },
        ],
      },
      { key: 'card-refund', label: '刷退作業', path: '/orders/card-refund' },
      { key: 'performance', label: '業績報表列印', path: '/orders/performance' },
    ],
  },
  {
    key: 'products',
    label: 'C. 商品管理',
    icon: React.createElement(ShopOutlined),
    children: [
      {
        key: 'group-tour',
        label: '團體旅遊',
        children: [
          { key: 'tour-template', label: '共用基本行程', path: '/products/tour-template' },
          { key: 'survey', label: '意見回饋題庫', path: '/products/survey' },
          { key: 'master-group', label: '基本團型管理', path: '/products/master-group' },
          { key: 'create-group', label: '開團作業', path: '/products/create-group' },
          { key: 'group-sales', label: '個團及銷售管理', path: '/products/group-management' },
        ],
      },
      {
        key: 'fit',
        label: '自由行',
        children: [
          { key: 'personal-fit', label: '個人自由行', path: '/products/personal-fit' },
          { key: 'group-fit', label: '團體自由行', path: '/products/group-fit' },
        ],
      },
      {
        key: 'hotel',
        label: '旅館管理',
        icon: React.createElement(BankOutlined),
        children: [
          { key: 'hotel-list', label: '商品資料管理', path: '/products/hotel' },
          { key: 'hotel-profit', label: '利潤管理', path: '/products/hotel-profit' },
          { key: 'hotel-gross', label: '毛利管理', path: '/products/hotel-gross' },
          { key: 'hotel-cancel', label: '後退管理', path: '/products/hotel-cancel' },
          { key: 'hotel-promo', label: '預約優惠管理', path: '/products/hotel-promo' },
          { key: 'hotel-pay-rule', label: '收款規則管理', path: '/products/hotel-pay-rule' },
          { key: 'hotel-device', label: '備品管理', path: '/products/hotel-device' },
          { key: 'hotel-breakfast', label: '早餐管理', path: '/products/hotel-breakfast' },
          { key: 'hotel-op', label: '訂單 OP 設定', path: '/products/hotel-op' },
          { key: 'hotel-cost-dept', label: '成本部門設定', path: '/products/hotel-cost-dept' },
        ],
      },
      {
        key: 'other-products',
        label: '其他商品',
        children: [
          { key: 'visa-product', label: '證照及辦證文件', path: '/products/visa-product' },
          { key: 'misc-product', label: '其他旅遊商品', path: '/products/misc-product' },
          { key: 'local-package', label: '當地套件及自費', path: '/products/local-package' },
        ],
      },
    ],
  },
  {
    key: 'group-sales',
    label: 'D. 團銷管理',
    icon: React.createElement(TeamOutlined),
    children: [
      { key: 'sales-control', label: '團體銷售控管', path: '/group-sales/control' },
      { key: 'group-report', label: '團體報表列印', path: '/group-sales/report' },
      { key: 'group-room', label: '團體分房表', path: '/group-sales/room' },
      { key: 'group-car', label: '團體派車單', path: '/group-sales/car' },
      { key: 'group-log', label: '訂單異動紀錄', path: '/group-sales/log' },
      { key: 'group-feat', label: '團體業績處理', path: '/group-sales/performance' },
      { key: 'gov-apply', label: '出國旅遊動態申報', path: '/group-sales/gov-apply' },
    ],
  },
  {
    key: 'ticketing',
    label: 'E. 票務管理',
    icon: React.createElement(FileTextOutlined),
    children: [
      { key: 'ticket-import', label: '機票進票作業', path: '/ticketing/import' },
      { key: 'ticket-detail', label: '機票明細資料', path: '/ticketing/detail' },
      { key: 'ticket-refund', label: '退票作業維護', path: '/ticketing/refund' },
      { key: 'ticket-area', label: '機票行程地區', path: '/ticketing/area' },
      { key: 'ticket-report', label: '報表列印', path: '/ticketing/report' },
      { key: 'agent-sales', label: '同業網路銷售統計', path: '/ticketing/agent-sales' },
      { key: 'price-notify', label: '票價修改通知', path: '/ticketing/price-notify' },
      { key: 'blank-ticket', label: '空白票請領調撥', path: '/ticketing/blank-ticket' },
    ],
  },
  {
    key: 'visa',
    label: 'F. 證照管理',
    icon: React.createElement(SafetyCertificateOutlined),
    children: [
      { key: 'visa-record', label: '旅客辦證記錄', path: '/visa/record' },
      { key: 'visa-detail', label: '交辦處理明細', path: '/visa/detail' },
      { key: 'ed-card', label: 'ED卡/海關單', path: '/visa/ed-card' },
      { key: 'visa-expire', label: '證照到期名單', path: '/visa/expire' },
      { key: 'visa-report', label: '證照報表列印', path: '/visa/report' },
    ],
  },
  {
    key: 'accounting',
    label: 'K. 帳務管理',
    icon: React.createElement(DollarOutlined),
    children: [
      { key: 'receivable', label: '應收憑單', path: '/accounting/receivable' },
      { key: 'payable', label: '應付憑單', path: '/accounting/payable' },
      { key: 'e-transfer', label: '電子預收代轉', path: '/accounting/e-transfer' },
      { key: 'e-batch', label: '電子代轉批次開立', path: '/accounting/e-batch' },
      { key: 'buyer-edit', label: '買受人修改', path: '/accounting/buyer-edit' },
      { key: 'e-print', label: '電子代轉批次列印', path: '/accounting/e-print' },
      { key: 'acc-report', label: '帳務報表列印', path: '/accounting/report' },
    ],
  },
  {
    key: 'messaging',
    label: 'N. 訊息管理',
    icon: React.createElement(MessageOutlined),
    children: [
      { key: 'bbs', label: '訊息編輯與管理', path: '/messaging/bbs' },
      { key: 'news', label: '公佈欄', path: '/messaging/news' },
      {
        key: 'sms',
        label: '簡訊管理',
        icon: React.createElement(SendOutlined),
        children: [
          { key: 'sms-auto', label: '自動發送設定', path: '/messaging/sms-auto' },
          { key: 'sms-library', label: '詞庫設定', path: '/messaging/sms-library' },
          { key: 'sms-send', label: '簡訊發送', path: '/messaging/sms-send' },
          { key: 'sms-promo', label: '簡訊行銷', path: '/messaging/sms-promo' },
          { key: 'sms-group', label: '發送對象設定', path: '/messaging/sms-group' },
          { key: 'sms-schedule', label: '預約發送管理', path: '/messaging/sms-schedule' },
          { key: 'sms-log', label: '處理記錄', path: '/messaging/sms-log' },
        ],
      },
    ],
  },
  {
    key: 'settings',
    label: 'H. 系統設定',
    icon: React.createElement(SettingOutlined),
    children: [
      { key: 'user-group', label: '使用者群組管理', path: '/settings/user-group' },
      { key: 'user-manage', label: '員工使用者管理', path: '/settings/user-manage' },
      { key: 'mail-list', label: '寄送郵件列表', path: '/settings/mail-list' },
      { key: 'pwd-policy', label: '密碼政策設定', path: '/settings/pwd-policy' },
      { key: 'custom-report', label: '團體自訂報表', path: '/settings/custom-report' },
    ],
  },
  {
    key: 'maintenance',
    label: 'Z. 系統維護',
    icon: React.createElement(ToolOutlined),
    children: [
      { key: 'clear-group', label: '清除團體資料', path: '/maintenance/clear-group' },
      { key: 'clear-ticket', label: '清除機票資料', path: '/maintenance/clear-ticket' },
      { key: 'clear-pax', label: '清除旅客個資', path: '/maintenance/clear-pax' },
    ],
  },
];
