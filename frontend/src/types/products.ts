/**
 * 商品管理模組 — TypeScript 型別定義
 * 對應舊系統 C. 商品管理 (20 頁)
 */

// ─── C1. 共用基本行程 ──────────────────────────────────
// === [DB] 表: tours === 來源: L_tour.asp ===
export interface Tour {
  TOUR_CD: string;         // PK
  TOUR_NM: string;         // 行程名稱
  AREA_CD: string;         // 洲別 (FK → areas)
  DAYS: number;            // 天數
  NIGHTS: number;          // 夜數
  ITN_CONTENT: string;     // 行程內容 (富文本)
  TOUR_DESC: string;       // 行程描述
}

// ─── C2. 基本團型 ──────────────────────────────────
// === [DB] 表: master_groups === 來源: L_mgroup.asp ===
export interface MasterGroup {
  MGRP_CD: string;         // PK
  MGRP_NM: string;         // 團型名稱
  TOUR_CD: string;         // FK → tours
  AREA_CD: string;         // 洲別
  NATN_CD: string;         // 國家
  PROD_TP: string;         // 產品類型
  PRICE_BASE: number;      // 基礎價格
}

// ─── C3-C4. 團體 (個團) ──────────────────────────────────
// === [DB] 表: groups === ⭐核心表 === 來源: L_group.asp, L_crgroup_main.asp ===
export type SaleStatus = '規劃中' | '收客中' | '確認' | '額滿' | '取消' | '已出團' | '結團';

export interface Group {
  GRUP_CD: string;         // 團號 (PK)
  GRUP_NM: string;         // 團體名稱
  MGRP_CD: string;         // 來源團型 (FK → master_groups)
  DEP_DT: string;          // 出發日
  RTN_DT: string;          // 回程日
  AREA_CD: string;         // 地區 (FK)
  LINE_CD: string;         // 線別
  CARR_CD: string;         // 航空公司 (FK → airlines)
  FLT_NO: string;          // 航班號
  PRICE: number;           // 售價
  DISCOUNT: number;        // 折扣
  MAX_PAX: number;         // 可收人數上限
  SOLD_PAX: number;        // 已報名人數
  RSVD_PAX: number;        // 保留位數
  LEADER_CD: string;       // 領隊 (FK → tour_leaders)
  OP_EMP_CD: string;       // OP 承辦 (FK → employees)
  SALE_STUS: SaleStatus;   // 銷售狀態
  PROFIT_AMT: number;      // 損益金額
}

// ─── C5-C6. 自由行 ──────────────────────────────────
export interface PersonalFIT {
  PACKPS_CD: string;
  PACK_NM: string;
  AREA_CD: string;
  HOTEL_CD: string;
  DAYS: number;
  PRICE: number;
}

export interface GroupFIT {
  PACKPG_CD: string;
  PACK_NM: string;
  AREA_CD: string;
  MIN_PAX: number;
  MAX_PAX: number;
  PRICE: number;
}

// ─── C7. 旅館 ──────────────────────────────────
// === [DB] 表: hotels === 來源: L_hotel.asp ===
export interface Hotel {
  HOTEL_CD: string;
  HOTEL_NM: string;
  HOTEL_ENM: string;
  NATN_CD: string;         // FK → nations
  CITY_CD: string;         // FK → cities
  STAR_RANK: number;       // 星級 (1-5)
  ROOM_TYPES: string;      // 房型
  FACILITIES: string;      // 設施
  CTC_NM: string;
  TEL: string;
  FAX: string;
  EMAIL: string;
  ADDR: string;
  ALLOTMENT: number;       // 保留房數
  INVALID_FG: boolean;     // 停用
}

// ─── C8-C12. 旅館子功能 ──────────────────────────────────
export interface HotelProfit {
  HOTEL_CD: string;
  PROFIT_RATE: number;
  EFF_DT: string;
}

export interface HotelGrossMargin {
  HOTEL_CD: string;
  GROSS_MARGIN: number;
  PERIOD: string;
}

export interface HotelCancelPolicy {
  HOTEL_CD: string;
  CANCEL_DAYS: number;
  PENALTY_RATE: number;
}

export interface HotelPromotion {
  HOTEL_CD: string;
  PRIV_TP: string;
  DISCOUNT: number;
  EFF_DT_S: string;
  EFF_DT_E: string;
}

export interface HotelPayRule {
  HOTEL_CD: string;
  PAY_RULE: string;
  DEPOSIT_RATE: number;
}

// ─── C13-C15. 其他商品 ──────────────────────────────────
export interface VisaProduct {
  VISA_CD: string;
  VISA_NM: string;
  NATN_CD: string;
  PRICE: number;
  PROC_DAYS: number;       // 處理天數
}

export interface MiscProduct {
  MSLN_CD: string;
  MSLN_NM: string;
  MSLN_TP: 'WIFI' | '門票' | '保險';
  PRICE: number;
}

export interface LocalPackage {
  PKG_CD: string;
  PKG_NM: string;
  AREA_CD: string;
  CITY_CD: string;
  PRICE: number;
  PKG_DESC: string;
}

// ─── 意見回饋問卷 ──────────────────────────────────
export interface SurveyQuestion {
  SURV_ID: string;
  SURV_CONTENT: string;
  GRUP_CD: string;
}
