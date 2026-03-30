"""只執行 Phase 5 驗證"""
import psycopg2

DSN = "postgresql://postgres.svrkmfbflphsrhnpymlr:Flying50885390~@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
TENANT_ID = "640c62ef-b633-492c-a3d2-cf9a4ee1b3da"
OBJ_ITINERARY = "da087001-3204-481f-8093-67b2662157d6"
OBJ_DEPARTURE = "ea304798-fe99-42ee-8042-a1182450eb37"
OBJ_AIRLINE = "3ed90983-c91c-42fa-917b-e88b9c99f7f8"
OBJ_HOTEL = "472f82dd-5050-4f04-a5d6-1caab09c8d4d"

conn = psycopg2.connect(DSN)
cur = conn.cursor()

checks = [
    ("customers", f"SELECT COUNT(*) FROM customers WHERE tenant_id = '{TENANT_ID}'"),
    ("suppliers", f"SELECT COUNT(*) FROM suppliers WHERE tenant_id = '{TENANT_ID}'"),
    ("product_categories", f"SELECT COUNT(*) FROM product_categories WHERE tenant_id = '{TENANT_ID}'"),
    ("product_templates", f"SELECT COUNT(*) FROM product_templates WHERE tenant_id = '{TENANT_ID}'"),
    ("product_products", f"SELECT COUNT(*) FROM product_products WHERE tenant_id = '{TENANT_ID}'"),
    ("custom_records (itinerary)", f"SELECT COUNT(*) FROM custom_records WHERE tenant_id = '{TENANT_ID}' AND object_id = '{OBJ_ITINERARY}'"),
    ("custom_records (departure)", f"SELECT COUNT(*) FROM custom_records WHERE tenant_id = '{TENANT_ID}' AND object_id = '{OBJ_DEPARTURE}'"),
    ("custom_records (airline)", f"SELECT COUNT(*) FROM custom_records WHERE tenant_id = '{TENANT_ID}' AND object_id = '{OBJ_AIRLINE}'"),
    ("custom_records (hotel)", f"SELECT COUNT(*) FROM custom_records WHERE tenant_id = '{TENANT_ID}' AND object_id = '{OBJ_HOTEL}'"),
    ("custom_records (total)", f"SELECT COUNT(*) FROM custom_records WHERE tenant_id = '{TENANT_ID}'"),
    ("custom_objects", f"SELECT COUNT(*) FROM custom_objects WHERE tenant_id = '{TENANT_ID}'"),
    ("custom_fields (all)", f"SELECT COUNT(*) FROM custom_fields cf JOIN custom_objects co ON cf.object_id = co.id WHERE co.tenant_id = '{TENANT_ID}'"),
]

print(f"{'表名':<35s} {'數量':>8s}")
print(f"{'-'*35} {'-'*8}")
for name, sql in checks:
    cur.execute(sql)
    count = cur.fetchone()[0]
    print(f"{name:<35s} {count:>8d}")

# FK check
cur.execute(f"""
    SELECT COUNT(*) FROM product_products pp
    WHERE pp.tenant_id = '{TENANT_ID}'
    AND NOT EXISTS (SELECT 1 FROM product_templates pt WHERE pt.id = pp.product_tmpl_id)
""")
print(f"\nFK orphans (product_products): {cur.fetchone()[0]}")

cur.close()
conn.close()
