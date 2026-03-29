/**
 * 全方位 API 串接測試腳本
 * 測試：7 張 Custom Table (含每個欄位)、account_moves、countries/currencies/account_taxes
 *
 * 執行方式：node --experimental-fetch scripts/test-all-api.mjs
 */

const BASE = 'http://localhost:3006';

// 結果收集
const results = [];

// ===========================
// 工具函式
// ===========================
async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }

    results.push({
      name,
      method,
      status: res.status,
      ok: res.ok,
      dataCount: Array.isArray(json?.data) ? json.data.length : (json?.id ? '1 created' : '-'),
      detail: res.ok ? null : (json?.detail || json?.error || text.slice(0, 120)),
    });

    return { status: res.status, ok: res.ok, json };
  } catch (err) {
    results.push({
      name,
      method,
      status: 'ERR',
      ok: false,
      dataCount: '-',
      detail: err.message,
    });
    return { status: 0, ok: false, json: null };
  }
}

async function testCRUD(label, apiPath, createData) {
  // 1. GET — 列表讀取
  await testEndpoint(`${label} — 列表讀取`, `${BASE}${apiPath}?limit=5`);

  // 2. POST — 新增（含所有欄位）
  const createRes = await testEndpoint(`${label} — 新增（全欄位）`, `${BASE}${apiPath}`, 'POST', createData);

  // 3. 如果新增成功，嘗試讀取該筆
  if (createRes.ok && createRes.json?.id) {
    const id = createRes.json.id;
    // 這需要 [id] route handler，先跳過
    console.log(`  → 已建立: ${id}`);
  }

  return createRes;
}

// ===========================
// 主測試
// ===========================
async function main() {
  console.log('================================================================');
  console.log('  吉航旅遊 ERP × AI GO  全方位 API 串接測試');
  console.log('  時間:', new Date().toLocaleString('zh-TW'));
  console.log('================================================================\n');

  // ─── 一、7 張 Custom Table CRUD 測試 ───────────────────────
  console.log('▶ 一、Custom Table CRUD 測試（每個表每個欄位）\n');

  // 1. tour_itinerary_templates
  await testCRUD('行程模板', '/api/custom/itinerary-templates', {
    name: '北海道美食五日遊',
    destination: '日本北海道',
    duration_days: 5,
    category: '跟團',
    status: 'active',
    description: '冬季限定行程，含札幌雪祭、小樽運河、富良野花田',
  });

  // 2. tour_departure_schedules
  await testCRUD('出團班表', '/api/custom/departure-schedules', {
    group_code: 'JP2026-0415A',
    departure_date: '2026-04-15',
    return_date: '2026-04-19',
    min_pax: 16,
    max_pax: 40,
    current_pax: 22,
    price: 42800,
    status: 'confirmed',
    // itinerary_id 需要真實 UUID，先跳過關聯欄位
  });

  // 3. hotel_contracts
  await testCRUD('飯店合約', '/api/custom/hotel-contracts', {
    hotel_name: 'ザ・ウィンザーホテル洞爺',
    city: '洞爺湖',
    country: '日本',
    contract_start: '2026-01-01',
    contract_end: '2026-12-31',
    room_type: 'TWN',
    rate: 18500,
    currency: 'JPY',
    status: 'active',
  });

  // 4. airline_contracts
  await testCRUD('航空合約', '/api/custom/airline-contracts', {
    airline_code: 'BR',
    airline_name: '長榮航空',
    route: 'TPE-CTS',
    contract_start: '2026-01-01',
    contract_end: '2026-12-31',
    seat_class: 'economy',
    rate: 12500,
    currency: 'TWD',
    status: 'active',
  });

  // 5. guide_assignments
  await testCRUD('導遊派遣', '/api/custom/guide-assignments', {
    guide_name: '陳志明',
    language: '日文',
    role: '領隊',
    daily_rate: 3500,
    status: 'assigned',
    notes: '持有日本領隊執照',
    // departure_id 需要真實 UUID，先跳過關聯欄位
  });

  // 6. visa_requirements
  await testCRUD('簽證需求', '/api/custom/visa-requirements', {
    country: '日本',
    passport_country: '台灣',
    visa_type: '免簽',
    processing_days: 0,
    fee: 0,
    currency: 'TWD',
    documents_required: '效期六個月以上護照',
    notes: '台灣護照免簽 90 天',
  });

  // 7. insurance_plans
  await testCRUD('保險方案', '/api/custom/insurance-plans', {
    plan_name: '旅平險 A 方案',
    provider: '國泰人壽',
    coverage_type: '旅平險',
    premium: 350,
    coverage_amount: 5000000,
    min_age: 0,
    max_age: 80,
    status: 'active',
  });

  // ─── 二、account_moves 測試 ───────────────────────
  console.log('\n▶ 二、account_moves 讀取測試\n');
  await testEndpoint('account_moves — 列表', `${BASE}/api/accounting/moves?limit=5`);

  // ─── 三、countries / currencies / account_taxes 讀取測試 ───
  console.log('\n▶ 三、核心參考表讀取測試\n');
  await testEndpoint('countries — 列表', `${BASE}/api/countries?limit=5`);
  await testEndpoint('currencies — 列表', `${BASE}/api/currencies?limit=5`);
  await testEndpoint('account_taxes — 列表', `${BASE}/api/accounting/taxes?limit=5`);

  // ─── 結果彙整 ───────────────────────
  console.log('\n================================================================');
  console.log('  測試結果彙整');
  console.log('================================================================\n');

  // 表格輸出
  const pass = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;

  console.log(`總計 ${results.length} 項測試 — ✅ ${pass} 通過 / ❌ ${fail} 失敗\n`);

  // 詳細表
  console.log('│ 狀態 │ HTTP │ 方法   │ 測試項目                              │ 資料筆數 │');
  console.log('├──────┼──────┼────────┼───────────────────────────────────────┼──────────┤');
  for (const r of results) {
    const icon = r.ok ? ' ✅ ' : ' ❌ ';
    const status = String(r.status).padEnd(4);
    const method = r.method.padEnd(6);
    const name = r.name.padEnd(37);
    const count = String(r.dataCount).padEnd(8);
    console.log(`│${icon}│ ${status}│ ${method}│ ${name}│ ${count}│`);
    if (r.detail) {
      console.log(`│      │      │        │   → ${String(r.detail).slice(0, 50).padEnd(33)}│          │`);
    }
  }
  console.log('└──────┴──────┴────────┴───────────────────────────────────────┴──────────┘');

  // 失敗清單
  if (fail > 0) {
    console.log('\n❌ 失敗項目詳情：');
    for (const r of results.filter(r => !r.ok)) {
      console.log(`  • ${r.name}: [${r.status}] ${r.detail}`);
    }
  }
}

main().catch(console.error);
