/**
 * 通用型別定義
 * 分頁、API 回傳、表格等共用介面
 */

/** 分頁請求參數 */
export interface PaginationParams {
  page: number;
  page_size: number;
}

/** 分頁回傳結構 */
// === [API] 所有列表 API 統一回傳此結構 ===
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

/** 表格欄位排序 */
export interface SortParams {
  field: string;
  order: 'ascend' | 'descend' | null;
}

/** 通用的 CRUD 操作回傳 */
// === [API] 所有 POST/PUT/DELETE 統一回傳 ===
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

/** 側邊選單項目 */
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

/** 狀態顏色映射 */
export type StatusColorMap = Record<string, string>;
