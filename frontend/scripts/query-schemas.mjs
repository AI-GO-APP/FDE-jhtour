/**
 * 深度探查可寫子路由表的必填欄位
 */
const BASE = 'https://ai-go.app/api/v1/open/proxy';
const API_KEY = 'sk_live_0f9d37c8c8504ab73f15fa9f56494a35607b5f55d5e213f66b790f917d00f4c0';
const H = { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' };
const TS = Date.now();

async function probe(table, data, label) {
  const res = await fetch(`${BASE}/${table}`, { method: 'POST', headers: H, body: JSON.stringify(data) });
  const body = await res.text();
  if (res.status === 200 || res.status === 201) {
    const json = JSON.parse(body);
    console.log(`  ✅ ${label} → ${res.status} ID=${json.id}`);
    const readRes = await fetch(`${BASE}/${table}/${json.id}`, { headers: { 'X-API-Key': API_KEY } });
    if (readRes.ok) { const r = await readRes.json(); console.log(`     欄位: ${Object.keys(r).join(', ')}`); }
    try { await fetch(`${BASE}/${table}/${json.id}`, { method: 'DELETE', headers: H }); } catch {}
    return true;
  }
  console.log(`  ❌ ${label} → ${res.status}: ${body.substring(0, 150)}`);
  return false;
}

async function main() {
  // account_payments
  console.log('\n📋 account_payments');
  await probe('account_payments', { name: `PAY_${TS}` }, 'name');
  await probe('account_payments', { amount: 100, date: '2026-03-29' }, 'amount+date');
  await probe('account_payments', { amount: 100, date: '2026-03-29', payment_type: 'inbound' }, 'amount+date+type');

  // hr_departments
  console.log('\n📋 hr_departments');
  await probe('hr_departments', { name: `部門_${TS}` }, 'name');

  // hr_leaves
  console.log('\n📋 hr_leaves');
  await probe('hr_leaves', { name: `假單_${TS}` }, 'name');
  await probe('hr_leaves', { holiday_status_id: null, date_from: '2026-03-29', date_to: '2026-03-30' }, 'dates');

  // sale_order_lines — 需先建 sale_order
  console.log('\n📋 sale_order_lines');
  // 先建客戶
  let custRes = await fetch(`${BASE}/customers`, { method: 'POST', headers: H, body: JSON.stringify({ name: `探查客戶_${TS}`, customer_type: 'company' }) });
  let cust = custRes.ok ? await custRes.json() : null;
  // 建 sale_order
  let soRes = cust ? await fetch(`${BASE}/sale_orders`, { method: 'POST', headers: H, body: JSON.stringify({ partner_id: cust.id, date_order: '2026-03-29' }) }) : null;
  let so = soRes?.ok ? await soRes.json() : null;
  console.log(`  準備: SO=${so?.id}`);
  if (so) {
    await probe('sale_order_lines', { order_id: so.id, name: `明細_${TS}` }, 'order_id+name');
    await probe('sale_order_lines', { order_id: so.id, name: `明細_${TS}`, product_id: null, product_uom_qty: 1 }, 'order_id+name+qty');
  }

  // announcements — 深度探查 title 組合
  console.log('\n📋 announcements (AI GO 已修)');
  await probe('announcements', { title: `公告_${TS}` }, 'title');
  await probe('announcements', { title: `公告_${TS}`, content: '測試內容' }, 'title+content');
  await probe('announcements', { title: `公告_${TS}`, active: true }, 'title+active');

  // account_moves — 重測
  console.log('\n📋 account_moves (AI GO 已修)');
  // LIST
  const amRes = await fetch(`${BASE}/account_moves?limit=1`, { headers: { 'X-API-Key': API_KEY } });
  console.log(`  LIST → ${amRes.status}`);
  // CREATE
  await probe('account_moves', { move_type: 'entry', date: '2026-03-29' }, 'move_type+date');

  // 清理
  if (so) try { await fetch(`${BASE}/sale_orders/${so.id}`, { method: 'DELETE', headers: H }); } catch {}
  if (cust) try { await fetch(`${BASE}/customers/${cust.id}`, { method: 'DELETE', headers: H }); } catch {}
}
main().catch(console.error);
