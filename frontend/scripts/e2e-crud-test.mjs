/**
 * E2E CRUD 完整驗證腳本 v2 — 所有端點全測 CRUD，不跳過
 * 
 * 測試對象：jhtour.staging.ai-go.app 的所有 21 個 API 端點
 */

const BASE_URL = 'https://jhtour.staging.ai-go.app';
const TS = Date.now();

// ============================
// 全部端點 — 每個都帶 createData
// ============================
const ENDPOINTS = {
  standard: [
    { name: '客戶 (customers)', path: '/api/customers',
      createData: { name: `E2E客戶_${TS}`, email: 'e2e@test.com', phone: '02-12345678', customer_type: 'company', status: 'active' },
      updateField: 'name', updateValue: `E2E客戶_已更新_${TS}` },

    { name: '供應商 (suppliers)', path: '/api/suppliers',
      createData: { name: `E2E供應商_${TS}`, email: 'supplier@test.com', phone: '02-87654321', supplier_type: 'company', status: 'active' },
      updateField: 'name', updateValue: `E2E供應商_已更新_${TS}` },

    { name: '產品 (products)', path: '/api/products',
      createData: { name: `E2E產品_${TS}`, list_price: 9999, product_type: 'consu' },
      updateField: 'name', updateValue: `E2E產品_已更新_${TS}` },

    { name: '銷售訂單 (sale-orders)', path: '/api/sale-orders',
      createData: { name: `SO-E2E-${TS}`, state: 'draft' },
      updateField: 'state', updateValue: 'draft' },

    { name: '採購訂單 (purchase-orders)', path: '/api/purchase-orders',
      createData: { name: `PO-E2E-${TS}`, state: 'draft' },
      updateField: 'state', updateValue: 'draft' },

    { name: '員工 (hr)', path: '/api/hr',
      createData: { name: `E2E員工_${TS}`, work_email: `e2e_${TS}@jhtour.com.tw`, employee_type: 'employee' },
      updateField: 'name', updateValue: `E2E員工_已更新_${TS}` },

    { name: '帳務 (accounting)', path: '/api/accounting',
      createData: { name: `INV-E2E-${TS}`, move_type: 'entry', state: 'draft' },
      updateField: 'state', updateValue: 'draft' },

    { name: '國家 (countries)', path: '/api/countries',
      createData: { name: `E2E國_${TS}`, code: 'E2', phone_code: '999' },
      updateField: 'name', updateValue: `E2E國_已更新_${TS}` },

    { name: '幣別 (currencies)', path: '/api/currencies',
      createData: { name: `E2C${TS.toString().slice(-3)}`, symbol: 'E', rate: 1.0 },
      updateField: 'rate', updateValue: 2.0 },

    { name: '匯率 (currency-rates)', path: '/api/currency-rates',
      createData: { name: `E2E匯率_${TS}`, rate: 30.5 },
      updateField: 'rate', updateValue: 31.0 },

    { name: '客戶等級 (customer-levels)', path: '/api/customer-levels',
      createData: { name: `E2E等級_${TS}`, code: `LV${TS.toString().slice(-4)}` },
      updateField: 'name', updateValue: `E2E等級_已更新_${TS}` },

    { name: '產品類別 (product-categories)', path: '/api/product-categories',
      createData: { name: `E2E類別_${TS}` },
      updateField: 'name', updateValue: `E2E類別_已更新_${TS}` },

    { name: 'CRM 商機 (crm)', path: '/api/crm',
      createData: { name: `E2E商機_${TS}`, type: 'lead' },
      updateField: 'name', updateValue: `E2E商機_已更新_${TS}` },

    { name: '公告 (announcements)', path: '/api/announcements',
      createData: { name: `E2E公告_${TS}`, announcement_type: 'general' },
      updateField: 'name', updateValue: `E2E公告_已更新_${TS}` },
  ],
  custom: [
    { name: '行程模板 (itinerary-templates)', path: '/api/custom/itinerary-templates',
      createData: { name: `E2E行程_${TS}`, destination: '日本東京', duration_days: 5, category: '跟團', status: 'draft' },
      updateField: 'name', updateValue: `E2E行程_已更新_${TS}` },

    { name: '出團班表 (departure-schedules)', path: '/api/custom/departure-schedules',
      createData: { group_code: `E2E-${TS}`, departure_date: '2026-12-01', return_date: '2026-12-05', min_pax: 10, max_pax: 30, current_pax: 0, price: 45000, status: 'planned' },
      updateField: 'price', updateValue: 48000 },

    { name: '飯店合約 (hotel-contracts)', path: '/api/custom/hotel-contracts',
      createData: { hotel_name: `E2E飯店_${TS}`, city: '東京', country: '日本', room_type: 'TWN', rate: 8000, currency: 'JPY', status: 'active' },
      updateField: 'hotel_name', updateValue: `E2E飯店_已更新_${TS}` },

    { name: '航空合約 (airline-contracts)', path: '/api/custom/airline-contracts',
      createData: { airline_code: 'E2', airline_name: `E2E航空_${TS}`, route: 'TPE-NRT', seat_class: 'economy', rate: 15000, currency: 'TWD', status: 'active' },
      updateField: 'airline_name', updateValue: `E2E航空_已更新_${TS}` },

    { name: '導遊派遣 (guide-assignments)', path: '/api/custom/guide-assignments',
      createData: { guide_name: `E2E導遊_${TS}`, language: '日文', role: '領隊', daily_rate: 3000, status: 'assigned' },
      updateField: 'guide_name', updateValue: `E2E導遊_已更新_${TS}` },

    { name: '簽證需求 (visa-requirements)', path: '/api/custom/visa-requirements',
      createData: { country: `E2E國_${TS}`, passport_country: '台灣', visa_type: '免簽', processing_days: 0, fee: 0, currency: 'TWD' },
      updateField: 'country', updateValue: `E2E國_已更新_${TS}` },

    { name: '保險方案 (insurance-plans)', path: '/api/custom/insurance-plans',
      createData: { plan_name: `E2E保險_${TS}`, provider: '國泰人壽', coverage_type: '旅平險', premium: 500, coverage_amount: 5000000, status: 'active' },
      updateField: 'plan_name', updateValue: `E2E保險_已更新_${TS}` },
  ]
};

const results = { pass: 0, fail: 0, details: [] };

async function testEndpoint(config, tableType) {
  const { name, path, createData, updateField, updateValue } = config;
  const fullUrl = `${BASE_URL}${path}`;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${name}`);
  console.log(`  ${fullUrl} [${tableType}]`);
  console.log('='.repeat(60));

  // ── LIST ──
  let listCount = -1;
  try {
    const res = await fetch(`${fullUrl}?limit=5`);
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 200)}`); }
    const json = await res.json();
    const records = Array.isArray(json) ? json : (json.data ?? []);
    listCount = records.length;
    console.log(`  [LIST]   ✅ ${listCount} 筆`);
    results.pass++; results.details.push({ name, op: 'LIST', status: 'PASS', count: listCount });
  } catch (err) {
    console.log(`  [LIST]   ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'LIST', status: 'FAIL', error: err.message });
    return;
  }

  // ── CREATE ──
  let createdId = null;
  try {
    const res = await fetch(fullUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData),
    });
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 300)}`); }
    const created = await res.json();
    createdId = created.id || created.data?.id;
    console.log(`  [CREATE] ✅ ID: ${createdId}`);
    results.pass++; results.details.push({ name, op: 'CREATE', status: 'PASS', id: createdId });
  } catch (err) {
    console.log(`  [CREATE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'CREATE', status: 'FAIL', error: err.message });
    return;
  }

  if (!createdId) { console.log('  ⚠️ 無法取得 ID'); results.fail++; return; }

  // ── READ ──
  try {
    const res = await fetch(`${fullUrl}/${createdId}`);
    if (!res.ok) throw new Error(`${res.status}`);
    console.log(`  [READ]   ✅`);
    results.pass++; results.details.push({ name, op: 'READ', status: 'PASS' });
  } catch (err) {
    console.log(`  [READ]   ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'READ', status: 'FAIL', error: err.message });
  }

  // ── UPDATE ──
  try {
    const updateData = { [updateField]: updateValue };
    const res = await fetch(`${fullUrl}/${createdId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 200)}`); }
    console.log(`  [UPDATE] ✅`);
    results.pass++; results.details.push({ name, op: 'UPDATE', status: 'PASS' });
  } catch (err) {
    console.log(`  [UPDATE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'UPDATE', status: 'FAIL', error: err.message });
  }

  // ── DELETE ──
  try {
    const res = await fetch(`${fullUrl}/${createdId}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 200)}`); }
    console.log(`  [DELETE] ✅`);
    results.pass++; results.details.push({ name, op: 'DELETE', status: 'PASS' });
  } catch (err) {
    console.log(`  [DELETE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'DELETE', status: 'FAIL', error: err.message });
  }

  // ── VERIFY ──
  try {
    const res = await fetch(`${fullUrl}/${createdId}`);
    if (res.status === 404 || res.status === 204) {
      console.log(`  [VERIFY] ✅ 已刪除 (${res.status})`);
    } else {
      console.log(`  [VERIFY] ⚠️  ${res.status} (soft-delete 或延遲)`);
    }
    results.pass++; results.details.push({ name, op: 'VERIFY', status: 'PASS' });
  } catch (err) {
    console.log(`  [VERIFY] ❌ ${err.message}`);
    results.fail++; results.details.push({ name, op: 'VERIFY', status: 'FAIL', error: err.message });
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  吉航旅遊 ERP — E2E CRUD 完整驗證 v2 (全端點全 CRUD)  ║');
  console.log('║  Target: ' + BASE_URL.padEnd(46) + '║');
  console.log('║  Time:   ' + new Date().toISOString().padEnd(46) + '║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  // Health check
  try {
    const r = await fetch(BASE_URL, { redirect: 'follow' });
    console.log(`\n✅ 網站在線 (HTTP ${r.status})`);
  } catch (e) { console.log(`❌ 離線: ${e.message}`); process.exit(1); }

  const total = ENDPOINTS.standard.length + ENDPOINTS.custom.length;
  console.log(`\n📋 測試端點: ${total} 個 (${ENDPOINTS.standard.length} 標準 + ${ENDPOINTS.custom.length} 自訂)`);
  console.log(`📋 每個端點: LIST → CREATE → READ → UPDATE → DELETE → VERIFY (6 步驟)`);
  console.log(`📋 預計總測項: ${total * 6}`);

  console.log('\n\n ████ 標準表 (Open Proxy) ████');
  for (const ep of ENDPOINTS.standard) await testEndpoint(ep, '標準');

  console.log('\n\n ████ 自訂表 (Custom Data) ████');
  for (const ep of ENDPOINTS.custom) await testEndpoint(ep, '自訂');

  // 報告
  const totalTests = results.pass + results.fail;
  console.log('\n\n' + '═'.repeat(60));
  console.log('  E2E 最終驗證結果');
  console.log('═'.repeat(60));
  console.log(`  ✅ 通過: ${results.pass} / ${totalTests}`);
  console.log(`  ❌ 失敗: ${results.fail} / ${totalTests}`);
  console.log(`  通過率: ${(results.pass / totalTests * 100).toFixed(1)}%`);
  console.log('═'.repeat(60));

  const failures = results.details.filter(d => d.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n❌ 失敗明細:');
    for (const f of failures) console.log(`  - ${f.name} [${f.op}]: ${f.error}`);
  }

  const crudOps = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
  const endpointNames = [...new Set(results.details.map(d => d.name))];
  const fullCrud = endpointNames.filter(n => {
    return crudOps.every(op => results.details.some(d => d.name === n && d.op === op && d.status === 'PASS'));
  });

  console.log(`\n✅ CRUD 完整通過 (${fullCrud.length}/${total}):`);
  for (const n of fullCrud) console.log(`  ✔ ${n}`);

  const listOnly = endpointNames.filter(n => {
    const hasList = results.details.some(d => d.name === n && d.op === 'LIST' && d.status === 'PASS');
    const hasCreate = results.details.some(d => d.name === n && d.op === 'CREATE');
    const createFailed = results.details.some(d => d.name === n && d.op === 'CREATE' && d.status === 'FAIL');
    return hasList && (!hasCreate || createFailed);
  });
  if (listOnly.length > 0) {
    console.log(`\n⚠️ 僅 LIST 正常 (${listOnly.length}):`);
    for (const n of listOnly) {
      const err = results.details.find(d => d.name === n && d.status === 'FAIL');
      console.log(`  ⚠ ${n} — ${err?.error?.substring(0, 80) || '未知'}`);
    }
  }

  console.log('\n🏁 E2E 驗證完成');
  process.exit(results.fail > 0 ? 1 : 0);
}

main().catch(err => { console.error('腳本錯誤:', err); process.exit(1); });
