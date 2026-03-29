/**
 * AI GO 串接共用型別定義
 */

// ============================
// Proxy API 查詢型別
// ============================

/** 過濾器運算子 */
export type FilterOp =
  | 'eq' | 'ne'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'like' | 'ilike'
  | 'is_null' | 'is_not_null'
  | 'in';

/** 單一過濾條件 */
export interface QueryFilter {
  column: string;
  op: FilterOp;
  value?: unknown;
}

/** 排序條件 */
export interface QueryOrderBy {
  column: string;
  direction: 'asc' | 'desc';
}

/** 進階查詢參數 */
export interface ProxyQueryOptions {
  /** 過濾條件（AND 邏輯）*/
  filters?: QueryFilter[];
  /** 排序 */
  order_by?: QueryOrderBy[];
  /** 全文搜尋關鍵字 */
  search?: string;
  /** 搜尋欄位（預設全部非 id 欄位）*/
  search_columns?: string[];
  /** 選擇特定欄位回傳 */
  select_columns?: string[];
  /** 每頁筆數 */
  limit?: number;
  /** 跳過筆數（分頁用）*/
  offset?: number;
  /** 僅回傳總筆數 */
  count_only?: boolean;
}

/** 簡單查詢參數（GET 用）*/
export interface SimpleQueryParams {
  limit?: number;
  offset?: number;
}

/** 計數回應 */
export interface CountResponse {
  total: number;
}

/** Proxy 新增回應 */
export interface ProxyCreateResponse {
  id: string;
  created_at: string;
  data: Record<string, unknown>;
}

/** Proxy 更新回應 */
export interface ProxyUpdateResponse {
  id: string;
  updated: boolean;
}

// ============================
// 認證相關型別
// ============================

/** One-Time Code Launch 回應 */
export interface LaunchResponse {
  redirect_url: string;
  code: string;
  expires_in: number;
}

/** Token Exchange 回應 */
export interface TokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/** Token Refresh 回應 */
export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  app_id: string;
}

// ============================
// custom_data JSON Schema 型別
// ============================

/** 客戶旅遊擴展資料（存於 customers.custom_data）*/
export interface CustomerTravelData {
  passport_no?: string;
  passport_expiry?: string;
  gender?: string;
  nationality?: string;
  travel_interest?: string;
  budget_level?: string;
  source_channel?: string;
  industry_type?: string;
}

/** 供應商旅遊擴展資料（存於 suppliers.custom_data）*/
export interface SupplierTravelData {
  supplier_subtype?: 'airline' | 'hotel' | 'restaurant' | 'car_rental' | 'cruise' | 'local_agent' | 'visa_unit';
  airline_code?: string;
  star_rating?: number;
  region_code?: string;
  domestic_flag?: boolean;
}

/** 銷售訂單旅遊擴展資料（存於 sale_orders.custom_data）*/
export interface SaleOrderTravelData {
  /** 產品類型（用 custom_data 區分，因主表 type 已被系統佔用）*/
  product_type?: 'group' | 'ticket' | 'fit' | 'hotel' | 'visa' | 'other';
  group_code?: string;
  departure_date?: string;
  return_date?: string;
  destination_area?: string;
  op_handler_id?: string;
  tour_leader_id?: string;
  passenger_count?: number;
  /** 團體狀態 */
  group_status?: 'planning' | 'booking' | 'confirmed' | 'full' | 'cancelled' | 'departed' | 'closed';
  seats_total?: number;
  seats_booked?: number;
  seats_reserved?: number;
  template_product_id?: string;
  tour_product_id?: string;
  airline_code?: string;
  flight_out?: string;
  flight_back?: string;
  /** 分房（內嵌陣列）*/
  rooms?: GroupRoom[];
  /** 派車（內嵌陣列）*/
  vehicles?: GroupVehicle[];
  /** 業績分配（內嵌陣列）*/
  performance?: GroupPerformance[];
  /** 旅客意見回饋 */
  survey?: {
    overall_rating?: number;
    tour_leader_rating?: number;
    hotel_rating?: number;
    food_rating?: number;
    comment?: string;
    submitted_at?: string;
  };
}

/** 員工旅遊擴展資料（存於 hr_employees.custom_data）*/
export interface EmployeeTravelData {
  employee_subtype?: 'employee' | 'tour_leader' | 'guide' | 'driver';
  tour_sort_order?: number;
  insurance_type?: string;
  guide_license_no?: string;
}

/** 團體分房資料（內嵌於 travel_groups.custom_data.rooms）*/
export interface GroupRoom {
  hotel_supplier_id?: string;
  hotel_name?: string;
  room_type?: string;
  room_count?: number;
  check_in?: string;
  check_out?: string;
  unit_price?: number;
  total_price?: number;
  confirmation_no?: string;
}

/** 團體派車資料（內嵌於 travel_groups.custom_data.vehicles）*/
export interface GroupVehicle {
  vehicle_supplier_id?: string;
  vehicle_type?: string;
  vehicle_count?: number;
  use_date?: string;
  driver_name?: string;
  driver_phone?: string;
  unit_price?: number;
  remark?: string;
}

/** 團體業績分配（內嵌於 travel_groups.custom_data.performance）*/
export interface GroupPerformance {
  employee_id?: string;
  role_type?: 'sales' | 'op' | 'leader';
  share_percent?: number;
  share_amount?: number;
  remark?: string;
}

/** 團體 custom_data 完整結構 */
export interface TravelGroupCustomData {
  rooms?: GroupRoom[];
  vehicles?: GroupVehicle[];
  performance?: GroupPerformance[];
}

/** 旅館房型（內嵌於 hotels.custom_data.room_types）*/
export interface HotelRoomType {
  code?: string;
  name?: string;
  max_occupancy?: number;
  base_price?: number;
}

/** 旅館定價規則（內嵌於 hotels.custom_data.pricing）*/
export interface HotelPricing {
  room_type?: string;
  season?: 'peak' | 'off_peak' | 'normal';
  valid_from?: string;
  valid_to?: string;
  price?: number;
  margin_percent?: number;
  cancel_policy?: string;
}

/** 旅館 custom_data 完整結構 */
export interface HotelCustomData {
  room_types?: HotelRoomType[];
  pricing?: HotelPricing[];
}

/** 簽證文件明細（內嵌於 visa_applications.custom_data.items）*/
export interface VisaDocumentItem {
  document_type?: string;
  received?: boolean;
  received_date?: string;
  remark?: string;
}

/** ED 卡資料（內嵌於 visa_applications.custom_data.ed_cards）*/
export interface EdCard {
  country?: string;
  card_type?: 'entry' | 'departure' | 'customs';
  data?: Record<string, unknown>;
}

/** 簽證 custom_data 完整結構 */
export interface VisaCustomData {
  items?: VisaDocumentItem[];
  ed_cards?: EdCard[];
}

// ============================
// v4 產品映射 custom_data 型別
// （原 Custom Table → product_templates.custom_data）
// ============================

/** 行程範本 custom_data（product_templates, product_type='tour'）*/
export interface TourProductData {
  product_type: 'tour';
  area_code?: string;
  country_code?: string;
  days?: number;
  nights?: number;
  highlights?: string;
  itinerary?: Array<{ day: number; title: string; description?: string }>;
  tour_status?: 'active' | 'archived';
}

/** 團型範本 custom_data（product_templates, product_type='group_template'）*/
export interface GroupTemplateProductData {
  product_type: 'group_template';
  tour_product_id?: string;
  base_price_adult?: number;
  base_price_child?: number;
  min_group_size?: number;
  max_group_size?: number;
  airline_code?: string;
  hotel_level?: string;
}

/** 自由行 custom_data（product_templates, product_type='fit'）*/
export interface FitProductData {
  product_type: 'fit';
  destination?: string;
  days?: number;
  nights?: number;
  includes_flight?: boolean;
  includes_hotel?: boolean;
  description?: string;
  fit_status?: 'active' | 'archived';
}

/** 自費活動 custom_data（product_templates, product_type='activity'）*/
export interface ActivityProductData {
  product_type: 'activity';
  area_code?: string;
  city_code?: string;
  duration_hours?: number;
  min_persons?: number;
  description?: string;
  activity_status?: 'active' | 'archived';
}

/** 其他旅遊商品 custom_data（product_templates, product_type='misc'）*/
export interface MiscProductData {
  product_type: 'misc';
  product_category?: 'wifi' | 'ticket' | 'insurance' | 'other';
  supplier_id?: string;
  valid_from?: string;
  valid_to?: string;
  description?: string;
  misc_status?: 'active' | 'archived';
}

/** 所有旅遊產品 custom_data 聯合型別 */
export type TravelProductData =
  | TourProductData
  | GroupTemplateProductData
  | FitProductData
  | ActivityProductData
  | MiscProductData;

/** 機票明細 custom_data（product_products）*/
export interface TicketInventoryData {
  ticket_no?: string;
  airline_code?: string;
  route?: string;
  flight_date?: string;
  flight_no?: string;
  booking_class?: string;
  fare?: number;
  tax?: number;
  cost?: number;
  issued_date?: string;
  ticket_status?: 'sold' | 'unsold' | 'refunded' | 'voided';
  passenger_name?: string;
  customer_id?: string;
  import_purchase_id?: string;
}

/** 進票批次 custom_data（purchase_orders）*/
export interface TicketImportData {
  import_code?: string;
  airline_code?: string;
  total_tickets?: number;
  handler_id?: string;
  import_status?: 'draft' | 'confirmed' | 'closed';
}

/** 退票 custom_data（account_moves）*/
export interface TicketRefundData {
  ticket_product_id?: string;
  ticket_no?: string;
  refund_amount?: number;
  penalty?: number;
  net_refund?: number;
  reason?: string;
  handler_id?: string;
  refund_status?: 'pending' | 'approved' | 'completed';
}

/** 刷卡交易 custom_data（account_payments）*/
export interface CcTransactionData {
  card_type?: 'visa' | 'master' | 'jcb' | 'amex';
  card_last4?: string;
  auth_code?: string;
  installments?: number;
  settlement_date?: string;
  cc_status?: 'success' | 'failed' | 'refunded';
}

/** 旅客報名/辦證明細 custom_data（sale_order_lines）*/
export interface PassengerLineData {
  passenger_type?: 'adult' | 'child' | 'infant';
  passport_no?: string;
  passport_expiry?: string;
  room_type?: string;
  room_partner?: string;
  meal_request?: string;
  seat_preference?: string;
  insurance_status?: string;
}

/** 辦證明細 custom_data（sale_order_lines, type='visa'）*/
export interface VisaLineData {
  line_type: 'visa';
  application_code?: string;
  visa_type?: 'passport' | 'visa' | 'entry_permit' | 'other';
  destination_country?: string;
  apply_date?: string;
  submit_date?: string;
  approve_date?: string;
  expire_date?: string;
  visa_unit_supplier_id?: string;
  visa_status?: 'received' | 'submitted' | 'approved' | 'returned' | 'rejected';
  handler_id?: string;
  items?: VisaDocumentItem[];
  ed_cards?: EdCard[];
}

// ============================
// 業務資料型別（對應 AI GO 既有表）
// ============================

/** 基礎欄位（所有表共有）*/
interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

/** 客戶（custom_data 含旅遊擴展欄位）*/
export interface Customer extends BaseRecord {
  name: string;
  customer_type?: string;
  short_name?: string;
  birthday?: string;
  id_number?: string;
  phone?: string;
  email?: string;
  vat?: string;
  credit_limit?: number;
  country_id?: string;
  level_id?: string;
  salesperson_id?: string;
  contact_person?: string;
  status?: string;
  custom_data?: CustomerTravelData;
}

/** 客戶等級 */
export interface CustomerLevel extends BaseRecord {
  name: string;
  discount_rate?: number;
}

/** 供應商（custom_data 含旅遊擴展欄位）*/
export interface Supplier extends BaseRecord {
  name: string;
  supplier_type?: string;
  ref?: string;
  vat?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  fax?: string;
  registered_address?: string;
  contact_address?: string;
  city?: string;
  country_id?: string;
  state_id?: string;
  credit_limit?: number;
  currency_id?: string;
  status?: string;
  custom_data?: SupplierTravelData;
}

/** 產品範本 */
export interface ProductTemplate extends BaseRecord {
  name: string;
  type?: string;
  list_price?: number;
  standard_price?: number;
  barcode?: string;
  sale_ok?: boolean;
  purchase_ok?: boolean;
}

/** 產品變體 */
export interface ProductProduct extends BaseRecord {
  product_tmpl_id?: string;
  default_code?: string;
  barcode?: string;
  lst_price_extra?: number;
  standard_price?: number;
}

/** 產品分類 */
export interface ProductCategory extends BaseRecord {
  name: string;
  parent_id?: string;
  cost_method?: string;
  valuation?: string;
}

/** 銷售訂單（custom_data 含旅遊擴展欄位）*/
export interface SaleOrder extends BaseRecord {
  name?: string;
  state?: string;
  date_order?: string;
  amount_untaxed?: number;
  amount_tax?: number;
  amount_total?: number;
  margin?: number;
  customer_id?: string;
  currency_id?: string;
  payment_term_id?: string;
  user_id?: string;
  department_id?: string;
  invoice_format?: string;
  carrier_type?: string;
  maker_id?: string;
  approver_id?: string;
  custom_data?: SaleOrderTravelData;
}

/** 銷售訂單明細 */
export interface SaleOrderLine extends BaseRecord {
  order_id?: string;
  product_id?: string;
  product_uom_qty?: number;
  price_unit?: number;
  discount?: number;
  margin?: number;
  tax_id?: string;
  delivery_date?: string;
}

/** 採購訂單 */
export interface PurchaseOrder extends BaseRecord {
  name?: string;
  state?: string;
  date_order?: string;
  amount_total?: number;
  partner_id?: string;
  department_id?: string;
  tax_type?: string;
  maker_id?: string;
  approver_id?: string;
}

/** 採購訂單明細 */
export interface PurchaseOrderLine extends BaseRecord {
  order_id?: string;
  product_id?: string;
  product_qty?: number;
  price_unit?: number;
  qty_received?: number;
  qty_invoiced?: number;
}

/** 傳票（Account Move）*/
export interface AccountMove extends BaseRecord {
  name?: string;
  move_type?: string;
  state?: string;
  date?: string;
  amount_total?: number;
  amount_residual?: number;
  payment_state?: string;
  journal_id?: string;
  partner_id?: string;
  voucher_number?: string;
}

/** 傳票明細行 */
export interface AccountMoveLine extends BaseRecord {
  move_id?: string;
  debit?: number;
  credit?: number;
  balance?: number;
  account_id?: string;
  tax_rate?: number;
  reconciled?: boolean;
  analytic_account_id?: string;
}

/** 付款/收款 */
export interface AccountPayment extends BaseRecord {
  payment_type?: string;
  amount?: number;
  partner_type?: string;
  method_id?: string;
  move_id?: string;
  partner_id?: string;
  state?: string;
}

/** 會計科目 */
export interface AccountAccount extends BaseRecord {
  code?: string;
  name: string;
  account_type?: string;
  parent_id?: string;
  level?: number;
}

/** 日記帳 */
export interface AccountJournal extends BaseRecord {
  name: string;
  code?: string;
  type?: string;
  default_account_id?: string;
}

/** 稅額 */
export interface AccountTax extends BaseRecord {
  name: string;
  type_tax_use?: string;
  amount_type?: string;
  amount?: number;
  price_include?: boolean;
}

/** 員工（custom_data 含旅遊擴展欄位）*/
export interface HrEmployee extends BaseRecord {
  name: string;
  department_id?: string;
  job_id?: string;
  gender?: string;
  birthday?: string;
  passport_id?: string;
  identification_id?: string;
  marital?: string;
  pin?: string;
  custom_data?: EmployeeTravelData;
}

/** 部門 */
export interface HrDepartment extends BaseRecord {
  name: string;
  parent_id?: string;
}

/** 出勤打卡 */
export interface HrAttendance extends BaseRecord {
  employee_id?: string;
  check_in?: string;
  check_out?: string;
  worked_hours?: number;
  overtime_hours?: number;
}

/** 請假單 */
export interface HrLeave extends BaseRecord {
  employee_id?: string;
  holiday_status_id?: string;
  date_from?: string;
  date_to?: string;
  state?: string;
}

/** CRM 商機 */
export interface CrmLead extends BaseRecord {
  name: string;
  probability?: number;
  expected_revenue?: number;
  stage_id?: string;
  partner_id?: string;
  user_id?: string;
}

/** 國家 */
export interface Country extends BaseRecord {
  name: string;
  code?: string;
  phone_code?: string;
  currency_id?: string;
}

/** 幣別 */
export interface Currency extends BaseRecord {
  name: string;
  symbol?: string;
  decimal_places?: number;
}

/** 匯率 */
export interface CurrencyRate extends BaseRecord {
  currency_id?: string;
  name?: string;
  rate?: number;
}

/** 公告 */
export interface Announcement extends BaseRecord {
  title?: string;
  content?: string;
  announcement_type?: string;
  priority?: string;
  is_published?: boolean;
}
