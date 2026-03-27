/**
 * Mock 資料 — 基本資料模組
 * 每項 10 筆示範資料
 * 所有欄位對應 types/master-data.ts 定義
 */
import type { Passenger, Agent, Company, Airline, LocalAgent, VisaUnit, Restaurant, Supplier, CruiseCompany, CarRental, ScenicSpot, Channel, Employee, TourLeader, Area, Nation, City, Airport, Currency, Flight } from '@/types';

// === [API] GET /api/passengers → DB: passengers ===
// TODO: [替換] 改為 await api.get('/passengers', { params: filters })
export const mockPassengers: Passenger[] = Array.from({ length: 10 }, (_, i) => ({
  PAX_CD: `P${String(i + 1).padStart(4, '0')}`,
  PAX_CNM: ['王小明','李美玲','張志豪','陳雅芳','林建宏','黃淑芬','吳宗翰','周美華','鄭文凱','蔡佳玲'][i],
  PAX_ENM: ['WANG XIAO MING','LEE MEI LING','CHANG CHIH HAO','CHEN YA FANG','LIN CHIEN HUNG','HUANG SHU FEN','WU TSUNG HAN','CHOU MEI HUA','CHENG WEN KAI','TSAI CHIA LING'][i],
  SEX_CD: i % 2 === 0 ? 'M' : 'F',
  BRTH_DT: `${1975 + i}-${String((i % 12) + 1).padStart(2, '0')}-15`,
  ID_NO: `A${String(100000000 + i * 11111111)}`,
  PSP_NO: `3${String(10000000 + i * 1111111)}`,
  PSP_EXP_DT: `${2028 + (i % 3)}-06-30`,
  NATN_CD: 'TW', AREA_CD: 'AS', CITY_CD: 'TPE',
  TEL: `02-2${String(7000000 + i * 100000)}`,
  MOBILE: `09${String(10000000 + i * 1111111)}`,
  EMAIL: `user${i + 1}@example.com`,
  ADDR: `台北市大安區忠孝東路${i + 1}段${(i + 1) * 10}號`,
  SALE_SU_CD: 'WEB', EMP_CD: `E${String(i % 5 + 1).padStart(3, '0')}`,
  PAX_GO_RK: ['東北亞','東南亞','歐洲','美洲','紐澳'][i % 5],
  PAX_BUDGET: ['經濟','標準','豪華','頂級','經濟'][i % 5],
  PAX_STUS: (['正常','正常','正常','留意','正常','正常','暫停','正常','正常','正常'] as Passenger['PAX_STUS'][])[i],
  CRT_DT: '2025-01-15T10:00:00', UPD_DT: '2026-03-20T14:30:00', UPD_USER: 'LOUIS',
}));

// === [API] GET /api/agents → DB: agents ===
export const mockAgents: Agent[] = Array.from({ length: 10 }, (_, i) => ({
  AGT_CD: `AGT${String(i + 1).padStart(3, '0')}`,
  AGT_NM: ['鳳凰旅行社','東南旅行社','雄獅旅遊','可樂旅遊','易遊網','燦星旅遊','長汎假期','五福旅遊','山富旅遊','百威旅遊'][i],
  AGT_SNM: ['鳳凰','東南','雄獅','可樂','易遊','燦星','長汎','五福','山富','百威'][i],
  REG_NO: `TRA-${String(1000 + i)}`, UNI_NO: `${String(12345678 + i * 1111111)}`,
  AMRNK: ['A','A','B','A','B','C','B','A','B','C'][i],
  CTC_NM: `聯絡人${i + 1}`, TEL: `02-2${String(5000000 + i * 100000)}`, FAX: `02-2${String(5000001 + i * 100000)}`,
  EMAIL: `agent${i + 1}@travel.com`, ADDR: `台北市中山區${['南京','松江','長安','民生'][i % 4]}路${i * 10 + 10}號`,
  EMP_CD: `E${String(i % 5 + 1).padStart(3, '0')}`, STUS_CD: '正常', AREA_FG: ['北區','中區','南區','東區','北區'][i % 5],
  FIT_FG: i % 2 === 0, GRP_FG: true, TKT_FG: i % 3 === 0,
}));

// === [API] GET /api/companies → DB: companies ===
export const mockCompanies: Company[] = Array.from({ length: 10 }, (_, i) => ({
  COMP_CD: `C${String(i + 1).padStart(3, '0')}`, COMP_NM: `台灣${['科技','電子','金融','製造','貿易'][i % 5]}股份有限公司第${i + 1}分公司`,
  COMP_SNM: `台${['科','電','金','製','貿'][i % 5]}${i + 1}`, UNI_NO: `${String(20000000 + i * 1111111)}`,
  COMP_TP: ['資訊業','製造業','金融業','服務業','貿易業'][i % 5], EMP_CD: `E${String(i % 5 + 1).padStart(3, '0')}`,
  AMRNK: ['A','B','A','C','B'][i % 5], CTC_NM: `窗口${i + 1}`, TEL: `02-8${String(7000000 + i * 100000)}`, ADDR: `台北市信義區信義路${i + 1}段`,
}));

// === [API] GET /api/airlines → DB: airlines ===
export const mockAirlines: Airline[] = [
  { CARR_CD: 'CI', CARR_CNM: '中華航空', CARR_ENM: 'China Airlines', DMST_FG: false, ACCT_NO: 'CI-001', CTC_NM: '業務部', TEL: '02-27151212', INVALID_FG: false },
  { CARR_CD: 'BR', CARR_CNM: '長榮航空', CARR_ENM: 'EVA Air', DMST_FG: false, ACCT_NO: 'BR-001', CTC_NM: '業務部', TEL: '02-25011999', INVALID_FG: false },
  { CARR_CD: 'JX', CARR_CNM: '星宇航空', CARR_ENM: 'STARLUX Airlines', DMST_FG: false, ACCT_NO: 'JX-001', CTC_NM: '業務部', TEL: '02-27911000', INVALID_FG: false },
  { CARR_CD: 'IT', CARR_CNM: '台灣虎航', CARR_ENM: 'Tigerair Taiwan', DMST_FG: false, ACCT_NO: 'IT-001', CTC_NM: '業務部', TEL: '02-55993388', INVALID_FG: false },
  { CARR_CD: 'B7', CARR_CNM: '立榮航空', CARR_ENM: 'UNI Air', DMST_FG: true, ACCT_NO: 'B7-001', CTC_NM: '業務部', TEL: '02-25087999', INVALID_FG: false },
  { CARR_CD: 'AE', CARR_CNM: '華信航空', CARR_ENM: 'Mandarin Airlines', DMST_FG: true, ACCT_NO: 'AE-001', CTC_NM: '業務部', TEL: '02-27151230', INVALID_FG: false },
  { CARR_CD: 'NH', CARR_CNM: '全日空', CARR_ENM: 'All Nippon Airways', DMST_FG: false, ACCT_NO: 'NH-001', CTC_NM: '台灣分公司', TEL: '02-25218000', INVALID_FG: false },
  { CARR_CD: 'JL', CARR_CNM: '日本航空', CARR_ENM: 'Japan Airlines', DMST_FG: false, ACCT_NO: 'JL-001', CTC_NM: '台灣分公司', TEL: '02-87715151', INVALID_FG: false },
  { CARR_CD: 'CX', CARR_CNM: '國泰航空', CARR_ENM: 'Cathay Pacific', DMST_FG: false, ACCT_NO: 'CX-001', CTC_NM: '台灣分公司', TEL: '02-27152333', INVALID_FG: false },
  { CARR_CD: 'SQ', CARR_CNM: '新加坡航空', CARR_ENM: 'Singapore Airlines', DMST_FG: false, ACCT_NO: 'SQ-001', CTC_NM: '台灣分公司', TEL: '02-25511535', INVALID_FG: false },
];

// === [API] GET /api/employees → DB: employees ===
export const mockEmployees: Employee[] = Array.from({ length: 10 }, (_, i) => ({
  EMP_CD: `E${String(i + 1).padStart(3, '0')}`, EMP_NM: ['劉俊宏','陳怡君','林志明','張雅婷','王建民','李佳穎','黃志偉','吳美珍','鄭凱文','周雅琪'][i],
  EMP_ENM: ['LOUIS','YICHUN','CHIHMING','YATING','CHIENMIN','CHIAYING','CHIHWEI','MEICHEN','KAIWEN','YACHI'][i],
  COMP_D_CD: 'HQ', DEPT_CD: ['業務部','業務部','OP部','會計室','業務部','OP部','票務部','證照部','資訊部','行政部'][i],
  TITLE: ['經理','專員','主任','會計','業務','OP','票務員','辦證員','工程師','助理'][i],
  SEX_CD: i % 2 === 0 ? 'M' : 'F', ID_NO: `F${String(200000000 + i * 11111111)}`,
  BRTH_DT: `${1980 + i}-${String((i % 12) + 1).padStart(2, '0')}-20`,
  HIRE_DT: `${2015 + (i % 5)}-03-01`, RESIGN_DT: '',
  TEL: `02-2${String(8000000 + i * 100000)}`, MOBILE: `09${String(20000000 + i * 1111111)}`,
  EMAIL: `emp${i + 1}@jhtour.com`, ADDR: `台北市松山區南京東路${i + 1}段`,
  EMP_STUS: i === 9 ? '離職' : '在職',
}));

// === [API] 其他基本資料 Mock ===
export const mockLocalAgents: LocalAgent[] = Array.from({ length: 10 }, (_, i) => ({ LOCL_CD: `LCL${String(i + 1).padStart(3, '0')}`, LOCL_NM: `${['東京','大阪','首爾','曼谷','新加坡','雪梨','巴黎','倫敦','紐約','溫哥華'][i]}地接社`, NATN_CD: ['JP','JP','KR','TH','SG','AU','FR','GB','US','CA'][i], CITY_CD: ['TYO','OSA','SEL','BKK','SIN','SYD','PAR','LON','NYC','YVR'][i], CTC_NM: `Mr. ${['Tanaka','Suzuki','Kim','Somchai','Lim','Smith','Dupont','Brown','Johnson','Williams'][i]}`, TEL: `+${i + 1}-001-${String(1000000 + i)}`, FAX: '', EMAIL: `local${i + 1}@travel.com`, INVALID_FG: false }));
export const mockVisaUnits: VisaUnit[] = Array.from({ length: 10 }, (_, i) => ({ APUN_CD: `VU${String(i + 1).padStart(3, '0')}`, APUN_NM: ['外交部領事事務局','日本台灣交流協會','韓國駐台代表部','泰國貿易經濟辦事處','美國在台協會','澳洲辦事處','加拿大駐台貿辦','英國在台辦事處','法國在台協會','新加坡商工辦事處'][i], CTC_NM: `承辦${i + 1}`, TEL: `02-2${String(3000000 + i * 100000)}`, ADDR: `台北市` }));
export const mockRestaurants: Restaurant[] = Array.from({ length: 10 }, (_, i) => ({ REST_CD: `R${String(i + 1).padStart(3, '0')}`, REST_NM: ['富士山居酒屋','明洞韓式料理','河畔泰式餐廳','獅城海鮮坊','雪梨牛排館','巴黎小酒館','倫敦下午茶','紐約披薩屋','溫哥華海鮮','台北小籠包'][i], NATN_CD: ['JP','KR','TH','SG','AU','FR','GB','US','CA','TW'][i], CITY_CD: ['TYO','SEL','BKK','SIN','SYD','PAR','LON','NYC','YVR','TPE'][i], CTC_NM: `店長${i + 1}`, TEL: `+${i + 1}-123-456`, INVALID_FG: false }));
export const mockSuppliers: Supplier[] = Array.from({ length: 10 }, (_, i) => ({ FACT_CD: `F${String(i + 1).padStart(3, '0')}`, FACT_NM: `供應商${['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][i]}`, FACT_SNM: `供${i + 1}`, CTC_NM: `聯絡${i + 1}`, TEL: `02-2${String(6000000 + i * 100000)}`, FAX: '', ADDR: `台北市`, UNI_NO: `${String(30000000 + i * 1111111)}` }));
export const mockCruise: CruiseCompany[] = Array.from({ length: 10 }, (_, i) => ({ CRUISE_CD: `CR${String(i + 1).padStart(3, '0')}`, CRUISE_NM: ['皇家加勒比','公主郵輪','歌詩達','地中海郵輪','星夢郵輪','嘉年華','荷美郵輪','麗星郵輪','名勝世界','維京郵輪'][i], CTC_NM: `業務${i + 1}`, TEL: `02-2${String(4000000 + i * 100000)}`, INVALID_FG: false }));
export const mockCarRentals: CarRental[] = Array.from({ length: 10 }, (_, i) => ({ CAR_CD: `CAR${String(i + 1).padStart(3, '0')}`, CAR_CNM: ['格上租車','和運租車','小馬租車','中租租車','安維斯','赫茲租車','百捷租車','大都會租車','歐力士','全球租車'][i], CTC_NM: `門市${i + 1}`, ALRT_DR: '', CAR_RK: '', MEMO: '', INVALID_FG: false }));
export const mockScenicSpots: ScenicSpot[] = Array.from({ length: 10 }, (_, i) => ({ ITN_CD: `SC${String(i + 1).padStart(3, '0')}`, ITN_NM: ['淺草寺','明洞','大皇宮','魚尾獅','雪梨歌劇院','巴黎鐵塔','倫敦眼','自由女神','尼加拉瀑布','日月潭'][i], NATN_CD: ['JP','KR','TH','SG','AU','FR','GB','US','CA','TW'][i], CITY_CD: ['TYO','SEL','BKK','SIN','SYD','PAR','LON','NYC','YVR','TPE'][i], ITN_DESC: `知名旅遊景點${i + 1}`, INVALID_FG: false }));
export const mockChannels: Channel[] = [{ CHANNEL_CD: 'WEB', CHANNEL_NM: '官網' },{ CHANNEL_CD: 'B2B', CHANNEL_NM: '同業' },{ CHANNEL_CD: 'TEL', CHANNEL_NM: '電話' },{ CHANNEL_CD: 'DM', CHANNEL_NM: 'DM傳單' },{ CHANNEL_CD: 'FB', CHANNEL_NM: 'Facebook' },{ CHANNEL_CD: 'IG', CHANNEL_NM: 'Instagram' },{ CHANNEL_CD: 'LINE', CHANNEL_NM: 'LINE' },{ CHANNEL_CD: 'REF', CHANNEL_NM: '客戶介紹' },{ CHANNEL_CD: 'EXH', CHANNEL_NM: '旅展' },{ CHANNEL_CD: 'OTH', CHANNEL_NM: '其他' }];
export const mockTourLeaders: TourLeader[] = Array.from({ length: 10 }, (_, i) => ({ TLDR_CD: `TL${String(i + 1).padStart(3, '0')}`, TLDR_NM: ['趙領隊','錢領隊','孫導遊','李導遊','周司機','吳領隊','鄭導遊','王領隊','馮導遊','陳司機'][i], TLDR_TP: (['領隊','領隊','導遊','導遊','司機','領隊','導遊','領隊','導遊','司機'] as TourLeader['TLDR_TP'][])[i], DEPT_CD: 'OP部', INS_TP: ['甲式','乙式','甲式','乙式','丙式'][i % 5], SORT_NO: i + 1 }));
export const mockAreas: Area[] = [{ AREA_CD: 'AS', AREA_NM: '亞洲' },{ AREA_CD: 'EU', AREA_NM: '歐洲' },{ AREA_CD: 'NA', AREA_NM: '北美洲' },{ AREA_CD: 'SA', AREA_NM: '南美洲' },{ AREA_CD: 'AF', AREA_NM: '非洲' },{ AREA_CD: 'OC', AREA_NM: '大洋洲' },{ AREA_CD: 'ME', AREA_NM: '中東' },{ AREA_CD: 'CA', AREA_NM: '中美洲' },{ AREA_CD: 'EA', AREA_NM: '東亞' },{ AREA_CD: 'SEA', AREA_NM: '東南亞' }];
export const mockNations: Nation[] = [{ NATN_CD: 'TW', NATN_NM: '台灣', AREA_CD: 'EA' },{ NATN_CD: 'JP', NATN_NM: '日本', AREA_CD: 'EA' },{ NATN_CD: 'KR', NATN_NM: '韓國', AREA_CD: 'EA' },{ NATN_CD: 'TH', NATN_NM: '泰國', AREA_CD: 'SEA' },{ NATN_CD: 'SG', NATN_NM: '新加坡', AREA_CD: 'SEA' },{ NATN_CD: 'AU', NATN_NM: '澳洲', AREA_CD: 'OC' },{ NATN_CD: 'FR', NATN_NM: '法國', AREA_CD: 'EU' },{ NATN_CD: 'GB', NATN_NM: '英國', AREA_CD: 'EU' },{ NATN_CD: 'US', NATN_NM: '美國', AREA_CD: 'NA' },{ NATN_CD: 'CA', NATN_NM: '加拿大', AREA_CD: 'NA' }];
export const mockCities: City[] = [{ CITY_CD: 'TPE', CITY_NM: '台北', NATN_CD: 'TW' },{ CITY_CD: 'TYO', CITY_NM: '東京', NATN_CD: 'JP' },{ CITY_CD: 'OSA', CITY_NM: '大阪', NATN_CD: 'JP' },{ CITY_CD: 'SEL', CITY_NM: '首爾', NATN_CD: 'KR' },{ CITY_CD: 'BKK', CITY_NM: '曼谷', NATN_CD: 'TH' },{ CITY_CD: 'SIN', CITY_NM: '新加坡', NATN_CD: 'SG' },{ CITY_CD: 'SYD', CITY_NM: '雪梨', NATN_CD: 'AU' },{ CITY_CD: 'PAR', CITY_NM: '巴黎', NATN_CD: 'FR' },{ CITY_CD: 'LON', CITY_NM: '倫敦', NATN_CD: 'GB' },{ CITY_CD: 'NYC', CITY_NM: '紐約', NATN_CD: 'US' }];
export const mockAirports: Airport[] = [{ AIRP_CD: 'TPE', AIRP_NM: '桃園國際機場', CITY_CD: 'TPE', DMST_FG: false },{ AIRP_CD: 'TSA', AIRP_NM: '台北松山機場', CITY_CD: 'TPE', DMST_FG: true },{ AIRP_CD: 'NRT', AIRP_NM: '成田國際機場', CITY_CD: 'TYO', DMST_FG: false },{ AIRP_CD: 'HND', AIRP_NM: '羽田機場', CITY_CD: 'TYO', DMST_FG: false },{ AIRP_CD: 'KIX', AIRP_NM: '關西國際機場', CITY_CD: 'OSA', DMST_FG: false },{ AIRP_CD: 'ICN', AIRP_NM: '仁川國際機場', CITY_CD: 'SEL', DMST_FG: false },{ AIRP_CD: 'BKK', AIRP_NM: '素萬那普機場', CITY_CD: 'BKK', DMST_FG: false },{ AIRP_CD: 'SIN', AIRP_NM: '樟宜機場', CITY_CD: 'SIN', DMST_FG: false },{ AIRP_CD: 'CDG', AIRP_NM: '戴高樂機場', CITY_CD: 'PAR', DMST_FG: false },{ AIRP_CD: 'LHR', AIRP_NM: '希斯洛機場', CITY_CD: 'LON', DMST_FG: false }];
export const mockCurrencies: Currency[] = [{ CURR_CD: 'TWD', CURR_NM: '新台幣', EXCH_RATE: 1, EFF_DT: '2026-03-27' },{ CURR_CD: 'USD', CURR_NM: '美元', EXCH_RATE: 32.5, EFF_DT: '2026-03-27' },{ CURR_CD: 'JPY', CURR_NM: '日圓', EXCH_RATE: 0.215, EFF_DT: '2026-03-27' },{ CURR_CD: 'EUR', CURR_NM: '歐元', EXCH_RATE: 35.2, EFF_DT: '2026-03-27' },{ CURR_CD: 'GBP', CURR_NM: '英鎊', EXCH_RATE: 41.1, EFF_DT: '2026-03-27' },{ CURR_CD: 'KRW', CURR_NM: '韓元', EXCH_RATE: 0.0235, EFF_DT: '2026-03-27' },{ CURR_CD: 'THB', CURR_NM: '泰銖', EXCH_RATE: 0.92, EFF_DT: '2026-03-27' },{ CURR_CD: 'AUD', CURR_NM: '澳幣', EXCH_RATE: 21.3, EFF_DT: '2026-03-27' },{ CURR_CD: 'SGD', CURR_NM: '新幣', EXCH_RATE: 24.1, EFF_DT: '2026-03-27' },{ CURR_CD: 'CAD', CURR_NM: '加幣', EXCH_RATE: 23.8, EFF_DT: '2026-03-27' }];
export const mockFlights: Flight[] = Array.from({ length: 10 }, (_, i) => ({ FLT_NO: `${mockAirlines[i].CARR_CD}${100 + i}`, CARR_CD: mockAirlines[i].CARR_CD, DEP_AIRP: 'TPE', ARR_AIRP: ['NRT','NRT','KIX','ICN','BKK','SIN','CDG','LHR','SIN','NRT'][i], DEP_TIME: `${String(7 + i).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`, ARR_TIME: `${String(11 + i).padStart(2, '0')}:${i % 2 === 0 ? '30' : '00'}`, FLT_DAY: '每日' }));
