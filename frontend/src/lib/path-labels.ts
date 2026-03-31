/**
 * 路徑中文名稱映射（共用）
 *
 * 將 URL 路徑片段映射為中文顯示名稱。
 * 統一供 Header 麵包屑、Sidebar 等元件使用，避免重複維護。
 */

const PATH_LABELS: Record<string, string> = {
  // 頂層模組
  'master-data': '基本資料',
  orders: '訂單管理',
  products: '商品管理',
  'group-sales': '團銷管理',
  ticketing: '票務管理',
  visa: '證照管理',
  accounting: '帳務管理',
  messaging: '訊息管理',
  settings: '系統設定',
  maintenance: '系統維護',

  // A. 基本資料子頁面
  passengers: '旅客資料管理',
  agents: '同業資料管理',
  companies: '機關行號客戶',
  airlines: '航空公司',
  employees: '員工管理',
  'tour-leaders': '領隊及導遊',
  geo: '地理資訊',
  currencies: '幣別匯率',
  flights: '航班時刻表',
  'travel-info': '旅遊輔助資訊',
  'image-library': '圖庫管理',
  attendance: '員工出勤',
  'local-agents': '國外 Local',
  'visa-units': '辦證單位',
  restaurants: '餐廳管理',
  suppliers: '廠商管理',
  cruise: '輪船公司',
  'car-rentals': '租車公司',
  'scenic-spots': '旅遊景點',
  channels: '通路類別',
  export: '資料匯出',
  password: '個人密碼修改',

  // B. 訂單管理子頁面
  sales: '業務員訂單作業',
  op: 'OP 人員訂單作業',
  'card-query': '信用卡刷卡查詢',
  'payment-request': '請款單作業',
  receipt: '繳款單作業',
  'group-cost': '團體成本請款',
  'payment-log': '支付通知紀錄',
  'batch-payment': '多單支付通知',
  'pay-store': '支付店家列表',
  'cash-setting': '金流網站設定',
  'batch-modify': '批次請款/取消',
  'card-refund': '刷退作業',
  performance: '業績報表列印',

  // C. 商品管理子頁面
  'tour-template': '共用基本行程',
  survey: '意見回饋題庫',
  'master-group': '基本團型管理',
  'create-group': '開團作業',
  'group-management': '個團及銷售管理',
  'personal-fit': '個人自由行',
  'group-fit': '團體自由行',
  hotel: '旅館管理',
  'hotel-profit': '利潤管理',
  'hotel-gross': '毛利管理',
  'hotel-cancel': '後退管理',
  'hotel-promo': '預約優惠管理',
  'hotel-pay-rule': '收款規則管理',
  'hotel-device': '備品管理',
  'hotel-breakfast': '早餐管理',
  'hotel-op': '訂單 OP 設定',
  'hotel-cost-dept': '成本部門設定',
  'visa-product': '證照及辦證文件',
  'misc-product': '其他旅遊商品',
  'local-package': '當地套件及自費',

  // D. 團銷管理子頁面
  control: '團體銷售控管',
  room: '團體分房表',
  car: '團體派車單',
  log: '訂單異動紀錄',
  'gov-apply': '出國旅遊動態申報',

  // E. 票務管理子頁面
  import: '機票進票作業',
  detail: '機票明細資料',
  refund: '退票作業維護',
  area: '機票行程地區',
  report: '報表列印',
  'agent-sales': '同業網路銷售統計',
  'price-notify': '票價修改通知',
  'blank-ticket': '空白票請領調撥',

  // F. 證照管理子頁面
  record: '旅客辦證記錄',
  'ed-card': 'ED卡/海關單',
  expire: '證照到期名單',

  // K. 帳務管理子頁面
  receivable: '應收憑單',
  payable: '應付憑單',
  'e-transfer': '電子預收代轉',
  'e-batch': '電子代轉批次開立',
  'buyer-edit': '買受人修改',
  'e-print': '電子代轉批次列印',

  // N. 訊息管理子頁面
  bbs: '訊息編輯與管理',
  news: '公佈欄',
  'sms-auto': '自動發送設定',
  'sms-library': '詞庫設定',
  'sms-send': '簡訊發送',
  'sms-promo': '簡訊行銷',
  'sms-group': '發送對象設定',
  'sms-schedule': '預約發送管理',
  'sms-log': '處理記錄',

  // H. 系統設定子頁面
  'user-group': '使用者群組管理',
  'user-manage': '員工使用者管理',
  'mail-list': '寄送郵件列表',
  'pwd-policy': '密碼政策設定',
  'custom-report': '團體自訂報表',

  // Z. 系統維護子頁面
  'clear-group': '清除團體資料',
  'clear-ticket': '清除機票資料',
  'clear-pax': '清除旅客個資',

  // 其他
  leave: '差假狀況表',
  clock: '刷卡狀況表',
  summary: '考勤狀況表',
  'emp-swap': '業務員替換',
  login: '登入',
};

/**
 * 取得路徑片段的中文名稱
 * @param segment URL 路徑片段（如 'passengers'、'master-data'）
 * @returns 中文名稱，若無對應則回傳原始片段
 */
export function getPathLabel(segment: string): string {
  return PATH_LABELS[segment] || segment;
}
