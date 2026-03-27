/**
 * 票務管理模組 — TypeScript 型別定義
 * 對應舊系統 E. 票務管理 (8 頁)
 */

// ─── E1. 機票進票 ──────────────────────────────────
// === [DB] 表: ticket_imports === 來源: L_inticket.asp ===
export interface TicketImport {
  INTKT_NO: string;        // PK
  CARR_CD: string;         // 航空公司 (FK → airlines)
  ACCT_NOP: string;        // 廠商帳號
  ITKT_NO_S: string;       // 起始票號
  ITKT_NO_E: string;       // 終止票號
  QTY: number;             // 數量
  INTKT_DT: string;        // 進票日期
  DEPT_CD: string;         // 部門
  COMP_CD: string;         // 公司
  GRUP_CD: string;         // 團號 (FK → groups)
}

// ─── E2. 機票明細 ──────────────────────────────────
// === [DB] 表: ticket_details === 來源: L_ticketd.asp ===
export type TicketStatus = '已售' | '未售' | '退票' | '作廢';

export interface TicketDetail {
  TKT_NO: string;          // 票號 (PK)
  OP_SQ: number;           // 作業序號
  PAX_ENM: string;         // 旅客英文名
  TKT_ST: TicketStatus;    // 狀態
  CARR_CD: string;         // 航空公司 (FK)
  FLT_NO: string;          // 航班號
  DEP_DT: string;          // 出發日
  ROUTE: string;           // 行程
  FARE: number;            // 票價
  TAX: number;             // 稅金
}

// ─── E3. 退票作業 ──────────────────────────────────
// === [DB] 表: ticket_refunds === 來源: L_rord.asp ===
export type RefundStatus = '未處理' | '完成' | '取消' | '處理中';

export interface TicketRefund {
  RORD_NO: string;         // PK
  TKT_NO: string;          // FK → ticket_details
  RORD_DT: string;         // 退票日期
  OP_ST: RefundStatus;     // 狀態
  REFUND_AMT: number;      // 退款金額
  PENALTY: number;         // 罰款金額
}

// ─── E4. 機票行程地區 ──────────────────────────────────
export interface TicketArea {
  TAREA_CD: string;
  TAREA_NM: string;
  DMST_FG: boolean;        // 國內
  OUT_FG: boolean;         // 國外
}

// ─── E5. 空白票 ──────────────────────────────────
// === [DB] 表: blank_ticket_transfers === 來源: L_OutTicket.asp ===
export type BlankTicketType = '請領' | '退回' | '調撥';

export interface BlankTicketTransfer {
  FORD_NO: string;         // 領用單號
  FORD_TP: BlankTicketType;
  FORD_DT: string;
  DEPT_CD: string;
  EMP_CD: string;
  TKT_NO_S: string;        // 起始票號
  TKT_NO_E: string;        // 終止票號
  QTY: number;
}
