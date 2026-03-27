/**
 * 常數定義
 * 狀態映射、顏色、選單選項等
 */

/** 旅客往來狀態選項 */
export const PAX_STATUS_OPTIONS = [
  { label: '正常', value: '正常' },
  { label: '留意', value: '留意' },
  { label: '暫停', value: '暫停' },
  { label: '離職', value: '離職' },
];

/** 旅客往來狀態顏色 */
export const PAX_STATUS_COLOR: Record<string, string> = {
  '正常': 'green',
  '留意': 'orange',
  '暫停': 'red',
  '離職': 'default',
};

/** 訂單狀態選項 */
export const ORDER_STATUS_OPTIONS = [
  { label: '報名', value: '報名' },
  { label: '確認', value: '確認' },
  { label: '取消', value: '取消' },
  { label: '完成', value: '完成' },
  { label: '待付款', value: '待付款' },
];

/** 訂單狀態顏色 */
export const ORDER_STATUS_COLOR: Record<string, string> = {
  '報名': 'blue',
  '確認': 'green',
  '取消': 'red',
  '完成': 'cyan',
  '待付款': 'orange',
};

/** 產品類別選項 */
export const PRODUCT_TYPE_OPTIONS = [
  { label: '團體', value: '團體' },
  { label: '機票', value: '機票' },
  { label: '套旅', value: '套旅' },
  { label: '旅館', value: '旅館' },
  { label: '證照', value: '證照' },
  { label: '其他', value: '其他' },
  { label: '自費', value: '自費' },
];

/** 團體銷售狀態 */
export const SALE_STATUS_OPTIONS = [
  { label: '規劃中', value: '規劃中' },
  { label: '收客中', value: '收客中' },
  { label: '確認', value: '確認' },
  { label: '額滿', value: '額滿' },
  { label: '取消', value: '取消' },
  { label: '已出團', value: '已出團' },
  { label: '結團', value: '結團' },
];

/** 團體銷售狀態顏色 */
export const SALE_STATUS_COLOR: Record<string, string> = {
  '規劃中': 'default',
  '收客中': 'processing',
  '確認': 'success',
  '額滿': 'warning',
  '取消': 'error',
  '已出團': 'cyan',
  '結團': 'purple',
};

/** 機票狀態 */
export const TICKET_STATUS_OPTIONS = [
  { label: '已售', value: '已售' },
  { label: '未售', value: '未售' },
  { label: '退票', value: '退票' },
  { label: '作廢', value: '作廢' },
];

/** 機票狀態顏色 */
export const TICKET_STATUS_COLOR: Record<string, string> = {
  '已售': 'green',
  '未售': 'blue',
  '退票': 'orange',
  '作廢': 'red',
};

/** 證照辦理狀態 */
export const VISA_STATUS_OPTIONS = [
  { label: '接件', value: '接件' },
  { label: '送件', value: '送件' },
  { label: '核准', value: '核准' },
  { label: '還件', value: '還件' },
  { label: '退件', value: '退件' },
  { label: '暫收', value: '暫收' },
  { label: '退還', value: '退還' },
];

/** 證照狀態顏色 */
export const VISA_STATUS_COLOR: Record<string, string> = {
  '接件': 'blue',
  '送件': 'processing',
  '核准': 'green',
  '還件': 'cyan',
  '退件': 'red',
  '暫收': 'orange',
  '退還': 'default',
};

/** 員工狀態 */
export const EMP_STATUS_OPTIONS = [
  { label: '在職', value: '在職' },
  { label: '留停', value: '留停' },
  { label: '離職', value: '離職' },
];

/** 性別選項 */
export const SEX_OPTIONS = [
  { label: '男', value: 'M' },
  { label: '女', value: 'F' },
];

/** 每頁預設筆數 */
export const DEFAULT_PAGE_SIZE = 20;

/** 分頁選項 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
