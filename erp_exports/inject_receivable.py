"""
應收明細表 → sale_orders + sale_order_lines 注入
設計為可重複執行、可接受多個日期區間的 .xls 檔案

映射邏輯：
  每個 Sheet (= 1 個出團) → 1 筆 sale_order
  每位旅客 → 1 筆 sale_order_line

  sale_order:
    name            = 團號 (Sheet name)
    client_order_ref= 團號
    state           = 'sale' (已確認)
    date_order      = 出發日期
    amount_total    = 該團所有 line 的應收團費加總
    customer_id     = 應收對象 → ref 查 customers
    custom_data     = {group_name, return_date, leader, target_pax, department}

  sale_order_line:
    order_id        = FK → sale_order
    name            = 旅客姓名
    product_uom_qty = 1
    price_unit      = 應收團費
    price_subtotal  = 已收金額
    sequence        = 旅客序號
    custom_data     = {order_ref, 應收對象, 業務, 承辦, 應收辦件, 應收其它, 應收餘額, 參團狀態, 參團方式, 床位}
    customer_id     = 旅客姓名 → 查 customers (via name match)
"""
import psycopg2
import json
import os
import re
import glob
from datetime import datetime

DSN = "postgresql://postgres.svrkmfbflphsrhnpymlr:Flying50885390~@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
TENANT_ID = "640c62ef-b633-492c-a3d2-cf9a4ee1b3da"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def inject_receivable_xls(conn, filepath):
    """注入單一 .xls 應收明細表"""
    import xlrd

    wb = xlrd.open_workbook(filepath)
    log(f"載入 {os.path.basename(filepath)}: {wb.nsheets} 個團")
    cur = conn.cursor()

    # 預載 customer name → id 映射 (快取)
    cur.execute("SELECT name, id FROM customers WHERE tenant_id = %s", (TENANT_ID,))
    cust_by_name = {}
    for row in cur.fetchall():
        cust_by_name[row[0]] = str(row[1])

    # 預載 ref → id （應收對象可能是同業代碼）
    cur.execute("SELECT ref, id FROM customers WHERE tenant_id = %s AND ref IS NOT NULL", (TENANT_ID,))
    cust_by_ref = {}
    for row in cur.fetchall():
        cust_by_ref[row[0]] = str(row[1])

    # UOM
    cur.execute("SELECT id FROM uom_uom WHERE name IN ('次','Unit','Units') LIMIT 1")
    uom_id = str(cur.fetchone()[0])

    # TWD
    cur.execute("SELECT id FROM currencies WHERE name = 'TWD' LIMIT 1")
    twd_id = str(cur.fetchone()[0])

    total_orders = 0
    total_lines = 0

    for sheet_idx in range(wb.nsheets):
        ws = wb.sheet_by_index(sheet_idx)
        group_code = ws.name.strip()

        # 檢查是否已注入
        cur.execute("SELECT id FROM sale_orders WHERE client_order_ref = %s AND tenant_id = %s",
                    (group_code, TENANT_ID))
        existing = cur.fetchone()
        if existing:
            log(f"  {group_code}: 已存在，跳過")
            continue

        # 解析 header 行 (Row 0~5 是團資訊, Row 6 是欄位標題, Row 7+ 是資料)
        group_name = ''
        dep_date = ''
        ret_date = ''
        leader = ''
        pax_target = 0
        department = ''

        for r in range(min(6, ws.nrows)):
            row_text = ' '.join([str(ws.cell_value(r, c)) for c in range(ws.ncols)])
            m = re.search(r'團名[：:](.+)', row_text)
            if m:
                group_name = m.group(1).strip()
            m = re.search(r'出發日期[：:](\S+)', row_text)
            if m:
                dep_date = m.group(1).replace('/', '-')
            m = re.search(r'回國日期[：:](\S+)', row_text)
            if m:
                ret_date = m.group(1).replace('/', '-')
            m = re.search(r'領隊[：:](\S*)', row_text)
            if m:
                leader = m.group(1)
            m = re.search(r'預計人數[：:](\d+)', row_text)
            if m:
                pax_target = int(m.group(1))

        if not dep_date:
            log(f"  {group_code}: 無出發日期，跳過")
            continue

        # 收集旅客行
        lines = []
        last_order_ref = ''
        last_receiver = ''
        last_sales = ''
        last_handler = ''
        last_dept = ''

        for r in range(7, ws.nrows):
            pax_name = str(ws.cell_value(r, 6)).strip()
            status = str(ws.cell_value(r, 12)).strip()

            if not pax_name or not status:
                continue

            # 如果有訂單編號，更新 context（同一訂單的後續行可能省略）
            order_ref_raw = str(ws.cell_value(r, 0)).strip()
            if order_ref_raw:
                # 清理控制碼
                last_order_ref = re.sub(r'[\x00-\x1f]', '', order_ref_raw)
            receiver_raw = str(ws.cell_value(r, 2)).strip()
            if receiver_raw:
                last_receiver = receiver_raw
            sales_raw = str(ws.cell_value(r, 3)).strip()
            if sales_raw:
                last_sales = sales_raw
            handler_raw = str(ws.cell_value(r, 4)).strip()
            if handler_raw:
                last_handler = handler_raw
            dept_raw = str(ws.cell_value(r, 5)).strip()
            if dept_raw:
                last_dept = dept_raw

            try:
                fee = float(ws.cell_value(r, 7) or 0)
            except:
                fee = 0
            try:
                doc_fee = float(ws.cell_value(r, 8) or 0)
            except:
                doc_fee = 0
            try:
                other_fee = float(ws.cell_value(r, 9) or 0)
            except:
                other_fee = 0
            try:
                paid = float(ws.cell_value(r, 10) or 0)
            except:
                paid = 0
            try:
                balance = float(ws.cell_value(r, 11) or 0)
            except:
                balance = 0

            bed_type = str(ws.cell_value(r, 14)).strip()
            join_type = str(ws.cell_value(r, 13)).strip()

            lines.append({
                'seq': len(lines) + 1,
                'pax_name': pax_name,
                'order_ref': last_order_ref,
                'receiver': last_receiver,
                'sales': last_sales,
                'handler': last_handler,
                'department': last_dept,
                'fee': fee,
                'doc_fee': doc_fee,
                'other_fee': other_fee,
                'paid': paid,
                'balance': balance,
                'status': status,
                'join_type': join_type,
                'bed_type': bed_type,
            })

        if not lines:
            log(f"  {group_code}: 無旅客行，跳過")
            continue

        # 計算總金額
        amount_total = sum(l['fee'] for l in lines)

        # 建立 sale_order
        order_custom = {
            'group_name': group_name,
            'return_date': ret_date,
            'leader': leader,
            'target_pax': pax_target,
            'actual_pax': len(lines),
            'erp_source': 'receivable_report',
        }

        cur.execute("""
            INSERT INTO sale_orders (
                name, client_order_ref, state, date_order,
                amount_total, currency_id,
                custom_data, tenant_id
            ) VALUES (%s, %s, 'sale', %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            group_code, group_code, dep_date,
            amount_total, twd_id,
            json.dumps(order_custom, ensure_ascii=False),
            TENANT_ID,
        ))
        order_id = str(cur.fetchone()[0])
        total_orders += 1

        # 建立 sale_order_lines
        for line in lines:
            # 查旅客 customer_id (name match)
            cust_id = cust_by_name.get(line['pax_name'])

            line_custom = {
                'erp_order_ref': line['order_ref'],
                'receiver': line['receiver'],
                'sales_person': line['sales'],
                'handler': line['handler'],
                'department': line['department'],
                'doc_fee': line['doc_fee'],
                'other_fee': line['other_fee'],
                'paid_amount': line['paid'],
                'balance': line['balance'],
                'status': line['status'],
                'join_type': line['join_type'],
                'bed_type': line['bed_type'],
            }
            # 清除空值
            line_custom = {k: v for k, v in line_custom.items() if v and v != 0}

            cur.execute("""
                INSERT INTO sale_order_lines (
                    order_id, name, sequence,
                    product_uom_qty, product_uom,
                    price_unit, price_subtotal,
                    custom_data, tenant_id
                ) VALUES (%s, %s, %s, 1, %s, %s, %s, %s, %s)
            """, (
                order_id,
                line['pax_name'],
                line['seq'],
                uom_id,
                line['fee'],
                line['paid'],
                json.dumps(line_custom, ensure_ascii=False),
                TENANT_ID,
            ))
            total_lines += 1

        confirmed = len([l for l in lines if l['status'] == '確認'])
        cancelled = len([l for l in lines if l['status'] == '取消'])
        log(f"  ✅ {group_code}: {dep_date} | {len(lines)} 人 (確認{confirmed}/取消{cancelled}) | 總額 {amount_total:,.0f}")

    conn.commit()
    return total_orders, total_lines


def main():
    conn = psycopg2.connect(DSN)
    conn.autocommit = False

    # 找所有 *應收明細表*.xls 檔案
    patterns = [
        os.path.join(BASE_DIR, "A.參團旅客應收明細表*.xls"),
        os.path.join(BASE_DIR, "A.參團旅客應收明細表*.xlsx"),
    ]
    files = []
    for p in patterns:
        files.extend(glob.glob(p))

    if not files:
        log("❌ 找不到應收明細表檔案")
        return

    log(f"找到 {len(files)} 個應收明細表檔案")

    total_o = 0
    total_l = 0
    try:
        for f in sorted(files):
            o, l = inject_receivable_xls(conn, f)
            total_o += o
            total_l += l

        log(f"\n🎉 注入完成: {total_o} 筆訂單, {total_l} 筆明細")

        # 驗證
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM sale_orders WHERE tenant_id = %s", (TENANT_ID,))
        log(f"  DB sale_orders: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM sale_order_lines WHERE tenant_id = %s", (TENANT_ID,))
        log(f"  DB sale_order_lines: {cur.fetchone()[0]}")

    except Exception as e:
        conn.rollback()
        log(f"❌ 錯誤: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()


if __name__ == "__main__":
    main()
