/**
 * 批次為所有未對接頁面加入 apiPath
 * 邏輯：根據頁面路徑推斷對應的 API endpoint 和表欄位
 */
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

// 頁面 → API 映射表（65 個未對接頁面）
// 格式: { pagePath, apiPath, title, columns, formFields }
const MAPPINGS = [
  // ===== 會計模組 =====
  { page: 'accounting/buyer-edit', api: '/api/customers', title: '買受人修改',
    columns: [
      { title: '客戶名稱', dataIndex: 'name', width: 200 },
      { title: '類型', dataIndex: 'customer_type', width: 100 },
      { title: '電話', dataIndex: 'phone', width: 130 },
      { title: 'Email', dataIndex: 'email', width: 180 },
    ],
    form: [
      { name: 'name', label: '客戶名稱', required: true },
      { name: 'customer_type', label: '類型', type: 'select', options: ['company', 'individual'], required: true },
      { name: 'phone', label: '電話' },
      { name: 'email', label: 'Email' },
    ]},
  { page: 'accounting/e-batch', api: '/api/accounting', title: '電子發票批次',
    columns: [
      { title: '傳票編號', dataIndex: 'name', width: 150 },
      { title: '類型', dataIndex: 'move_type', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'accounting/e-print', api: '/api/accounting', title: '電子發票列印',
    columns: [
      { title: '傳票編號', dataIndex: 'name', width: 150 },
      { title: '類型', dataIndex: 'move_type', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'accounting/e-transfer', api: '/api/accounting', title: '電子發票傳送',
    columns: [
      { title: '傳票編號', dataIndex: 'name', width: 150 },
      { title: '類型', dataIndex: 'move_type', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'accounting/report', api: '/api/accounting', title: '帳務報表',
    columns: [
      { title: '傳票編號', dataIndex: 'name', width: 150 },
      { title: '類型', dataIndex: 'move_type', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},

  // ===== 團銷模組 =====
  { page: 'group-sales/car', api: '/api/custom/departure-schedules', title: '團體用車',
    columns: [
      { title: '團號', dataIndex: 'group_code', width: 120 },
      { title: '出發日', dataIndex: 'departure_date', width: 120 },
      { title: '回程日', dataIndex: 'return_date', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'group-sales/gov-apply', api: '/api/custom/departure-schedules', title: '政府核准件',
    columns: [
      { title: '團號', dataIndex: 'group_code', width: 120 },
      { title: '出發日', dataIndex: 'departure_date', width: 120 },
      { title: '人數', dataIndex: 'current_pax', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'group-sales/log', api: '/api/custom/departure-schedules', title: '團體異動紀錄',
    columns: [
      { title: '團號', dataIndex: 'group_code', width: 120 },
      { title: '出發日', dataIndex: 'departure_date', width: 120 },
      { title: '人數', dataIndex: 'current_pax', width: 80 },
      { title: '價格', dataIndex: 'price', width: 100 },
    ]},
  { page: 'group-sales/performance', api: '/api/sale-orders', title: '團銷業績',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'group-sales/report', api: '/api/sale-orders', title: '團銷報表',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'group-sales/room', api: '/api/custom/hotel-contracts', title: '房間安排',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '房型', dataIndex: 'room_type', width: 100 },
      { title: '費率', dataIndex: 'rate', width: 100 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},

  // ===== 維護模組 =====
  { page: 'maintenance/clear-group', api: '/api/custom/departure-schedules', title: '團體清除',
    columns: [
      { title: '團號', dataIndex: 'group_code', width: 120 },
      { title: '出發日', dataIndex: 'departure_date', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'maintenance/clear-pax', api: '/api/customers', title: '旅客清除',
    columns: [
      { title: '客戶名稱', dataIndex: 'name', width: 200 },
      { title: '類型', dataIndex: 'customer_type', width: 100 },
    ]},
  { page: 'maintenance/clear-ticket', api: '/api/sale-orders', title: '票據清除',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},

  // ===== 基礎資料 — 考勤 =====
  { page: 'master-data/attendance', api: '/api/hr/attendances', title: '考勤管理',
    columns: [
      { title: '編號', dataIndex: 'id', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 200 },
    ]},
  { page: 'master-data/attendance/clock', api: '/api/hr/attendances', title: '打卡記錄',
    columns: [
      { title: '編號', dataIndex: 'id', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 200 },
    ]},
  { page: 'master-data/attendance/emp-swap', api: '/api/hr', title: '人員調班',
    columns: [
      { title: '員工', dataIndex: 'name', width: 200 },
      { title: '職稱', dataIndex: 'job_title', width: 150 },
      { title: '部門', dataIndex: 'department_id', width: 150 },
    ]},
  { page: 'master-data/attendance/leave', api: '/api/hr/leaves', title: '請假管理',
    columns: [
      { title: '編號', dataIndex: 'id', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 200 },
    ]},
  { page: 'master-data/attendance/summary', api: '/api/hr/attendances', title: '考勤彙總',
    columns: [
      { title: '編號', dataIndex: 'id', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 200 },
    ]},
  { page: 'master-data/export', api: '/api/customers', title: '資料匯出',
    columns: [
      { title: '客戶名稱', dataIndex: 'name', width: 200 },
      { title: '類型', dataIndex: 'customer_type', width: 100 },
      { title: 'Email', dataIndex: 'email', width: 180 },
    ]},
  { page: 'master-data/image-library', api: '/api/products', title: '圖庫管理',
    columns: [
      { title: '產品名稱', dataIndex: 'name', width: 200 },
      { title: '類型', dataIndex: 'product_type', width: 100 },
    ]},
  { page: 'master-data/password', api: '/api/hr', title: '密碼管理',
    columns: [
      { title: '員工', dataIndex: 'name', width: 200 },
      { title: 'Email', dataIndex: 'work_email', width: 200 },
    ]},
  { page: 'master-data/travel-info', api: '/api/countries', title: '旅遊資訊',
    columns: [
      { title: '國家', dataIndex: 'name', width: 200 },
      { title: '代碼', dataIndex: 'code', width: 80 },
      { title: '電話國碼', dataIndex: 'phone_code', width: 100 },
    ]},

  // ===== 簡訊模組 =====
  { page: 'messaging/sms-auto', api: '/api/announcements', title: '自動簡訊',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
      { title: '狀態', dataIndex: 'active', width: 100 },
    ]},
  { page: 'messaging/sms-group', api: '/api/customers', title: '群發對象',
    columns: [
      { title: '客戶名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ]},
  { page: 'messaging/sms-library', api: '/api/announcements', title: '簡訊範本',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},
  { page: 'messaging/sms-log', api: '/api/announcements', title: '簡訊紀錄',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},
  { page: 'messaging/sms-promo', api: '/api/announcements', title: '促銷簡訊',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},
  { page: 'messaging/sms-schedule', api: '/api/announcements', title: '排程簡訊',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},
  { page: 'messaging/sms-send', api: '/api/announcements', title: '發送簡訊',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},

  // ===== 訂單模組 =====
  { page: 'orders/batch-modify', api: '/api/sale-orders', title: '批次修改',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},
  { page: 'orders/batch-payment', api: '/api/accounting/payments', title: '批次收款',
    columns: [
      { title: '金額', dataIndex: 'amount', width: 120 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '類型', dataIndex: 'payment_type', width: 100 },
    ]},
  { page: 'orders/card-refund', api: '/api/accounting/payments', title: '刷退作業',
    columns: [
      { title: '金額', dataIndex: 'amount', width: 120 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '類型', dataIndex: 'payment_type', width: 100 },
    ]},
  { page: 'orders/cash-setting', api: '/api/currencies', title: '幣別設定',
    columns: [
      { title: '幣別', dataIndex: 'name', width: 100 },
      { title: '全名', dataIndex: 'full_name', width: 200 },
      { title: '符號', dataIndex: 'symbol', width: 80 },
    ]},
  { page: 'orders/payment-log', api: '/api/accounting/payments', title: '收款紀錄',
    columns: [
      { title: '金額', dataIndex: 'amount', width: 120 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '類型', dataIndex: 'payment_type', width: 100 },
    ]},
  { page: 'orders/pay-store', api: '/api/accounting/payments', title: '金流入帳',
    columns: [
      { title: '金額', dataIndex: 'amount', width: 120 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '類型', dataIndex: 'payment_type', width: 100 },
    ]},
  { page: 'orders/performance', api: '/api/sale-orders', title: '業績統計',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},

  // ===== 產品模組 =====
  { page: 'products/group-fit', api: '/api/custom/itinerary-templates', title: '團體自由行',
    columns: [
      { title: '行程名稱', dataIndex: 'name', width: 200 },
      { title: '目的地', dataIndex: 'destination', width: 150 },
      { title: '天數', dataIndex: 'duration_days', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/hotel-breakfast', api: '/api/custom/hotel-contracts', title: '飯店早餐',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '城市', dataIndex: 'city', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/hotel-cancel', api: '/api/custom/hotel-contracts', title: '飯店取消',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '城市', dataIndex: 'city', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/hotel-cost-dept', api: '/api/custom/hotel-contracts', title: '飯店成本部門',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '費率', dataIndex: 'rate', width: 100 },
      { title: '幣別', dataIndex: 'currency', width: 80 },
    ]},
  { page: 'products/hotel-device', api: '/api/custom/hotel-contracts', title: '飯店設備',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '房型', dataIndex: 'room_type', width: 100 },
    ]},
  { page: 'products/hotel-gross', api: '/api/custom/hotel-contracts', title: '飯店毛利',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '費率', dataIndex: 'rate', width: 100 },
      { title: '幣別', dataIndex: 'currency', width: 80 },
    ]},
  { page: 'products/hotel-op', api: '/api/custom/hotel-contracts', title: '飯店作業',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '城市', dataIndex: 'city', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/hotel-pay-rule', api: '/api/custom/hotel-contracts', title: '飯店付款規則',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '費率', dataIndex: 'rate', width: 100 },
      { title: '幣別', dataIndex: 'currency', width: 80 },
    ]},
  { page: 'products/hotel-profit', api: '/api/custom/hotel-contracts', title: '飯店利潤',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '費率', dataIndex: 'rate', width: 100 },
    ]},
  { page: 'products/hotel-promo', api: '/api/custom/hotel-contracts', title: '飯店促銷',
    columns: [
      { title: '飯店', dataIndex: 'hotel_name', width: 200 },
      { title: '城市', dataIndex: 'city', width: 120 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/local-package', api: '/api/custom/itinerary-templates', title: '國旅行程',
    columns: [
      { title: '行程名稱', dataIndex: 'name', width: 200 },
      { title: '目的地', dataIndex: 'destination', width: 150 },
      { title: '天數', dataIndex: 'duration_days', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/misc-product', api: '/api/products', title: '其他產品',
    columns: [
      { title: '產品名稱', dataIndex: 'name', width: 200 },
      { title: '類型', dataIndex: 'product_type', width: 100 },
    ]},
  { page: 'products/personal-fit', api: '/api/custom/itinerary-templates', title: '個人自由行',
    columns: [
      { title: '行程名稱', dataIndex: 'name', width: 200 },
      { title: '目的地', dataIndex: 'destination', width: 150 },
      { title: '天數', dataIndex: 'duration_days', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'products/survey', api: '/api/custom/departure-schedules', title: '問卷管理',
    columns: [
      { title: '團號', dataIndex: 'group_code', width: 120 },
      { title: '出發日', dataIndex: 'departure_date', width: 120 },
      { title: '人數', dataIndex: 'current_pax', width: 80 },
    ]},

  // ===== 設定模組 =====
  { page: 'settings/custom-report', api: '/api/announcements', title: '自訂報表',
    columns: [
      { title: '標題', dataIndex: 'title', width: 200 },
    ]},
  { page: 'settings/mail-list', api: '/api/customers', title: '郵件清單',
    columns: [
      { title: '客戶名稱', dataIndex: 'name', width: 200 },
      { title: 'Email', dataIndex: 'email', width: 200 },
    ]},
  { page: 'settings/pwd-policy', api: '/api/hr', title: '密碼政策',
    columns: [
      { title: '員工', dataIndex: 'name', width: 200 },
      { title: 'Email', dataIndex: 'work_email', width: 200 },
    ]},
  { page: 'settings/user-group', api: '/api/hr/departments', title: '使用者群組',
    columns: [
      { title: '部門名稱', dataIndex: 'name', width: 200 },
    ],
    form: [
      { name: 'name', label: '群組名稱', required: true },
    ]},

  // ===== 票務模組 =====
  { page: 'ticketing/agent-sales', api: '/api/custom/airline-contracts', title: '代理銷售',
    columns: [
      { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
      { title: '航空公司', dataIndex: 'airline_name', width: 200 },
      { title: '路線', dataIndex: 'route', width: 150 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'ticketing/area', api: '/api/countries', title: '區域管理',
    columns: [
      { title: '國家', dataIndex: 'name', width: 200 },
      { title: '代碼', dataIndex: 'code', width: 80 },
      { title: '電話國碼', dataIndex: 'phone_code', width: 100 },
    ]},
  { page: 'ticketing/blank-ticket', api: '/api/custom/airline-contracts', title: '空白票管理',
    columns: [
      { title: '航空公司', dataIndex: 'airline_name', width: 200 },
      { title: '艙等', dataIndex: 'seat_class', width: 100 },
      { title: '狀態', dataIndex: 'status', width: 100 },
    ]},
  { page: 'ticketing/price-notify', api: '/api/custom/airline-contracts', title: '票價異動通知',
    columns: [
      { title: '航空公司', dataIndex: 'airline_name', width: 200 },
      { title: '路線', dataIndex: 'route', width: 150 },
      { title: '費率', dataIndex: 'rate', width: 100 },
    ]},
  { page: 'ticketing/refund', api: '/api/accounting/payments', title: '退票作業',
    columns: [
      { title: '金額', dataIndex: 'amount', width: 120 },
      { title: '日期', dataIndex: 'date', width: 120 },
      { title: '類型', dataIndex: 'payment_type', width: 100 },
    ]},
  { page: 'ticketing/report', api: '/api/sale-orders', title: '票務報表',
    columns: [
      { title: '訂單編號', dataIndex: 'name', width: 150 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ]},

  // ===== 簽證模組 =====
  { page: 'visa/detail', api: '/api/custom/visa-requirements', title: '簽證明細',
    columns: [
      { title: '國家', dataIndex: 'country', width: 150 },
      { title: '護照國', dataIndex: 'passport_country', width: 150 },
      { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
      { title: '處理天數', dataIndex: 'processing_days', width: 100 },
    ]},
  { page: 'visa/ed-card', api: '/api/custom/visa-requirements', title: '入出境卡',
    columns: [
      { title: '國家', dataIndex: 'country', width: 150 },
      { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
    ]},
  { page: 'visa/expire', api: '/api/custom/visa-requirements', title: '效期管理',
    columns: [
      { title: '國家', dataIndex: 'country', width: 150 },
      { title: '護照國', dataIndex: 'passport_country', width: 150 },
      { title: '處理天數', dataIndex: 'processing_days', width: 100 },
    ]},
  { page: 'visa/report', api: '/api/custom/visa-requirements', title: '簽證報表',
    columns: [
      { title: '國家', dataIndex: 'country', width: 150 },
      { title: '護照國', dataIndex: 'passport_country', width: 150 },
      { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
      { title: '費用', dataIndex: 'fee', width: 100 },
    ]},
];

function generateFormContent(form) {
  if (!form || form.length === 0) return '';
  const items = form.map(f => {
    const rules = f.required ? ' rules={[{ required: true }]}' : '';
    if (f.type === 'select') {
      const opts = f.options.map(o => `      <Select.Option value="${o}">${o}</Select.Option>`).join('\n');
      return `    <Form.Item name="${f.name}" label="${f.label}"${rules}>\n      <Select placeholder="請選擇">\n${opts}\n      </Select>\n    </Form.Item>`;
    }
    return `    <Form.Item name="${f.name}" label="${f.label}"${rules}><Input /></Form.Item>`;
  });
  return items.join('\n');
}

let updated = 0;
let skipped = 0;

for (const m of MAPPINGS) {
  const pagePath = path.join(APP_DIR, m.page, 'page.tsx');
  if (!fs.existsSync(pagePath)) { console.log(`SKIP: ${m.page} (不存在)`); skipped++; continue; }

  const colsStr = m.columns.map(c => `  { title: '${c.title}', dataIndex: '${c.dataIndex}', width: ${c.width} },`).join('\n');

  const hasForm = m.form && m.form.length > 0;
  const hasSelect = hasForm && m.form.some(f => f.type === 'select');
  const formStr = hasForm ? generateFormContent(m.form) : '';

  const imports = hasForm
    ? (hasSelect
      ? `import { Form, Input, Select } from 'antd';`
      : `import { Form, Input } from 'antd';`)
    : '';

  const formBlock = hasForm
    ? `\nconst formContent = (\n  <>\n${formStr}\n  </>\n);\n`
    : '';

  const formProp = hasForm ? `\n      formContent={formContent}` : '';

  const content = `'use client';
/** ${m.title} | API: ${m.api} */
import React from 'react';
${imports}
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
${colsStr}
];
${formBlock}
export default function Page() {
  return (
    <PageShell
      title="${m.title}"
      columns={columns}
      apiPath="${m.api}"
      rowKey="id"${formProp}
      searchPlaceholder="搜尋${m.title}..."
      showExport
    />
  );
}
`;

  fs.writeFileSync(pagePath, content, 'utf-8');
  updated++;
  console.log(`✅ ${m.page} → ${m.api}`);
}

console.log(`\n完成: ${updated} 頁更新, ${skipped} 頁跳過`);
