/**
 * 訂單管理模組 — TypeScript 型別定義
 * 對應舊系統 B. 訂單管理 (13 頁)
 */

// ─── B1. 訂單主檔 ──────────────────────────────────
// === [DB] 表: orders === 來源: L_order.asp ===
export type ProductType = '團體' | '機票' | '套旅' | '旅館' | '證照' | '其他' | '自費';
export type OrderStatus = '報名' | '確認' | '取消' | '完成' | '待付款';

export interface Order {
  ORD_NO: string;          // 訂單編號 (PK)
  OP_SQ: number;           // 作業序號
  PROD_TP: ProductType;    // 產品類別
  PAX_CD: string;          // 旅客 (FK → passengers)
  AGT_CD: string;          // 同業 (FK → agents)
  COMP_CD: string;         // 機關行號 (FK → companies)
  GRUP_CD: string;         // 團號 (FK → groups)
  DEP_DT: string;          // 出發日
  RTN_DT: string;          // 回程日
  AREA_CD: string;         // 旅遊地區 (FK → areas)
  AMT: number;             // 金額
  EMP_CD: string;          // 業務員 (FK → employees)
  OP_EMP_CD: string;       // OP 承辦 (FK → employees)
  ORD_STUS: OrderStatus;   // 訂單狀態
  CRT_DT: string;          // 建立時間
  UPD_DT: string;          // 更新時間
}

// === [API] GET /api/orders ===
// 支援業務員視角與 OP 視角切換
export interface OrderFilter {
  prod_tp?: ProductType;
  pax_cd?: string;
  pax_nm?: string;
  id_no?: string;
  agt_cd?: string;
  comp_cd?: string;
  emp_cd?: string;
  op_emp_cd?: string;
  grup_cd?: string;
  area_cd?: string;
  dep_dt_from?: string;
  dep_dt_to?: string;
  ord_stus?: OrderStatus;
  page?: number;
  page_size?: number;
}


// ─── B3. 信用卡交易 ──────────────────────────────────
// === [DB] 表: credit_card_transactions === 來源: L_cardquery.asp ===
export interface CreditCardTransaction {
  CARD_TXN_ID: number;     // PK (IDENTITY)
  ORD_NO: string;          // FK → orders
  CARD_NO: string;         // 卡號 (遮蔽顯示)
  CARD_HOLDER: string;     // 持卡人
  AUTH_CD: string;         // 授權碼
  AUTH_DT: string;         // 授權日期
  AUTH_AMT: number;        // 授權金額
  AUTH_STUS: string;       // 授權狀態
}


// ─── B4. 請款單 ──────────────────────────────────
// === [DB] 表: payment_requests === 來源: L_outpord.asp ===
export interface PaymentRequest {
  OUTPORD_NO: string;      // PK
  ACCT_NOP: string;        // 應付帳號
  DEPT_CD: string;         // 部門 (FK)
  AMT: number;             // 金額
  PAY_DT: string;          // 付款日
  OUTPORD_STUS: string;    // 狀態
}


// ─── B5. 繳款單 ──────────────────────────────────
// === [DB] 表: receipts === 來源: L_kord.asp ===
export interface Receipt {
  KORD_NO: string;         // PK
  ACCT_NOR: string;        // 應收帳號
  AMT: number;             // 金額
  RCV_DT: string;          // 收款日
  KORD_STUS: string;       // 狀態
}


// ─── B6. 團體成本請款 ──────────────────────────────────
// === [DB] 表: group_cost_requests === 來源: L_GRUP_TR.asp ===
export interface GroupCostRequest {
  GRUP_CD: string;
  COST_TP: string;
  COST_AMT: number;
  SUPPLIER: string;
  REQ_DT: string;
}


// ─── B7-B11. 線上支付 ──────────────────────────────────
export interface PaymentLog {
  PAY_LOG_ID: number;
  STORE_ORD_NO: string;
  AMT: number;
  PAY_STUS: string;
  PAY_DT: string;
}

export interface PayStore {
  STORE_CD: string;
  STORE_NM: string;
  MERCHANT_ID: string;
}

export interface CashFlowSetting {
  COMP_CD: string;
  GATEWAY_TP: string;
  API_KEY: string;
  MERCHANT_CD: string;
}


// ─── B12. 刷退 ──────────────────────────────────
export interface CardRefund {
  REFUND_NO: string;
  ORD_NO: string;
  CARD_NO: string;
  REFUND_AMT: number;
  REFUND_DT: string;
}
