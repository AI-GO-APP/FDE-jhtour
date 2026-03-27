/**
 * Mock 資料 — 訂單、商品、團銷、票務、帳務、證照、訊息、系統模組
 * Phase 2~7 所有模組的 10 筆示範資料
 */
import type { Order, CreditCardTransaction, PaymentRequest, Receipt } from '@/types/orders';
import type { Tour, MasterGroup, Group, Hotel, PersonalFIT } from '@/types/products';
import type { TicketImport, TicketDetail, TicketRefund } from '@/types/ticketing';
import type { VisaRecord, ReceivableVoucher, PayableVoucher, BbsMessage } from '@/types/system';

// ─── B. 訂單管理 Mock ──────────────────────────
// === [API] GET /api/orders → DB: orders ===
export const mockOrders: Order[] = Array.from({length:10},(_,i)=>({
  ORD_NO:`ORD-202603${String(27-i).padStart(2,'0')}-${String(i+1).padStart(3,'0')}`, OP_SQ:i+1,
  PROD_TP:(['團體','機票','套旅','旅館','證照','其他','自費','團體','機票','團體'] as Order['PROD_TP'][])[i],
  PAX_CD:`P${String(i+1).padStart(4,'0')}`, AGT_CD:i%3===0?`AGT${String(i+1).padStart(3,'0')}`:'', COMP_CD:i%4===0?`C${String(i+1).padStart(3,'0')}`:'',
  GRUP_CD:i<3?`JP2603-${String(i+1).padStart(3,'0')}`:'', DEP_DT:`2026-04-${String(i+1).padStart(2,'0')}`, RTN_DT:`2026-04-${String(i+6).padStart(2,'0')}`, AREA_CD:'AS',
  AMT:[42800,12500,8900,38600,55200,22000,18500,68000,9800,45000][i], EMP_CD:`E${String(i%5+1).padStart(3,'0')}`, OP_EMP_CD:`E${String(i%3+3).padStart(3,'0')}`,
  ORD_STUS:(['確認','報名','待付款','確認','完成','報名','確認','取消','報名','完成'] as Order['ORD_STUS'][])[i],
  CRT_DT:`2026-03-${String(20+i).padStart(2,'0')}T10:00:00`, UPD_DT:`2026-03-27T14:30:00`,
}));

// === [API] GET /api/credit-cards → DB: credit_card_transactions ===
export const mockCardTxns: CreditCardTransaction[] = Array.from({length:10},(_,i)=>({
  CARD_TXN_ID:i+1, ORD_NO:mockOrders[i].ORD_NO, CARD_NO:`****-****-****-${String(1000+i*111)}`,
  CARD_HOLDER:['王小明','李美玲','張志豪','陳雅芳','林建宏','黃淑芬','吳宗翰','周美華','鄭文凱','蔡佳玲'][i],
  AUTH_CD:`AUTH${String(100000+i)}`, AUTH_DT:`2026-03-${String(20+i).padStart(2,'0')}`,
  AUTH_AMT:mockOrders[i].AMT, AUTH_STUS:['成功','成功','待授權','成功','成功','失敗','成功','成功','待授權','成功'][i],
}));

// ─── C. 商品管理 Mock ──────────────────────────
// === [API] GET /api/tours → DB: tours ===
export const mockTours: Tour[] = Array.from({length:10},(_,i)=>({
  TOUR_CD:`TOUR${String(i+1).padStart(3,'0')}`, TOUR_NM:['東京經典五日','大阪京都六日','首爾美食四日','曼谷芭達雅五日','新加坡三日','雪梨墨爾本七日','巴黎倫敦十日','紐約華盛頓八日','北海道四日','沖繩三日'][i],
  AREA_CD:'AS', DAYS:[5,6,4,5,3,7,10,8,4,3][i], NIGHTS:[4,5,3,4,2,6,9,7,3,2][i], ITN_CONTENT:'詳細行程內容...', TOUR_DESC:'精選旅遊行程',
}));

// === [API] GET /api/master-groups → DB: master_groups ===
export const mockMasterGroups: MasterGroup[] = Array.from({length:10},(_,i)=>({
  MGRP_CD:`MG${String(i+1).padStart(3,'0')}`, MGRP_NM:`${mockTours[i].TOUR_NM}範本`, TOUR_CD:mockTours[i].TOUR_CD,
  AREA_CD:'AS', NATN_CD:['JP','JP','KR','TH','SG','AU','FR','US','JP','JP'][i], PROD_TP:'團體', PRICE_BASE:[35000,42000,28000,25000,22000,68000,89000,75000,38000,20000][i],
}));

// === [API] GET /api/groups → DB: groups ===
export const mockGroups: Group[] = Array.from({length:10},(_,i)=>({
  GRUP_CD:`JP2604-${String(i+1).padStart(3,'0')}`, GRUP_NM:`${mockTours[i%10].TOUR_NM} 第${i+1}團`, MGRP_CD:mockMasterGroups[i].MGRP_CD,
  DEP_DT:`2026-04-${String(i*3+1).padStart(2,'0')}`, RTN_DT:`2026-04-${String(i*3+6).padStart(2,'0')}`, AREA_CD:'AS', LINE_CD:'東北亞',
  CARR_CD:'CI', FLT_NO:`CI${100+i}`, PRICE:[42800,48000,32000,28000,25000,72000,95000,80000,42000,22000][i], DISCOUNT:0,
  MAX_PAX:[30,25,35,40,20,25,30,28,35,25][i], SOLD_PAX:[28,18,22,32,12,20,15,25,30,8][i], RSVD_PAX:[2,3,5,0,3,2,5,0,0,5][i],
  LEADER_CD:`TL${String(i%5+1).padStart(3,'0')}`, OP_EMP_CD:`E${String(i%3+3).padStart(3,'0')}`,
  SALE_STUS:(['收客中','收客中','收客中','確認','規劃中','收客中','規劃中','確認','額滿','規劃中'] as Group['SALE_STUS'][])[i], PROFIT_AMT:[120000,85000,95000,150000,45000,180000,250000,200000,160000,30000][i],
}));

// === [API] GET /api/hotels → DB: hotels ===
export const mockHotels: Hotel[] = Array.from({length:10},(_,i)=>({
  HOTEL_CD:`H${String(i+1).padStart(3,'0')}`, HOTEL_NM:['東京帝國飯店','大阪喜來登','首爾威斯汀','曼谷半島','新加坡金沙','雪梨希爾頓','巴黎麗池','倫敦薩沃伊','紐約華爾道夫','溫哥華費爾蒙'][i],
  HOTEL_ENM:['Imperial Tokyo','Sheraton Osaka','Westin Seoul','Peninsula BKK','Marina Bay Sands','Hilton Sydney','Ritz Paris','Savoy London','Waldorf NYC','Fairmont Vancouver'][i],
  NATN_CD:['JP','JP','KR','TH','SG','AU','FR','GB','US','CA'][i], CITY_CD:['TYO','OSA','SEL','BKK','SIN','SYD','PAR','LON','NYC','YVR'][i],
  STAR_RANK:[5,4,5,5,5,4,5,5,5,4][i], ROOM_TYPES:'標準/豪華/套房', FACILITIES:'WiFi/健身房/泳池',
  CTC_NM:`訂房部${i+1}`, TEL:`+${i+1}-hotel-${i}`, FAX:'', EMAIL:`hotel${i+1}@hotel.com`, ADDR:'', ALLOTMENT:[20,15,25,10,30,12,8,15,20,10][i], INVALID_FG:false,
}));

// ─── E. 票務管理 Mock ──────────────────────────
// === [API] GET /api/tickets → DB: ticket_details ===
export const mockTickets: TicketDetail[] = Array.from({length:10},(_,i)=>({
  TKT_NO:`297-${String(2000000+i*111111)}`, OP_SQ:i+1, PAX_ENM:['WANG/XIAOMING','LEE/MEILING','CHANG/CHIHHAO','CHEN/YAFANG','LIN/CHIENHUNG','HUANG/SHUFEN','WU/TSUNGHAN','CHOU/MEIHUA','CHENG/WENKAI','TSAI/CHIALING'][i],
  TKT_ST:(['已售','已售','未售','已售','退票','已售','未售','已售','作廢','已售'] as TicketDetail['TKT_ST'][])[i],
  CARR_CD:['CI','BR','JX','CI','BR','NH','JL','CX','SQ','CI'][i], FLT_NO:`${['CI','BR','JX','CI','BR','NH','JL','CX','SQ','CI'][i]}${100+i}`,
  DEP_DT:`2026-04-${String(i+1).padStart(2,'0')}`, ROUTE:['TPE-NRT','TPE-KIX','TPE-ICN','TPE-BKK','TPE-SIN','TPE-NRT','TPE-NRT','TPE-CDG','TPE-SIN','TPE-LHR'][i],
  FARE:[12500,15000,9800,8500,11000,28000,32000,45000,18000,38000][i], TAX:[2800,3200,2100,1800,2500,5200,6000,8500,3800,7200][i],
}));

// ─── F. 證照管理 Mock ──────────────────────────
// === [API] GET /api/visa-records → DB: visa_records ===
export const mockVisaRecords: VisaRecord[] = Array.from({length:10},(_,i)=>({
  OVISA_NO:`V${String(i+1).padStart(4,'0')}`, PAX_CD:`P${String(i+1).padStart(4,'0')}`, GRUP_CD:i<5?`JP2604-${String(i+1).padStart(3,'0')}`:'',
  VISA_TP:['護照','日簽','韓簽','泰簽','美簽','澳簽','申根','護照','日簽','加簽'][i],
  VSTUS_CD:(['接件','送件','核准','還件','接件','送件','核准','退件','暫收','接件'] as VisaRecord['VSTUS_CD'][])[i],
  OP_DT:`2026-03-${String(15+i).padStart(2,'0')}`, APUN_CD:`VU${String(i%5+1).padStart(3,'0')}`, EXPIRE_DT:`2028-${String(i+1).padStart(2,'0')}-30`,
}));

// ─── K. 帳務管理 Mock ──────────────────────────
export const mockReceivables: ReceivableVoucher[] = Array.from({length:10},(_,i)=>({
  AORD_NO:`AR${String(i+1).padStart(4,'0')}`, OP_SQ:i+1, ACCT_NOR:`P${String(i+1).padStart(4,'0')}`,
  CARD_NO:`****-${String(1000+i*111)}`, AORD_DT:`2026-03-${String(20+i).padStart(2,'0')}`, AMT:[42800,12500,8900,38600,55200,22000,18500,68000,9800,45000][i], RCV_STUS:['已收','未收','已收','已收','未收','已收','待核','已收','未收','已收'][i],
}));
export const mockPayables: PayableVoucher[] = Array.from({length:10},(_,i)=>({
  CORD_NO:`AP${String(i+1).padStart(4,'0')}`, ACCT_NOP:`F${String(i%5+1).padStart(3,'0')}`,
  CORD_DT:`2026-03-${String(18+i).padStart(2,'0')}`, PAY_DT:`2026-04-${String(i+1).padStart(2,'0')}`, AMT:[35000,28000,15000,42000,8000,22000,18000,55000,12000,38000][i], PAY_STUS:['已付','未付','已付','已付','未付','已付','待核','已付','未付','已付'][i],
}));

// ─── N. 訊息管理 Mock ──────────────────────────
export const mockBbs: BbsMessage[] = Array.from({length:10},(_,i)=>({
  BBS_ID:`BBS${String(i+1).padStart(4,'0')}`, BBS_TP:['全公司','業務部','OP部','會計室','全公司','業務部','全公司','OP部','全公司','會計室'][i],
  TITLE:['年度旅展活動通知','新產品上線公告','四月出團提醒','三月帳務結算','系統維護公告','業績目標通知','員工旅遊報名','新航線開放','清明連假出團','BSP 對帳提醒'][i],
  CONTENT:'公告內容...', PUB_DT:`2026-03-${String(18+i).padStart(2,'0')}`, EXP_DT:`2026-04-${String(18+i).padStart(2,'0')}`, PUB_STUS:['已發佈','已發佈','草稿','已發佈','已發佈','草稿','已發佈','已發佈','草稿','已發佈'][i],
}));
