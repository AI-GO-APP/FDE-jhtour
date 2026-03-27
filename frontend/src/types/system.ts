/**
 * 系統、帳務、證照、訊息模組 — TypeScript 型別定義
 * 對應舊系統 F/H/K/N/Z 模組
 */

// ─── F. 證照管理 ──────────────────────────────────
// === [DB] 表: visa_records === 來源: L_ovisa.asp ===
export type VisaStatus = '接件' | '送件' | '核准' | '還件' | '退件' | '暫收' | '退還';

export interface VisaRecord {
  OVISA_NO: string;        // PK
  PAX_CD: string;          // FK → passengers
  GRUP_CD: string;         // FK → groups
  VISA_TP: string;         // 辦證類型
  VSTUS_CD: VisaStatus;    // 狀態流轉
  OP_DT: string;           // 作業日期
  APUN_CD: string;         // 辦證單位 (FK → visa_units)
  EXPIRE_DT: string;       // 到期日
}

export interface VisaDetail {
  OVISA_NO: string;
  SEQ: number;
  ITEM_NM: string;
  PROC_STUS: string;
  PROC_DT: string;
  MEMO: string;
}


// ─── K. 帳務管理 ──────────────────────────────────
// === [DB] 表: receivable_vouchers === 來源: L_aord.asp ===
export interface ReceivableVoucher {
  AORD_NO: string;
  OP_SQ: number;
  ACCT_NOR: string;        // 客戶帳號
  CARD_NO: string;         // 信用卡號
  AORD_DT: string;
  AMT: number;
  RCV_STUS: string;
}

// === [DB] 表: payable_vouchers === 來源: L_outcord.asp ===
export interface PayableVoucher {
  CORD_NO: string;
  ACCT_NOP: string;        // 廠商帳號
  CORD_DT: string;
  PAY_DT: string;
  AMT: number;
  PAY_STUS: string;
}

// === [DB] 表: e_transfer_orders === 來源: L_epretord.asp ===
export interface ETransferOrder {
  TORD_NO: string;
  TORD_DT: string;
  COMP_CD: string;
  DEPT_CD: string;
  EMP_CD: string;
  AMT: number;
  BUYER_NM: string;
  BUYER_UNI_NO: string;
  BUYER_ADDR: string;
  BUYER_MAIL: string;
}


// ─── H. 系統設定 ──────────────────────────────────
// === [DB] 表: user_groups === 來源: L_USERGRP.asp ===
export interface UserGroup {
  GRP_ID: string;
  GRP_ENM: string;
  GRP_CNM: string;
  PERMISSIONS: string[];   // 權限清單
}

// === [DB] 表: users === 來源: L_userE.asp ===
export interface SystemUser {
  USER_ID: string;
  EMP_CD: string;          // FK → employees
  GRP_ID: string;          // FK → user_groups
  USR_VAT: string;         // 個資認證狀態
}

export interface PasswordPolicy {
  MIN_LEN: number;
  PERIOD_MON: number;      // 密碼更換週期 (月)
  ALPHA_NUM_MIX: boolean;  // 英數混合
  CASE_SENSITIVE: boolean; // 大小寫區分
  LOCK_IP: string;         // 鎖定 IP
}

export interface MailRecord {
  MAIL_ID: string;
  OP_SQ: number;
  REF_NO: string;
  SEND_DT: string;
  SEND_RESULT: string;
  MAIL_TP: string;
}

export interface CustomReport {
  RPT_ID: string;
  RPT_NM: string;
  FIELD_LIST: string[];
  DT_FORMAT: string;
  ENABLED: boolean;
}


// ─── N. 訊息管理 ──────────────────────────────────
// === [DB] 表: bbs_messages === 來源: L_bbs.asp ===
export interface BbsMessage {
  BBS_ID: string;
  BBS_TP: string;          // 部門分類
  TITLE: string;
  CONTENT: string;
  PUB_DT: string;
  EXP_DT: string;
  PUB_STUS: string;
}

// === [DB] 表: sms_rules === 來源: L_sms_auto_rule_detail.asp ===
export interface SmsRule {
  RULE_ID: string;
  TRIGGER_EVENT: string;
  TEMPLATE_ID: string;
  ENABLED: boolean;
}

export interface SmsTemplate {
  LIB_ID: string;
  SMS_LIB_TP: '常用' | '會員' | '訂購';
  CONTENT: string;
}

export interface SmsLog {
  LOG_ID: string;
  SMS_ID: string;
  MOBILE: string;
  SEND_DT: string;
  RESULT: string;
  GRUP_CD: string;
}

export interface SmsPromo {
  PROMO_ID: string;
  SEND_DT: string;
  EMP_CD: string;
  SEND_STUS: string;
  TARGET_COUNT: number;
}

export interface SmsGroup {
  GROUP_ID: string;
  GROUP_NM: string;
  MEMBER_LIST: string[];
}


// ─── Z. 系統維護 ──────────────────────────────────
export interface DataClearConfig {
  CLEAR_DT: string;         // 基準日期
  MEMO: string;
  CLEAR_TYPE: '團體' | '機票' | '旅客個資';
}


// ─── D. 團銷管理 ──────────────────────────────────
export interface GroupSalesControl {
  GRUP_CD: string;
  DEP_DT: string;
  MAX_PAX: number;
  SOLD_PAX: number;
  RSVD_PAX: number;
  REMAIN_PAX: number;
  PROFIT_AMT: number;
  SALE_STUS: string;
}

export interface GroupRoom {
  GRUP_CD: string;
  ROOM_NO: string;
  HOTEL_CD: string;
  ROOM_TP: string;
  PAX_CDS: string[];
  CHK_IN_DT: string;
  CHK_OUT_DT: string;
}

export interface GroupCar {
  GRUP_CD: string;
  CAR_CD: string;
  DRIVER: string;
  PICKUP_DT: string;
  PICKUP_LOC: string;
  DROPOFF_LOC: string;
}

export interface OrderChangeLog {
  LOG_ID: string;
  GRUP_CD: string;
  ORD_NO: string;
  CHG_TP: string;
  CHG_FIELD: string;
  OLD_VAL: string;
  NEW_VAL: string;
  CHG_USER: string;
  CHG_DT: string;
}

export interface GroupPerformance {
  GRUP_CD: string;
  EMP_CD: string;
  FEAT_AMT: number;
  COMM_RATE: number;
  COMM_AMT: number;
}

export interface GovApplication {
  APPLY_NO: string;
  GRUP_CD: string;
  APPLY_DT: string;
  GOV_REF_NO: string;
  STUS: string;
}
