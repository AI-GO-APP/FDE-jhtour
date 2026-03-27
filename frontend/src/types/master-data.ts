/**
 * 基本資料模組 — TypeScript 型別定義
 * 對應舊系統 A. 基本資料 (33 頁)
 * 所有型別均含 DB 欄位對照註解
 */

// ─── A1. 旅客資料 ──────────────────────────────────
// === [DB] 表: passengers === 來源: L_pax.asp ===
export interface Passenger {
  PAX_CD: string;         // 旅客編號 (PK, 自動產生流水號)
  PAX_CNM: string;        // 中文姓名
  PAX_ENM: string;        // 英文姓名
  SEX_CD: 'M' | 'F';     // 性別
  BRTH_DT: string;        // 生日 (ISO date: YYYY-MM-DD)
  ID_NO: string;          // 身分證號/統一證號 (UNIQUE)
  PSP_NO: string;         // 護照號碼
  PSP_EXP_DT: string;     // 護照到期日
  NATN_CD: string;        // 國籍 (FK → nations.NATN_CD)
  AREA_CD: string;        // 洲別 (FK → areas.AREA_CD)
  CITY_CD: string;        // 城市 (FK → cities.CITY_CD)
  TEL: string;            // 電話
  MOBILE: string;         // 手機
  EMAIL: string;          // 電子郵件
  ADDR: string;           // 地址
  SALE_SU_CD: string;     // 業務來源
  EMP_CD: string;         // 負責業務員 (FK → employees.EMP_CD)
  PAX_GO_RK: string;      // 旅遊興趣/洲別偏好
  PAX_BUDGET: string;     // 顧客預算等級
  PAX_STUS: '正常' | '留意' | '暫停' | '離職'; // 往來狀態
  CRT_DT: string;         // 建檔日期 (ISO datetime)
  UPD_DT: string;         // 最後異動日期
  UPD_USER: string;       // 最後異動人員 (FK → users.USER_ID)
}

// === [API] GET /api/passengers ===
// 查詢參數: keyword, pax_cd, pax_cnm, pax_enm, id_no, psp_no,
//           brth_dt_from, brth_dt_to, sex_cd, natn_cd, emp_cd, sale_su_cd,
//           pax_go_rk, pax_budget, pax_stus, page, page_size
// 回傳: { data: Passenger[], total: number, page: number, page_size: number }
export interface PassengerFilter {
  keyword?: string;
  pax_cd?: string;
  pax_cnm?: string;
  pax_enm?: string;
  id_no?: string;
  psp_no?: string;
  brth_dt_from?: string;
  brth_dt_to?: string;
  sex_cd?: 'M' | 'F';
  natn_cd?: string;
  emp_cd?: string;
  sale_su_cd?: string;
  pax_go_rk?: string;
  pax_budget?: string;
  pax_stus?: string;
  page?: number;
  page_size?: number;
}

// === [API] POST /api/passengers ===
// Body: PassengerForm
// DB: INSERT INTO passengers, 自動產生 PAX_CD, CRT_DT, UPD_DT
export type PassengerForm = Omit<Passenger, 'PAX_CD' | 'CRT_DT' | 'UPD_DT' | 'UPD_USER'>;


// ─── A2. 同業資料 ──────────────────────────────────
// === [DB] 表: agents === 來源: L_agt.asp ===
export interface Agent {
  AGT_CD: string;         // 同業編號 (PK)
  AGT_NM: string;         // 全名
  AGT_SNM: string;        // 簡稱
  REG_NO: string;         // 註冊號碼
  UNI_NO: string;         // 統一編號
  AMRNK: string;          // 價格等級
  CTC_NM: string;         // 聯絡人
  TEL: string;            // 電話
  FAX: string;            // 傳真
  EMAIL: string;          // 電子郵件
  ADDR: string;           // 地址
  EMP_CD: string;         // 負責業務員 (FK → employees.EMP_CD)
  STUS_CD: string;        // 往來狀態
  AREA_FG: string;        // 區域分組
  FIT_FG: boolean;        // 自由行業務
  GRP_FG: boolean;        // 團體業務
  TKT_FG: boolean;        // 票務業務
}

export interface AgentFilter {
  keyword?: string;
  emp_cd?: string;
  amrnk?: string;
  area_fg?: string;
  stus_cd?: string;
  fit_fg?: boolean;
  grp_fg?: boolean;
  tkt_fg?: boolean;
  page?: number;
  page_size?: number;
}


// ─── A3. 機關行號 ──────────────────────────────────
// === [DB] 表: companies === 來源: L_comp.asp ===
export interface Company {
  COMP_CD: string;        // 編號 (PK)
  COMP_NM: string;        // 公司名稱
  COMP_SNM: string;       // 簡稱
  UNI_NO: string;         // 統一編號
  COMP_TP: string;        // 行業別
  EMP_CD: string;         // 業務員 (FK → employees.EMP_CD)
  AMRNK: string;          // 價格等級
  CTC_NM: string;         // 聯絡人
  TEL: string;            // 電話
  ADDR: string;           // 地址
}


// ─── A4. 航空公司 ──────────────────────────────────
// === [DB] 表: airlines === 來源: L_carr.asp ===
export interface Airline {
  CARR_CD: string;        // 航空公司代碼 (PK)
  CARR_CNM: string;       // 中文名稱
  CARR_ENM: string;       // 英文名稱
  DMST_FG: boolean;       // 國內航線
  ACCT_NO: string;        // 帳號
  CTC_NM: string;         // 聯絡人
  TEL: string;            // 電話
  INVALID_FG: boolean;    // 停用
}


// ─── A5. 國外 Local ──────────────────────────────────
// === [DB] 表: local_agents === 來源: L_locl.asp ===
export interface LocalAgent {
  LOCL_CD: string;        // 代碼 (PK)
  LOCL_NM: string;        // 名稱
  NATN_CD: string;        // 國家 (FK → nations)
  CITY_CD: string;        // 城市 (FK → cities)
  CTC_NM: string;         // 聯絡人
  TEL: string;
  FAX: string;
  EMAIL: string;
  INVALID_FG: boolean;    // 停用
}


// ─── A6. 辦證單位 ──────────────────────────────────
// === [DB] 表: visa_units === 來源: L_apun.asp ===
export interface VisaUnit {
  APUN_CD: string;        // 代碼 (PK)
  APUN_NM: string;        // 名稱
  CTC_NM: string;         // 聯絡人
  TEL: string;
  ADDR: string;
}


// ─── A7. 餐廳 ──────────────────────────────────
// === [DB] 表: restaurants === 來源: L_rest.asp ===
export interface Restaurant {
  REST_CD: string;
  REST_NM: string;
  NATN_CD: string;        // FK → nations
  CITY_CD: string;        // FK → cities
  CTC_NM: string;
  TEL: string;
  INVALID_FG: boolean;
}


// ─── A8. 廠商 ──────────────────────────────────
// === [DB] 表: suppliers === 來源: L_fact.asp ===
export interface Supplier {
  FACT_CD: string;
  FACT_NM: string;
  FACT_SNM: string;
  CTC_NM: string;
  TEL: string;
  FAX: string;
  ADDR: string;
  UNI_NO: string;
}


// ─── A9. 輪船公司 ──────────────────────────────────
// === [DB] 表: cruise_companies === 來源: L_cruise.asp ===
export interface CruiseCompany {
  CRUISE_CD: string;
  CRUISE_NM: string;
  CTC_NM: string;
  TEL: string;
  INVALID_FG: boolean;
}


// ─── A10. 租車公司 ──────────────────────────────────
// === [DB] 表: car_rentals === 來源: L_car.asp ===
export interface CarRental {
  CAR_CD: string;
  CAR_CNM: string;
  CTC_NM: string;
  ALRT_DR: string;        // 警示訊息
  CAR_RK: string;         // 備註
  MEMO: string;
  INVALID_FG: boolean;
}


// ─── A11. 旅遊景點 ──────────────────────────────────
// === [DB] 表: scenic_spots === 來源: L_scen.asp ===
export interface ScenicSpot {
  ITN_CD: string;
  ITN_NM: string;
  NATN_CD: string;        // FK → nations
  CITY_CD: string;        // FK → cities
  ITN_DESC: string;
  INVALID_FG: boolean;
}


// ─── A12. 通路類別 ──────────────────────────────────
// === [DB] 表: channels === 來源: L_channel.asp ===
export interface Channel {
  CHANNEL_CD: string;
  CHANNEL_NM: string;
}


// ─── A13. 員工 ──────────────────────────────────
// === [DB] 表: employees === 來源: L_emp.asp ===
export interface Employee {
  EMP_CD: string;         // 員工編號 (PK)
  EMP_NM: string;         // 中文姓名
  EMP_ENM: string;        // 英文姓名
  COMP_D_CD: string;      // 分公司代碼
  DEPT_CD: string;        // 部門代碼
  TITLE: string;          // 職稱
  SEX_CD: 'M' | 'F';     // 性別
  ID_NO: string;          // 身分證號
  BRTH_DT: string;        // 生日
  HIRE_DT: string;        // 到職日
  RESIGN_DT: string;      // 離職日
  TEL: string;
  MOBILE: string;
  EMAIL: string;
  ADDR: string;
  EMP_STUS: '在職' | '留停' | '離職'; // 就職狀態
}


// ─── A14. 領隊導遊 ──────────────────────────────────
// === [DB] 表: tour_leaders === 來源: L_tldr.asp ===
export interface TourLeader {
  TLDR_CD: string;
  TLDR_NM: string;
  TLDR_TP: '領隊' | '導遊' | '司機';
  DEPT_CD: string;
  INS_TP: string;         // 保險類型
  SORT_NO: number;        // 派團排序
}


// ─── A15-A18. 地理基礎資料 ──────────────────────────
// === [DB] 表: areas === 來源: L_area_cd.asp ===
export interface Area {
  AREA_CD: string;
  AREA_NM: string;
}

// === [DB] 表: nations === 來源: L_natn_cd.asp ===
export interface Nation {
  NATN_CD: string;
  NATN_NM: string;
  AREA_CD: string;        // FK → areas.AREA_CD
}

// === [DB] 表: cities === 來源: L_city_cd.asp ===
export interface City {
  CITY_CD: string;
  CITY_NM: string;
  NATN_CD: string;        // FK → nations.NATN_CD
}

// === [DB] 表: airports === 來源: L_airp.asp ===
export interface Airport {
  AIRP_CD: string;
  AIRP_NM: string;
  CITY_CD: string;        // FK → cities.CITY_CD
  DMST_FG: boolean;       // 國內機場
}


// ─── A19. 幣別匯率 ──────────────────────────────────
// === [DB] 表: currencies === 來源: L_curr.asp ===
export interface Currency {
  CURR_CD: string;
  CURR_NM: string;
  EXCH_RATE: number;
  EFF_DT: string;         // 生效日 (含匯率歷史)
}


// ─── A20. 航班時刻表 ──────────────────────────────────
// === [DB] 表: flights === 來源: L_flt.asp ===
export interface Flight {
  FLT_NO: string;         // 航班號
  CARR_CD: string;        // 航空公司 (FK → airlines)
  DEP_AIRP: string;       // 出發機場 (FK → airports)
  ARR_AIRP: string;       // 到達機場 (FK → airports)
  DEP_TIME: string;       // 出發時間
  ARR_TIME: string;       // 到達時間
  FLT_DAY: string;        // 營運日
}


// ─── A21-A26. 輔助資訊 ──────────────────────────────────
export interface TipSuggestion {
  NATN_CD: string;
  TIP_DESC: string;
}

export interface VoltageInfo {
  NATN_CD: string;
  VOLTAGE: string;
  TIME_DIFF: string;
  TEL_PREFIX: string;
}

export interface Document {
  DOCU_CD: string;
  DOCU_NM: string;
  DOCU_DESC: string;
}

export interface TeleCode {
  CHAR: string;
  TELE_CODE: string;
  ENG_TRANS: string;
}

export interface TransportFacility {
  AFFIC_CD: string;
  AFFIC_NM: string;
}

export interface TravelNotice {
  GORK_CD: string;
  GORK_CONTENT: string;
}


// ─── A27-A29. 出勤管理 ──────────────────────────────────
export interface LeaveRecord {
  EMP_CD: string;         // FK → employees
  LEAV_DT: string;
  LEAV_TP: string;
  LEAV_REASON: string;
}

export interface AttendanceRecord {
  EMP_CD: string;
  WORK_DT: string;
  IN_TIME: string;
  OUT_TIME: string;
  OT_HRS: number;         // 加班時數
  LATE_FG: boolean;       // 遲到
  EARLY_FG: boolean;      // 早退
  ABNORMAL_MEMO: string;  // 異常備註
}

export interface AttendanceSummary {
  EMP_CD: string;
  MONTH: string;
  ATTEND_DAYS: number;
  LEAVE_DAYS: number;
}
