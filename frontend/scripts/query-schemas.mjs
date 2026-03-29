/**
 * 深度探查 — announcements 完整欄位 + sale/purchase 的 FK 名稱
 */
const BASE = 'https://ai-go.app/api/v1/open/proxy';
const API_KEY = 'sk_live_0f9d37c8c8504ab73f15fa9f56494a35607b5f55d5e213f66b790f917d00f4c0';
const H = { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' };
const TS = Date.now();

async function probe(table, data, label) {
  const res = await fetch(`${BASE}/${table}`, { method: 'POST', headers: H, body: JSON.stringify(data) });
  const body = await res.text();
  if (res.status === 201 || res.status === 200) {
    const json = JSON.parse(body);
    console.log(`  ✅ ${label} → ${res.status} ID=${json.id}`);
    // 讀取完整記錄看有哪些欄位
    const readRes = await fetch(`${BASE}/${table}/${json.id}`, { headers: { 'X-API-Key': API_KEY } });
    if (readRes.ok) {
      const record = await readRes.json();
      console.log(`     欄位: ${Object.keys(record).join(', ')}`);
      console.log(`     值: ${JSON.stringify(record).substring(0, 500)}`);
    }
    try { await fetch(`${BASE}/${table}/${json.id}`, { method: 'DELETE', headers: H }); } catch {}
    return true;
  }
  console.log(`  ❌ ${label} → ${res.status}: ${body.substring(0, 200)}`);
  return false;
}

async function main() {
  // ===== announcements 深度探查 =====
  console.log('\n📋 announcements 深度探查');
  // 試各種可能的欄位名
  const annFields = [
    { title: `公告_${TS}`, content: '測試', announcement_type: 'general' },
    { title: `公告_${TS}`, announcement_type: 'general', published: true },
    { title: `公告_${TS}`, content: '測試', published: true },
    { title: `公告_${TS}`, text: '測試' },
    { subject: `公告_${TS}` },
    { title: `公告_${TS}`, body_html: '<p>測試</p>' },
    { title: `公告_${TS}`, description: '測試' },
    { title: `公告_${TS}`, active: true },
  ];
  for (const f of annFields) await probe('announcements', f, Object.keys(f).join('+'));

  // ===== sale_orders 深度探查 =====
  console.log('\n📋 sale_orders 深度探查');
  // 建客戶
  const cRes = await fetch(`${BASE}/customers`, { method: 'POST', headers: H,
    body: JSON.stringify({ name: `探查客戶2_${TS}`, customer_type: 'company' }) });
  const cust = cRes.ok ? await cRes.json() : null;
  console.log(`  客戶 ID: ${cust?.id}`);

  // 嘗試更多欄位組合（Odoo 的 sale.order 關鍵欄位）
  const soFields = [
    { partner_id: cust?.id, date_order: '2026-03-29' },
    { partner_id: cust?.id, date_order: '2026-03-29', pricelist_id: null },
    { partner_id: cust?.id, date_order: '2026-03-29', state: 'draft', currency_id: null },
    { partner_id: cust?.id, company_id: null },
    { customer_id: cust?.id, date_order: '2026-03-29' },
  ];
  for (const f of soFields) await probe('sale_orders', f, Object.keys(f).filter(k=>f[k]!==null).join('+'));

  // ===== purchase_orders 深度探查 =====
  console.log('\n📋 purchase_orders 深度探查');
  const sRes = await fetch(`${BASE}/suppliers`, { method: 'POST', headers: H,
    body: JSON.stringify({ name: `探查供應商2_${TS}`, supplier_type: 'company' }) });
  const supp = sRes.ok ? await sRes.json() : null;
  console.log(`  供應商 ID: ${supp?.id}`);

  const poFields = [
    { partner_id: supp?.id, date_order: '2026-03-29' },
    { partner_id: supp?.id, date_planned: '2026-03-29' },
    { supplier_id: supp?.id, date_order: '2026-03-29' },
  ];
  for (const f of poFields) await probe('purchase_orders', f, Object.keys(f).join('+'));

  // 清理
  if (cust?.id) await fetch(`${BASE}/customers/${cust.id}`, { method: 'DELETE', headers: H });
  if (supp?.id) await fetch(`${BASE}/suppliers/${supp.id}`, { method: 'DELETE', headers: H });
}

main().catch(console.error);
