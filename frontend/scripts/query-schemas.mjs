/**
 * 透過 Open Proxy GET 查詢每個表的欄位結構（讀一筆取得 key names）
 * 再搭配 AI GO 文件 §8 確認必填 / FK
 */
const BASE = 'https://ai-go.app/api/v1/open/proxy';
const API_KEY = 'sk_live_0f9d37c8c8504ab73f15fa9f56494a35607b5f55d5e213f66b790f917d00f4c0';

const TABLES = [
  'customers', 'suppliers', 'product_products', 'product_categories',
  'sale_orders', 'sale_order_lines', 'purchase_orders', 'purchase_order_lines',
  'hr_employees', 'account_moves', 'crm_leads', 'customer_levels',
  'announcements', 'countries', 'currencies', 'currency_rates',
];

const HEADERS = { 'X-API-Key': API_KEY };

async function main() {
  console.log('=== 透過 Open Proxy 讀取每表欄位 ===\n');

  for (const table of TABLES) {
    try {
      const res = await fetch(`${BASE}/${table}?limit=1`, { headers: HEADERS });
      if (!res.ok) {
        const body = await res.text();
        console.log(`❌ ${table}: HTTP ${res.status} — ${body.substring(0, 120)}`);
        continue;
      }
      const rows = await res.json();
      if (rows.length > 0) {
        const keys = Object.keys(rows[0]).filter(k => !['custom_data'].includes(k));
        console.log(`✅ ${table} — 欄位: ${keys.join(', ')}`);
      } else {
        console.log(`⚠️  ${table} — 0 筆（需 POST 測試來看欄位）`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  // 測試 POST 以觀察錯誤回傳的必填欄位資訊
  console.log('\n\n=== POST 測試（空 body 推斷必填欄位）===\n');
  const writeable = ['customers', 'suppliers', 'sale_orders', 'purchase_orders', 'hr_employees', 'account_moves', 'crm_leads', 'announcements'];

  for (const table of writeable) {
    try {
      const res = await fetch(`${BASE}/${table}`, {
        method: 'POST', headers: { ...HEADERS, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const body = await res.text();
      console.log(`${table} POST → ${res.status}: ${body.substring(0, 250)}`);
    } catch (err) {
      console.log(`${table} POST → Error: ${err.message}`);
    }
  }
}

main();
