/**
 * 批次重構腳本 — 將所有頁面的 mock 資料替換為真實 API 串接
 * 
 * 執行方式：node scripts/refactor-to-api.mjs
 * 
 * 此腳本會：
 * 1. 為每個模組頁面確定對應的 apiPath
 * 2. 生成缺少的 API Route Handler 檔案
 * 3. 將所有頁面重寫為使用 PageShell + apiPath
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const API_DIR = path.join(ROOT, 'src', 'app', 'api');

// ============================
// 頁面 → API 路徑對應表
// ============================
// 格式：{ pagePath, apiPath, title, apiTable, apiType, rowKey, columns[], formFields[] }
// apiType: 'standard' (Open Proxy) | 'custom' (Custom Table)

const PAGE_MAP = [
  // ─── A. 基本資料 ───
  { page: 'master-data/passengers', api: '/api/customers', title: '旅客資料管理', table: 'customers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '客戶編號', dataIndex: 'code', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 150 },
      { title: 'Email', dataIndex: 'email', width: 180 },
      { title: '電話', dataIndex: 'phone', width: 130 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['name::名稱::required', 'email::Email', 'phone::電話', 'address::地址::textarea']
  },
  { page: 'master-data/agents', api: '/api/customers', title: '同業資料管理', table: 'customers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '同業編號', dataIndex: 'code', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 150 },
      { title: 'Email', dataIndex: 'email', width: 180 },
      { title: '電話', dataIndex: 'phone', width: 130 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['name::名稱::required', 'email::Email', 'phone::電話', 'address::地址::textarea']
  },
  { page: 'master-data/companies', api: '/api/customers', title: '機關行號客戶', table: 'customers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '公司編號', dataIndex: 'code', width: 100 },
      { title: '公司名稱', dataIndex: 'name', width: 200 },
      { title: 'Email', dataIndex: 'email', width: 180 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::公司名稱::required', 'code::統一編號', 'phone::電話', 'email::Email', 'address::地址::textarea']
  },
  { page: 'master-data/airlines', api: '/api/suppliers', title: '航空公司', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '航空代碼', dataIndex: 'code', width: 100 },
      { title: '航空名稱', dataIndex: 'name', width: 200 },
      { title: 'Email', dataIndex: 'email', width: 180 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['code::IATA 代碼::required', 'name::航空公司名稱::required', 'phone::電話', 'email::Email']
  },
  { page: 'master-data/local-agents', api: '/api/suppliers', title: '國外 Local', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
      { title: 'Email', dataIndex: 'email', width: 180 },
    ],
    form: ['name::名稱::required', 'phone::電話', 'email::Email', 'address::地址::textarea']
  },
  { page: 'master-data/visa-units', api: '/api/suppliers', title: '辦證單位', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '單位名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::單位名稱::required', 'phone::電話', 'address::地址::textarea']
  },
  { page: 'master-data/restaurants', api: '/api/suppliers', title: '餐廳管理', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '餐廳名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::餐廳名稱::required', 'phone::電話', 'address::地址::textarea']
  },
  { page: 'master-data/suppliers', api: '/api/suppliers', title: '廠商管理', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '廠商編號', dataIndex: 'code', width: 100 },
      { title: '廠商名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
      { title: 'Email', dataIndex: 'email', width: 180 },
    ],
    form: ['name::廠商名稱::required', 'code::統一編號', 'phone::電話', 'email::Email', 'address::地址::textarea']
  },
  { page: 'master-data/cruise', api: '/api/suppliers', title: '輪船公司', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '公司名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::公司名稱::required', 'phone::電話']
  },
  { page: 'master-data/car-rentals', api: '/api/suppliers', title: '租車公司', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '公司名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::公司名稱::required', 'phone::電話']
  },
  { page: 'master-data/scenic-spots', api: '/api/suppliers', title: '旅遊景點', table: 'suppliers', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '景點名稱', dataIndex: 'name', width: 200 },
      { title: '電話', dataIndex: 'phone', width: 130 },
    ],
    form: ['name::景點名稱::required', 'phone::電話', 'address::地址::textarea']
  },
  { page: 'master-data/channels', api: '/api/product-categories', title: '通路類別', table: 'product_categories', type: 'standard', rowKey: 'id',
    cols: [
      { title: '類別編號', dataIndex: 'code', width: 100 },
      { title: '通路名稱', dataIndex: 'name', width: 200 },
    ],
    form: ['code::類別編號::required', 'name::通路名稱::required']
  },
  { page: 'master-data/employees', api: '/api/hr', title: '員工管理', table: 'hr.employee', type: 'standard', rowKey: 'id',
    cols: [
      { title: '員工編號', dataIndex: 'code', width: 100 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: 'Email', dataIndex: 'work_email', width: 180 },
      { title: '電話', dataIndex: 'work_phone', width: 130 },
      { title: '部門', dataIndex: 'department_id', width: 120 },
    ],
    form: ['name::姓名::required', 'work_email::公司Email', 'work_phone::電話']
  },
  { page: 'master-data/tour-leaders', api: '/api/hr', title: '領隊及導遊', table: 'hr.employee', type: 'standard', rowKey: 'id',
    cols: [
      { title: '編號', dataIndex: 'code', width: 100 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: 'Email', dataIndex: 'work_email', width: 180 },
      { title: '電話', dataIndex: 'work_phone', width: 130 },
    ],
    form: ['name::姓名::required', 'work_email::Email', 'work_phone::電話']
  },
  { page: 'master-data/geo', api: '/api/countries', title: '洲/國/城市/機場', table: 'countries', type: 'standard', rowKey: 'id',
    cols: [
      { title: '代碼', dataIndex: 'code', width: 80 },
      { title: '名稱', dataIndex: 'name', width: 200 },
      { title: '電話區碼', dataIndex: 'phone_code', width: 100 },
    ],
    form: ['code::代碼::required', 'name::名稱::required']
  },
  { page: 'master-data/currencies', api: '/api/currencies', title: '幣別匯率', table: 'currencies', type: 'standard', rowKey: 'id',
    cols: [
      { title: '幣別代碼', dataIndex: 'name', width: 100 },
      { title: '符號', dataIndex: 'symbol', width: 60 },
      { title: '匯率', dataIndex: 'rate', width: 100 },
    ],
    form: ['name::幣別名稱::required', 'symbol::符號', 'rate::匯率']
  },
  { page: 'master-data/flights', api: '/api/custom/airline-contracts', title: '航班時刻表', table: 'airline_contracts', type: 'custom', rowKey: 'id',
    cols: [
      { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
      { title: '航空名稱', dataIndex: 'airline_name', width: 150 },
      { title: '航線', dataIndex: 'route', width: 120 },
      { title: '艙等', dataIndex: 'seat_class', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['airline_code::航空代碼::required', 'airline_name::航空名稱::required', 'route::航線', 'seat_class::艙等', 'rate::票價', 'status::狀態']
  },

  // ─── B. 訂單管理 ───
  { page: 'orders/sales', api: '/api/sale-orders', title: '業務員訂單作業', table: 'sale.order', type: 'standard', rowKey: 'id',
    cols: [
      { title: '訂單編號', dataIndex: 'name', width: 140 },
      { title: '客戶', dataIndex: 'partner_id', width: 150 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
      { title: '日期', dataIndex: 'date_order', width: 120 },
    ],
    form: ['partner_id::客戶::required', 'date_order::訂單日期', 'note::備註::textarea']
  },
  { page: 'orders/op', api: '/api/sale-orders', title: 'OP 人員訂單作業', table: 'sale.order', type: 'standard', rowKey: 'id',
    cols: [
      { title: '訂單編號', dataIndex: 'name', width: 140 },
      { title: '客戶', dataIndex: 'partner_id', width: 150 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ],
    form: ['partner_id::客戶::required', 'note::備註::textarea']
  },
  { page: 'orders/card-query', api: '/api/sale-orders', title: '信用卡刷卡查詢', table: 'sale.order', type: 'standard', rowKey: 'id',
    cols: [
      { title: '訂單編號', dataIndex: 'name', width: 140 },
      { title: '客戶', dataIndex: 'partner_id', width: 150 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ],
    form: []
  },
  { page: 'orders/payment-request', api: '/api/accounting', title: '請款單作業', table: 'account.move', type: 'standard', rowKey: 'id',
    cols: [
      { title: '單號', dataIndex: 'name', width: 140 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
    ],
    form: ['partner_id::對象::required', 'amount_total::金額', 'date::日期']
  },
  { page: 'orders/receipt', api: '/api/accounting', title: '繳款單作業', table: 'account.move', type: 'standard', rowKey: 'id',
    cols: [
      { title: '單號', dataIndex: 'name', width: 140 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ],
    form: []
  },
  { page: 'orders/group-cost', api: '/api/purchase-orders', title: '團體成本請款', table: 'purchase.order', type: 'standard', rowKey: 'id',
    cols: [
      { title: '單號', dataIndex: 'name', width: 140 },
      { title: '供應商', dataIndex: 'partner_id', width: 150 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
    ],
    form: ['partner_id::供應商::required', 'amount_total::金額']
  },

  // ─── C. 商品管理 ───
  { page: 'products/tour-template', api: '/api/custom/itinerary-templates', title: '共用基本行程', table: 'tour_itinerary_templates', type: 'custom', rowKey: 'id',
    cols: [
      { title: '行程名稱', dataIndex: 'name', width: 200 },
      { title: '目的地', dataIndex: 'destination', width: 120 },
      { title: '天數', dataIndex: 'duration_days', width: 80 },
      { title: '分類', dataIndex: 'category', width: 100 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['name::行程名稱::required', 'destination::目的地::required', 'duration_days::天數', 'category::分類', 'status::狀態', 'description::簡述::textarea']
  },
  { page: 'products/master-group', api: '/api/products', title: '基本團型管理', table: 'product.template', type: 'standard', rowKey: 'id',
    cols: [
      { title: '產品編號', dataIndex: 'default_code', width: 100 },
      { title: '產品名稱', dataIndex: 'name', width: 200 },
      { title: '售價', dataIndex: 'list_price', width: 100 },
      { title: '類別', dataIndex: 'categ_id', width: 120 },
    ],
    form: ['name::團型名稱::required', 'default_code::編號', 'list_price::售價', 'description::說明::textarea']
  },
  { page: 'products/create-group', api: '/api/custom/departure-schedules', title: '開團作業', table: 'tour_departure_schedules', type: 'custom', rowKey: 'id',
    cols: [
      { title: '團號', dataIndex: 'group_code', width: 140 },
      { title: '出發日', dataIndex: 'departure_date', width: 110 },
      { title: '回程日', dataIndex: 'return_date', width: 110 },
      { title: '售價', dataIndex: 'price', width: 100 },
      { title: '報名', dataIndex: 'current_pax', width: 80 },
      { title: '上限', dataIndex: 'max_pax', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 90 },
    ],
    form: ['group_code::團號::required', 'departure_date::出發日::required', 'return_date::回程日', 'min_pax::最低成團', 'max_pax::上限人數', 'price::售價', 'status::狀態']
  },
  { page: 'products/group-management', api: '/api/custom/departure-schedules', title: '個團及銷售管理', table: 'tour_departure_schedules', type: 'custom', rowKey: 'id',
    cols: [
      { title: '團號', dataIndex: 'group_code', width: 140 },
      { title: '出發日', dataIndex: 'departure_date', width: 110 },
      { title: '報名', dataIndex: 'current_pax', width: 80 },
      { title: '上限', dataIndex: 'max_pax', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 90 },
    ],
    form: []
  },
  { page: 'products/hotel', api: '/api/custom/hotel-contracts', title: '旅館資料管理', table: 'hotel_contracts', type: 'custom', rowKey: 'id',
    cols: [
      { title: '飯店名稱', dataIndex: 'hotel_name', width: 200 },
      { title: '城市', dataIndex: 'city', width: 100 },
      { title: '國家', dataIndex: 'country', width: 100 },
      { title: '房型', dataIndex: 'room_type', width: 80 },
      { title: '房價', dataIndex: 'rate', width: 100 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['hotel_name::飯店名稱::required', 'city::城市', 'country::國家', 'room_type::房型', 'rate::房價', 'currency::幣別', 'contract_start::合約起日', 'contract_end::合約訖日', 'status::狀態']
  },
  { page: 'products/visa-product', api: '/api/custom/visa-requirements', title: '證照及辦證文件', table: 'visa_requirements', type: 'custom', rowKey: 'id',
    cols: [
      { title: '前往國家', dataIndex: 'country', width: 120 },
      { title: '護照國籍', dataIndex: 'passport_country', width: 120 },
      { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
      { title: '處理天數', dataIndex: 'processing_days', width: 100 },
      { title: '費用', dataIndex: 'fee', width: 100 },
    ],
    form: ['country::前往國家::required', 'passport_country::護照國籍', 'visa_type::簽證類型', 'processing_days::處理天數', 'fee::費用', 'currency::幣別', 'documents_required::所需文件::textarea', 'notes::備註::textarea']
  },

  // ─── D. 團銷管理 ───
  { page: 'group-sales/control', api: '/api/custom/departure-schedules', title: '團體銷售控管', table: 'tour_departure_schedules', type: 'custom', rowKey: 'id',
    cols: [
      { title: '團號', dataIndex: 'group_code', width: 140 },
      { title: '出發日', dataIndex: 'departure_date', width: 110 },
      { title: '報名', dataIndex: 'current_pax', width: 80 },
      { title: '上限', dataIndex: 'max_pax', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 90 },
    ],
    form: []
  },

  // ─── E. 票務管理 ───
  { page: 'ticketing/import', api: '/api/custom/airline-contracts', title: '機票進票作業', table: 'airline_contracts', type: 'custom', rowKey: 'id',
    cols: [
      { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
      { title: '航空名稱', dataIndex: 'airline_name', width: 150 },
      { title: '航線', dataIndex: 'route', width: 120 },
      { title: '票價', dataIndex: 'rate', width: 100 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: ['airline_code::航空代碼::required', 'airline_name::航空名稱::required', 'route::航線', 'rate::票價', 'status::狀態']
  },
  { page: 'ticketing/detail', api: '/api/custom/airline-contracts', title: '機票明細資料', table: 'airline_contracts', type: 'custom', rowKey: 'id',
    cols: [
      { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
      { title: '航空名稱', dataIndex: 'airline_name', width: 150 },
      { title: '航線', dataIndex: 'route', width: 120 },
      { title: '艙等', dataIndex: 'seat_class', width: 80 },
      { title: '狀態', dataIndex: 'status', width: 80 },
    ],
    form: []
  },

  // ─── F. 證照管理 ───
  { page: 'visa/record', api: '/api/custom/visa-requirements', title: '旅客辦證記錄', table: 'visa_requirements', type: 'custom', rowKey: 'id',
    cols: [
      { title: '前往國家', dataIndex: 'country', width: 120 },
      { title: '護照國籍', dataIndex: 'passport_country', width: 120 },
      { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
      { title: '處理天數', dataIndex: 'processing_days', width: 100 },
    ],
    form: []
  },

  // ─── K. 帳務管理 ───
  { page: 'accounting/receivable', api: '/api/accounting', title: '應收憑單', table: 'account.move', type: 'standard', rowKey: 'id',
    cols: [
      { title: '單號', dataIndex: 'name', width: 140 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
    ],
    form: ['partner_id::客戶', 'amount_total::金額', 'date::日期']
  },
  { page: 'accounting/payable', api: '/api/accounting', title: '應付憑單', table: 'account.move', type: 'standard', rowKey: 'id',
    cols: [
      { title: '單號', dataIndex: 'name', width: 140 },
      { title: '金額', dataIndex: 'amount_total', width: 120 },
      { title: '狀態', dataIndex: 'state', width: 100 },
      { title: '日期', dataIndex: 'date', width: 120 },
    ],
    form: ['partner_id::供應商', 'amount_total::金額', 'date::日期']
  },

  // ─── N. 訊息管理 ───
  { page: 'messaging/bbs', api: '/api/announcements', title: '訊息編輯與管理', table: 'announcement', type: 'standard', rowKey: 'id',
    cols: [
      { title: '標題', dataIndex: 'name', width: 200 },
      { title: '日期', dataIndex: 'date_start', width: 120 },
      { title: '類型', dataIndex: 'announcement_type', width: 100 },
    ],
    form: ['name::標題::required', 'description::內容::textarea', 'date_start::發佈日期']
  },
  { page: 'messaging/news', api: '/api/announcements', title: '公佈欄', table: 'announcement', type: 'standard', rowKey: 'id',
    cols: [
      { title: '標題', dataIndex: 'name', width: 200 },
      { title: '日期', dataIndex: 'date_start', width: 120 },
    ],
    form: []
  },

  // ─── H. 系統設定 ───
  { page: 'settings/user-manage', api: '/api/hr', title: '員工使用者管理', table: 'hr.employee', type: 'standard', rowKey: 'id',
    cols: [
      { title: '員工編號', dataIndex: 'code', width: 100 },
      { title: '姓名', dataIndex: 'name', width: 120 },
      { title: 'Email', dataIndex: 'work_email', width: 180 },
    ],
    form: ['name::姓名::required', 'work_email::Email']
  },
];

// ============================
// 無對應 API 的頁面 — 只清除 mock，顯示空表格
// ============================
const SIMPLE_PAGES = [
  // 訂單子頁面
  { page: 'orders/payment-log', title: '支付通知紀錄' },
  { page: 'orders/batch-payment', title: '多單支付通知' },
  { page: 'orders/pay-store', title: '支付店家列表' },
  { page: 'orders/cash-setting', title: '金流網站設定' },
  { page: 'orders/batch-modify', title: '批次請款/取消' },
  { page: 'orders/card-refund', title: '刷退作業' },
  { page: 'orders/performance', title: '業績報表列印' },
  // 商品子頁面
  { page: 'products/survey', title: '意見回饋題庫' },
  { page: 'products/personal-fit', title: '個人自由行' },
  { page: 'products/group-fit', title: '團體自由行' },
  { page: 'products/hotel-profit', title: '旅館利潤管理' },
  { page: 'products/hotel-gross', title: '旅館毛利管理' },
  { page: 'products/hotel-cancel', title: '旅館後退管理' },
  { page: 'products/hotel-promo', title: '旅館預約優惠管理' },
  { page: 'products/hotel-pay-rule', title: '旅館收款規則管理' },
  { page: 'products/hotel-device', title: '旅館備品管理' },
  { page: 'products/hotel-breakfast', title: '旅館早餐管理' },
  { page: 'products/hotel-op', title: '旅館訂單 OP 設定' },
  { page: 'products/hotel-cost-dept', title: '旅館成本部門設定' },
  { page: 'products/misc-product', title: '其他旅遊商品' },
  { page: 'products/local-package', title: '當地套件及自費' },
  // 團銷
  { page: 'group-sales/report', title: '團體報表列印' },
  { page: 'group-sales/room', title: '團體分房表' },
  { page: 'group-sales/car', title: '團體派車單' },
  { page: 'group-sales/log', title: '訂單異動紀錄' },
  { page: 'group-sales/performance', title: '團體業績處理' },
  { page: 'group-sales/gov-apply', title: '出國旅遊動態申報' },
  // 票務
  { page: 'ticketing/refund', title: '退票作業維護' },
  { page: 'ticketing/area', title: '機票行程地區' },
  { page: 'ticketing/report', title: '票務報表列印' },
  { page: 'ticketing/agent-sales', title: '同業網路銷售統計' },
  { page: 'ticketing/price-notify', title: '票價修改通知' },
  { page: 'ticketing/blank-ticket', title: '空白票請領調撥' },
  // 證照
  { page: 'visa/detail', title: '交辦處理明細' },
  { page: 'visa/ed-card', title: 'ED卡/海關單' },
  { page: 'visa/expire', title: '證照到期名單' },
  { page: 'visa/report', title: '證照報表列印' },
  // 帳務
  { page: 'accounting/e-transfer', title: '電子預收代轉' },
  { page: 'accounting/e-batch', title: '電子代轉批次開立' },
  { page: 'accounting/buyer-edit', title: '買受人修改' },
  { page: 'accounting/e-print', title: '電子代轉批次列印' },
  { page: 'accounting/report', title: '帳務報表列印' },
  // 訊息
  { page: 'messaging/sms-auto', title: '自動發送設定' },
  { page: 'messaging/sms-library', title: '詞庫設定' },
  { page: 'messaging/sms-send', title: '簡訊發送' },
  { page: 'messaging/sms-promo', title: '簡訊行銷' },
  { page: 'messaging/sms-group', title: '發送對象設定' },
  { page: 'messaging/sms-schedule', title: '預約發送管理' },
  { page: 'messaging/sms-log', title: '處理記錄' },
  // 系統設定
  { page: 'settings/user-group', title: '使用者群組管理' },
  { page: 'settings/mail-list', title: '寄送郵件列表' },
  { page: 'settings/pwd-policy', title: '密碼政策設定' },
  { page: 'settings/custom-report', title: '團體自訂報表' },
  // 系統維護
  { page: 'maintenance/clear-group', title: '清除團體資料' },
  { page: 'maintenance/clear-ticket', title: '清除機票資料' },
  { page: 'maintenance/clear-pax', title: '清除旅客個資' },
  // 基本資料特殊頁
  { page: 'master-data/travel-info', title: '旅遊輔助資訊' },
  { page: 'master-data/image-library', title: '圖庫管理' },
  { page: 'master-data/export', title: '資料匯出' },
  // 出勤
  { page: 'master-data/attendance', title: '出勤總覽' },
  { page: 'master-data/attendance/leave', title: '差假狀況表' },
  { page: 'master-data/attendance/clock', title: '刷卡狀況表' },
  { page: 'master-data/attendance/summary', title: '考勤狀況表' },
  { page: 'master-data/attendance/emp-swap', title: '業務員替換' },
];

// ============================
// 生成頁面程式碼
// ============================
function generateFormField(fieldStr) {
  const parts = fieldStr.split('::');
  const name = parts[0];
  const label = parts[1] || name;
  const isRequired = parts[2] === 'required';
  const isTextarea = parts[2] === 'textarea' || parts[3] === 'textarea';
  
  if (isTextarea) {
    return `    <Form.Item name="${name}" label="${label}"${isRequired ? ' rules={[{ required: true }]}' : ''}><Input.TextArea rows={2} /></Form.Item>`;
  }
  return `    <Form.Item name="${name}" label="${label}"${isRequired ? ' rules={[{ required: true }]}' : ''}><Input /></Form.Item>`;
}

function generateApiPage(config) {
  const hasForm = config.form && config.form.length > 0;
  const colsDef = config.cols.map(c => 
    `  { title: '${c.title}', dataIndex: '${c.dataIndex}', width: ${c.width} },`
  ).join('\n');

  const formContent = hasForm ? `\nconst formContent = (\n  <>\n${config.form.map(f => generateFormField(f)).join('\n')}\n  </>\n);\n` : '';

  return `'use client';
/** ${config.title} | API: ${config.api} */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
${colsDef}
];
${formContent}
export default function Page() {
  return (
    <PageShell
      title="${config.title}"
      columns={columns}
      apiPath="${config.api}"
      rowKey="${config.rowKey}"${hasForm ? '\n      formContent={formContent}' : ''}
      searchPlaceholder="搜尋${config.title}..."
      showExport
    />
  );
}
`;
}

function generateSimplePage(config) {
  return `'use client';
/** ${config.title} */
import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '編號', dataIndex: 'id', width: 100 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '狀態', dataIndex: 'status', width: 100 },
  { title: '日期', dataIndex: 'create_date', width: 120 },
];

export default function Page() {
  return (
    <PageShell
      title="${config.title}"
      columns={columns}
      dataSource={[]}
      rowKey="id"
      searchPlaceholder="搜尋${config.title}..."
    />
  );
}
`;
}

// ============================
// 執行
// ============================
let created = 0;
let updated = 0;
let skipped = 0;

// 1) 有 API 對應的頁面
for (const config of PAGE_MAP) {
  const pagePath = path.join(APP_DIR, config.page, 'page.tsx');
  const dir = path.dirname(pagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const code = generateApiPage(config);
  fs.writeFileSync(pagePath, code, 'utf8');
  updated++;
  console.log(`[API] ${config.page} → ${config.api}`);
}

// 2) 無 API 對應的頁面（空表格）
for (const config of SIMPLE_PAGES) {
  const pagePath = path.join(APP_DIR, config.page, 'page.tsx');
  const dir = path.dirname(pagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const code = generateSimplePage(config);
  fs.writeFileSync(pagePath, code, 'utf8');
  updated++;
  console.log(`[EMPTY] ${config.page}`);
}

// 3) 刪除 mock 目錄
const mockDir = path.join(ROOT, 'src', 'mock');
if (fs.existsSync(mockDir)) {
  fs.rmSync(mockDir, { recursive: true, force: true });
  console.log('\n[DELETED] src/mock/ 目錄已移除');
}

console.log(`\n=== 完成 ===`);
console.log(`已更新: ${updated} 個頁面`);
console.log(`跳過 (特殊頁面): login, page.tsx (dashboard), password`);
