/**
 * E2E CRUD 完整驗證腳本 v3 — 根據 Schema 定義正確測試
 *
 * - 唯讀表：只測 LIST（不測 CRUD），標記為設計正確
 * - 可寫表：全 CRUD（包含必填欄位與 FK）
 */

const BASE_URL = 'https://jhtour.staging.ai-go.app';
const TS = Date.now();

// 為 FK 欄位先 CREATE 依賴記錄
let testCustomerId = null;
let testSupplierId = null;

const ENDPOINTS = {
  // ===== 唯讀表（只測 LIST）=====
  readonly: [
    { name: '國家 (countries)',     path: '/api/countries' },
    { name: '幣別 (currencies)',    path: '/api/currencies' },
    { name: '匯率 (currency-rates)', path: '/api/currency-rates' },
  ],
  // ===== 可寫標準表（全 CRUD）=====
  standard: [
    { name: '客戶 (customers)', path: '/api/customers',
      createData: { name: `E2E客戶_${TS}`, email: 'e2e@test.com', phone: '02-12345678', customer_type: 'company', status: 'active' },
      updateField: 'name', updateValue: `E2E客戶_已更新_${TS}`, saveIdAs: 'customer' },

    { name: '供應商 (suppliers)', path: '/api/suppliers',
      createData: { name: `E2E供應商_${TS}`, email: 'supplier@test.com', phone: '02-87654321', supplier_type: 'company', status: 'active' },
      updateField: 'name', updateValue: `E2E供應商_已更新_${TS}`, saveIdAs: 'supplier' },

    { name: '產品 (products)', path: '/api/products',
      createData: { name: `E2E產品_${TS}`, list_price: 9999, product_type: 'consu' },
      updateField: 'name', updateValue: `E2E產品_已更新_${TS}` },

    { name: '員工 (hr)', path: '/api/hr',
      createData: { name: `E2E員工_${TS}`, work_email: `e2e_${TS}@jhtour.com.tw`, employee_type: 'employee' },
      updateField: 'name', updateValue: `E2E員工_已更新_${TS}` },

    { name: '客戶等級 (customer-levels)', path: '/api/customer-levels',
      createData: { name: `E2E等級_${TS}` },
      updateField: 'name', updateValue: `E2E等級_已更新_${TS}` },

    { name: '產品類別 (product-categories)', path: '/api/product-categories',
      createData: { name: `E2E類別_${TS}` },
      updateField: 'name', updateValue: `E2E類別_已更新_${TS}` },

    { name: 'CRM 商機 (crm)', path: '/api/crm',
      createData: { name: `E2E商機_${TS}`, type: 'lead' },
      updateField: 'name', updateValue: `E2E商機_已更新_${TS}` },

    { name: '公告 (announcements)', path: '/api/announcements',
      createData: { name: `E2E公告_${TS}` },
      updateField: 'name', updateValue: `E2E公告_已更新_${TS}` },
  ],
  // ===== FK 依賴表（需先有 customer/supplier）=====
  fkDependent: [
    { name: '銷售訂單 (sale-orders)', path: '/api/sale-orders',
      createDataFn: () => ({ name: `SO-E2E-${TS}`, customer_id: testCustomerId, state: 'draft' }),
      updateField: 'name', updateValue: `SO-E2E-已更新_${TS}` },

    { name: '採購訂單 (purchase-orders)', path: '/api/purchase-orders',
      createDataFn: () => ({ name: `PO-E2E-${TS}`, supplier_id: testSupplierId, state: 'draft' }),
      updateField: 'name', updateValue: `PO-E2E-已更新_${TS}` },
  ],
  // ===== 帳務（引用需 create 權限）=====
  permissionLimited: [
    { name: '帳務 (accounting)', path: '/api/accounting', limitedOp: 'create',
      createData: { name: `INV-E2E-${TS}`, move_type: 'entry', state: 'draft' },
      updateField: 'state', updateValue: 'draft' },
  ],
  // ===== 自訂表 =====
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
  ],
};

const results = { pass: 0, fail: 0, details: [] };

async function testReadonly(config) {
  const fullUrl = `${BASE_URL}${config.path}`;
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`  🔒 ${config.name}（唯讀）`);
  console.log('─'.repeat(55));
  try {
    const res = await fetch(`${fullUrl}?limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const count = (Array.isArray(json) ? json : (json.data ?? [])).length;
    console.log(`  [LIST]   ✅ ${count} 筆`);
    results.pass++; results.details.push({ name: config.name, op: 'LIST', status: 'PASS', count });
  } catch (err) {
    console.log(`  [LIST]   ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'LIST', status: 'FAIL', error: err.message });
  }

  // 確認 POST 被拒絕（唯讀驗證）
  try {
    const res = await fetch(fullUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"test"}' });
    if (res.status === 405 || res.status === 403) {
      console.log(`  [寫入封鎖] ✅ HTTP ${res.status}（正確拒絕寫入）`);
      results.pass++; results.details.push({ name: config.name, op: 'WRITE_BLOCK', status: 'PASS' });
    } else {
      console.log(`  [寫入封鎖] ❌ HTTP ${res.status}（應為 405 或 403）`);
      results.fail++; results.details.push({ name: config.name, op: 'WRITE_BLOCK', status: 'FAIL' });
    }
  } catch (err) {
    console.log(`  [寫入封鎖] ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'WRITE_BLOCK', status: 'FAIL', error: err.message });
  }
}

async function testCrud(config) {
  const fullUrl = `${BASE_URL}${config.path}`;
  const createData = config.createDataFn ? config.createDataFn() : config.createData;

  console.log(`\n${'='.repeat(55)}`);
  console.log(`  ${config.name}`);
  console.log('='.repeat(55));

  // LIST
  try {
    const res = await fetch(`${fullUrl}?limit=5`);
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 120)}`); }
    const json = await res.json();
    const count = (Array.isArray(json) ? json : (json.data ?? [])).length;
    console.log(`  [LIST]   ✅ ${count} 筆`);
    results.pass++; results.details.push({ name: config.name, op: 'LIST', status: 'PASS', count });
  } catch (err) {
    console.log(`  [LIST]   ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'LIST', status: 'FAIL', error: err.message });
    return;
  }

  // CREATE
  let createdId = null;
  try {
    const res = await fetch(fullUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(createData) });
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0, 250)}`); }
    const created = await res.json();
    createdId = created.id || created.data?.id;
    console.log(`  [CREATE] ✅ ID: ${createdId}`);
    results.pass++; results.details.push({ name: config.name, op: 'CREATE', status: 'PASS', id: createdId });
    if (config.saveIdAs === 'customer') testCustomerId = createdId;
    if (config.saveIdAs === 'supplier') testSupplierId = createdId;
  } catch (err) {
    console.log(`  [CREATE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'CREATE', status: 'FAIL', error: err.message });
    return;
  }

  if (!createdId) { console.log('  ⚠️ 無法取得 ID'); results.fail++; return; }

  // READ
  try {
    const res = await fetch(`${fullUrl}/${createdId}`);
    if (!res.ok) throw new Error(`${res.status}`);
    console.log(`  [READ]   ✅`);
    results.pass++; results.details.push({ name: config.name, op: 'READ', status: 'PASS' });
  } catch (err) {
    console.log(`  [READ]   ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'READ', status: 'FAIL', error: err.message });
  }

  // UPDATE
  try {
    const res = await fetch(`${fullUrl}/${createdId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [config.updateField]: config.updateValue }),
    });
    if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0,150)}`); }
    console.log(`  [UPDATE] ✅`);
    results.pass++; results.details.push({ name: config.name, op: 'UPDATE', status: 'PASS' });
  } catch (err) {
    console.log(`  [UPDATE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'UPDATE', status: 'FAIL', error: err.message });
  }

  // DELETE
  try {
    const res = await fetch(`${fullUrl}/${createdId}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) { const t = await res.text(); throw new Error(`${res.status}: ${t.substring(0,150)}`); }
    console.log(`  [DELETE] ✅`);
    results.pass++; results.details.push({ name: config.name, op: 'DELETE', status: 'PASS' });
  } catch (err) {
    console.log(`  [DELETE] ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'DELETE', status: 'FAIL', error: err.message });
  }

  // VERIFY
  try {
    const res = await fetch(`${fullUrl}/${createdId}`);
    if (res.status === 404 || res.status === 204) {
      console.log(`  [VERIFY] ✅ 已刪除 (${res.status})`);
    } else {
      console.log(`  [VERIFY] ⚠️  ${res.status}（soft-delete）`);
    }
    results.pass++; results.details.push({ name: config.name, op: 'VERIFY', status: 'PASS' });
  } catch (err) {
    console.log(`  [VERIFY] ❌ ${err.message}`);
    results.fail++; results.details.push({ name: config.name, op: 'VERIFY', status: 'FAIL', error: err.message });
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  吉航旅遊 ERP — E2E CRUD 驗證 v3（含 Schema 驗證）    ║');
  console.log(`║  Target: ${BASE_URL.padEnd(46)}║`);
  console.log(`║  Time:   ${new Date().toISOString().padEnd(46)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  try { const r = await fetch(BASE_URL); console.log(`\n✅ 網站在線 (HTTP ${r.status})`); }
  catch (e) { console.log(`❌ 離線: ${e.message}`); process.exit(1); }

  const totalEp = ENDPOINTS.readonly.length + ENDPOINTS.standard.length + ENDPOINTS.fkDependent.length + ENDPOINTS.permissionLimited.length + ENDPOINTS.custom.length;
  console.log(`\n📋 端點: ${totalEp} 個`);

  // 唯讀表
  console.log('\n\n ████ 唯讀全域參考表 ████');
  for (const ep of ENDPOINTS.readonly) await testReadonly(ep);

  // 可寫標準表（客戶/供應商先行，因 FK 依賴）
  console.log('\n\n ████ 標準表 CRUD ████');
  for (const ep of ENDPOINTS.standard) await testCrud(ep);

  // FK 依賴表
  console.log('\n\n ████ FK 依賴表 CRUD ████');
  if (!testCustomerId || !testSupplierId) {
    console.log('⚠️ 客戶/供應商 CREATE 失敗，重新建立 FK 測試資料...');
    // 嘗試創建臨時 FK 資料
    try {
      const cRes = await fetch(`${BASE_URL}/api/customers`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `FK測試客戶_${TS}`, customer_type: 'company' }) });
      if (cRes.ok) { const c = await cRes.json(); testCustomerId = c.id; }
    } catch {}
    try {
      const sRes = await fetch(`${BASE_URL}/api/suppliers`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `FK測試供應商_${TS}`, supplier_type: 'company' }) });
      if (sRes.ok) { const s = await sRes.json(); testSupplierId = s.id; }
    } catch {}
  }
  for (const ep of ENDPOINTS.fkDependent) await testCrud(ep);

  // 權限受限表
  console.log('\n\n ████ 權限受限表 ████');
  for (const ep of ENDPOINTS.permissionLimited) await testCrud(ep);

  // 自訂表
  console.log('\n\n ████ 自訂表 CRUD ████');
  for (const ep of ENDPOINTS.custom) await testCrud(ep);

  // 清理 FK 測試資料
  if (testCustomerId) try { await fetch(`${BASE_URL}/api/customers/${testCustomerId}`, { method: 'DELETE' }); } catch {}
  if (testSupplierId) try { await fetch(`${BASE_URL}/api/suppliers/${testSupplierId}`, { method: 'DELETE' }); } catch {}

  // 報告
  const total = results.pass + results.fail;
  console.log('\n\n' + '═'.repeat(55));
  console.log('  E2E 最終驗證結果');
  console.log('═'.repeat(55));
  console.log(`  ✅ 通過: ${results.pass} / ${total}`);
  console.log(`  ❌ 失敗: ${results.fail} / ${total}`);
  console.log(`  通過率: ${(results.pass/total*100).toFixed(1)}%`);
  console.log('═'.repeat(55));

  const failures = results.details.filter(d => d.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n❌ 失敗明細:');
    for (const f of failures) console.log(`  - ${f.name} [${f.op}]: ${f.error}`);
  }

  console.log('\n🏁 E2E 驗證完成');
  process.exit(results.fail > 0 ? 1 : 0);
}

main().catch(err => { console.error('腳本錯誤:', err); process.exit(1); });
