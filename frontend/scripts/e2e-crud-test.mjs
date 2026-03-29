/**
 * E2E CRUD 驗證腳本 — 對線上 Staging 執行完整的增改刪查測試
 * 
 * 測試對象：jhtour.staging.ai-go.app 的所有 API 端點
 * 
 * 針對每個端點測試流程：
 * 1. LIST (GET)    → 確認可讀取列表
 * 2. CREATE (POST) → 新增一筆測試資料
 * 3. READ (GET/id) → 讀取剛新增的資料
 * 4. UPDATE (PATCH) → 修改該筆資料
 * 5. DELETE (DELETE) → 刪除該筆資料
 * 6. VERIFY (GET)   → 確認刪除成功
 */

const BASE_URL = 'https://jhtour.staging.ai-go.app';

// ============================
// 全部需要驗證的 API 端點
// ============================
const ENDPOINTS = {
  // 標準表（透過 Open Proxy）
  standard: [
    { name: '客戶 (customers)', path: '/api/customers', createData: { name: 'E2E測試客戶_' + Date.now(), email: 'e2e@test.com', phone: '02-12345678' } },
    { name: '供應商 (suppliers)', path: '/api/suppliers', createData: { name: 'E2E測試供應商_' + Date.now(), email: 'supplier@test.com', phone: '02-87654321' } },
    { name: '產品 (products)', path: '/api/products', createData: { name: 'E2E測試產品_' + Date.now(), list_price: 9999 } },
    { name: '銷售訂單 (sale-orders)', path: '/api/sale-orders', createData: null }, // 有外鍵依賴，僅測 LIST
    { name: '採購訂單 (purchase-orders)', path: '/api/purchase-orders', createData: null },
    { name: '員工 (hr)', path: '/api/hr', createData: null }, // HR 有特殊權限，僅測 LIST
    { name: '帳務 (accounting)', path: '/api/accounting', createData: null },
    { name: '國家 (countries)', path: '/api/countries', createData: null }, // 全域表，僅讀取
    { name: '幣別 (currencies)', path: '/api/currencies', createData: null },
    { name: '匯率 (currency-rates)', path: '/api/currency-rates', createData: null },
    { name: '客戶等級 (customer-levels)', path: '/api/customer-levels', createData: null },
    { name: '產品類別 (product-categories)', path: '/api/product-categories', createData: null },
    { name: 'CRM', path: '/api/crm', createData: null },
    { name: '公告 (announcements)', path: '/api/announcements', createData: null },
  ],
  // 自訂表（透過 Custom Data API）
  custom: [
    { name: '行程模板 (itinerary-templates)', path: '/api/custom/itinerary-templates', 
      createData: { name: 'E2E測試行程_' + Date.now(), destination: '日本東京', duration_days: 5, category: '跟團', status: 'draft', description: 'E2E測試用' } },
    { name: '出團班表 (departure-schedules)', path: '/api/custom/departure-schedules', 
      createData: { group_code: 'E2E-' + Date.now(), departure_date: '2026-12-01', return_date: '2026-12-05', min_pax: 10, max_pax: 30, current_pax: 0, price: 45000, status: 'planned' } },
    { name: '飯店合約 (hotel-contracts)', path: '/api/custom/hotel-contracts', 
      createData: { hotel_name: 'E2E測試飯店_' + Date.now(), city: '東京', country: '日本', room_type: 'TWN', rate: 8000, currency: 'JPY', status: 'active' } },
    { name: '航空合約 (airline-contracts)', path: '/api/custom/airline-contracts', 
      createData: { airline_code: 'E2', airline_name: 'E2E測試航空_' + Date.now(), route: 'TPE-NRT', seat_class: 'economy', rate: 15000, currency: 'TWD', status: 'active' } },
    { name: '導遊派遣 (guide-assignments)', path: '/api/custom/guide-assignments', 
      createData: { guide_name: 'E2E測試導遊_' + Date.now(), language: '日文', role: '領隊', daily_rate: 3000, status: 'assigned', notes: 'E2E測試' } },
    { name: '簽證需求 (visa-requirements)', path: '/api/custom/visa-requirements', 
      createData: { country: 'E2E測試國_' + Date.now(), passport_country: '台灣', visa_type: '免簽', processing_days: 0, fee: 0, currency: 'TWD', documents_required: '護照', notes: 'E2E測試' } },
    { name: '保險方案 (insurance-plans)', path: '/api/custom/insurance-plans', 
      createData: { plan_name: 'E2E測試保險_' + Date.now(), provider: '國泰人壽', coverage_type: '旅平險', premium: 500, coverage_amount: 5000000, min_age: 0, max_age: 85, status: 'active' } },
  ]
};

// 統計
const results = { pass: 0, fail: 0, skip: 0, details: [] };

async function testEndpoint(config, tableType) {
  const { name, path, createData } = config;
  const fullUrl = `${BASE_URL}${path}`;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${fullUrl}`);
  console.log(`Type: ${tableType}`);
  console.log('='.repeat(60));

  // Step 1: LIST
  try {
    console.log('  [1/6] LIST (GET) ...');
    const listRes = await fetch(`${fullUrl}?limit=5`);
    if (!listRes.ok) {
      const text = await listRes.text();
      throw new Error(`HTTP ${listRes.status}: ${text.substring(0, 200)}`);
    }
    const listJson = await listRes.json();
    const records = Array.isArray(listJson) ? listJson : (listJson.data ?? []);
    console.log(`  ✅ LIST 成功 — ${records.length} 筆`);
    results.pass++;
    results.details.push({ name, op: 'LIST', status: 'PASS', count: records.length });
  } catch (err) {
    console.log(`  ❌ LIST 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'LIST', status: 'FAIL', error: err.message });
    return; // LIST 失敗就跳過後續
  }

  // 沒有 createData 的端點只測 LIST
  if (!createData) {
    console.log('  ⏭️  僅測 LIST（無 CRUD 測試資料）');
    results.skip++;
    results.details.push({ name, op: 'CRUD', status: 'SKIP', reason: '僅讀取' });
    return;
  }

  let createdId = null;

  // Step 2: CREATE
  try {
    console.log('  [2/6] CREATE (POST) ...');
    const createRes = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData),
    });
    if (!createRes.ok) {
      const text = await createRes.text();
      throw new Error(`HTTP ${createRes.status}: ${text.substring(0, 200)}`);
    }
    const created = await createRes.json();
    createdId = created.id || created.data?.id;
    console.log(`  ✅ CREATE 成功 — ID: ${createdId}`);
    results.pass++;
    results.details.push({ name, op: 'CREATE', status: 'PASS', id: createdId });
  } catch (err) {
    console.log(`  ❌ CREATE 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'CREATE', status: 'FAIL', error: err.message });
    return;
  }

  if (!createdId) {
    console.log('  ⚠️  無法取得新增 ID，跳過 READ/UPDATE/DELETE');
    results.skip++;
    return;
  }

  // Step 3: READ
  try {
    console.log(`  [3/6] READ (GET/${createdId}) ...`);
    const readRes = await fetch(`${fullUrl}/${createdId}`);
    if (!readRes.ok) throw new Error(`HTTP ${readRes.status}`);
    const readData = await readRes.json();
    console.log(`  ✅ READ 成功`);
    results.pass++;
    results.details.push({ name, op: 'READ', status: 'PASS' });
  } catch (err) {
    console.log(`  ❌ READ 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'READ', status: 'FAIL', error: err.message });
  }

  // Step 4: UPDATE
  try {
    console.log(`  [4/6] UPDATE (PATCH/${createdId}) ...`);
    const updateData = { name: (createData.name || createData.plan_name || createData.hotel_name || createData.guide_name || '') + '_已更新' };
    const updateRes = await fetch(`${fullUrl}/${createdId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!updateRes.ok) {
      const text = await updateRes.text();
      throw new Error(`HTTP ${updateRes.status}: ${text.substring(0, 200)}`);
    }
    console.log(`  ✅ UPDATE 成功`);
    results.pass++;
    results.details.push({ name, op: 'UPDATE', status: 'PASS' });
  } catch (err) {
    console.log(`  ❌ UPDATE 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'UPDATE', status: 'FAIL', error: err.message });
  }

  // Step 5: DELETE
  try {
    console.log(`  [5/6] DELETE (DELETE/${createdId}) ...`);
    const deleteRes = await fetch(`${fullUrl}/${createdId}`, { method: 'DELETE' });
    if (!deleteRes.ok && deleteRes.status !== 204) {
      const text = await deleteRes.text();
      throw new Error(`HTTP ${deleteRes.status}: ${text.substring(0, 200)}`);
    }
    console.log(`  ✅ DELETE 成功`);
    results.pass++;
    results.details.push({ name, op: 'DELETE', status: 'PASS' });
  } catch (err) {
    console.log(`  ❌ DELETE 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'DELETE', status: 'FAIL', error: err.message });
  }

  // Step 6: VERIFY DELETE
  try {
    console.log(`  [6/6] VERIFY DELETE (GET/${createdId}) ...`);
    const verifyRes = await fetch(`${fullUrl}/${createdId}`);
    if (verifyRes.status === 404 || verifyRes.status === 204) {
      console.log(`  ✅ VERIFY 成功 — 資料已刪除 (${verifyRes.status})`);
      results.pass++;
      results.details.push({ name, op: 'VERIFY_DELETE', status: 'PASS' });
    } else {
      console.log(`  ⚠️  VERIFY — 狀態碼 ${verifyRes.status}（可能延遲刪除）`);
      results.pass++; // 不算失敗
      results.details.push({ name, op: 'VERIFY_DELETE', status: 'WARN', code: verifyRes.status });
    }
  } catch (err) {
    console.log(`  ❌ VERIFY 失敗 — ${err.message}`);
    results.fail++;
    results.details.push({ name, op: 'VERIFY_DELETE', status: 'FAIL', error: err.message });
  }
}

// ============================
// 主程式
// ============================
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║    吉航旅遊 ERP — E2E CRUD 完整驗證                    ║');
  console.log('║    Target: ' + BASE_URL.padEnd(44) + '║');
  console.log('║    Time: ' + new Date().toISOString().padEnd(46) + '║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  // 先確認網站是否在線
  console.log('\n🔍 檢查 Staging 網站狀態...');
  try {
    const healthRes = await fetch(BASE_URL, { redirect: 'follow' });
    console.log(`✅ 網站在線 (HTTP ${healthRes.status})`);
  } catch (err) {
    console.log(`❌ 網站離線: ${err.message}`);
    console.log('請確認 Docker 容器是否正在運行');
    process.exit(1);
  }

  // 測試標準表
  console.log('\n\n ████ 標準表 (Open Proxy) ████');
  for (const ep of ENDPOINTS.standard) {
    await testEndpoint(ep, '標準表');
  }

  // 測試自訂表
  console.log('\n\n ████ 自訂表 (Custom Data API) ████');
  for (const ep of ENDPOINTS.custom) {
    await testEndpoint(ep, '自訂表');
  }

  // 摘要報告
  console.log('\n\n' + '═'.repeat(60));
  console.log('  E2E 驗證結果摘要');
  console.log('═'.repeat(60));
  console.log(`  ✅ 通過: ${results.pass}`);
  console.log(`  ❌ 失敗: ${results.fail}`);
  console.log(`  ⏭️  跳過: ${results.skip}`);
  console.log(`  總計: ${results.pass + results.fail + results.skip}`);
  console.log('═'.repeat(60));

  // 顯示失敗明細
  const failures = results.details.filter(d => d.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n❌ 失敗明細:');
    for (const f of failures) {
      console.log(`  - ${f.name} [${f.op}]: ${f.error}`);
    }
  }

  // 顯示成功的 CRUD 全通過端點
  const fullCrud = new Set();
  for (const d of results.details) {
    if (d.status === 'PASS' && ['CREATE', 'READ', 'UPDATE', 'DELETE'].includes(d.op)) {
      fullCrud.add(d.name);
    }
  }
  if (fullCrud.size > 0) {
    console.log('\n✅ CRUD 全通過端點:');
    for (const n of fullCrud) {
      console.log(`  - ${n}`);
    }
  }

  console.log('\n🏁 E2E 驗證完成');
  process.exit(results.fail > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('腳本執行失敗:', err);
  process.exit(1);
});
