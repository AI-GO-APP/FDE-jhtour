import { NextResponse, type NextRequest } from 'next/server';
import { erpProxy, erpCustomData } from '@/lib/aigo';
import { parseQueryOptions, handleApiError } from './route-helpers';

// ============================
// 表 Schema 驗證配置
// ============================

/** 欄位驗證規則 */
interface FieldRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
  fk?: string;          // FK 目標表.欄位
  enum?: string[];       // 允許值清單
}

/** 表驗證設定 */
interface TableSchema {
  readonly?: boolean;          // 唯讀表（僅 GET，禁止 POST/PATCH/DELETE）
  fields?: Record<string, FieldRule>;
}

/**
 * 所有表的 Schema 定義
 * 依據 AI GO §8 與實際 API 回傳推斷
 */
export const TABLE_SCHEMAS: Record<string, TableSchema> = {
  // === 唯讀全域參考表 ===
  countries:      { readonly: true },
  currencies:     { readonly: true },
  currency_rates: { readonly: true },

  // === 可讀寫的標準表 ===
  customers: {
    fields: {
      name:          { required: true, type: 'string' },
      customer_type: { required: true, type: 'string', enum: ['company', 'individual'] },
    },
  },
  suppliers: {
    fields: {
      name:          { required: true, type: 'string' },
      supplier_type: { required: true, type: 'string', enum: ['company', 'individual'] },
    },
  },
  product_products: {
    fields: {
      name: { required: true, type: 'string' },
    },
  },
  product_categories: {
    fields: {
      name: { required: true, type: 'string' },
    },
  },
  sale_orders: {
    fields: {
      partner_id:  { required: true, type: 'string', fk: 'customers.id' },
      date_order:  { required: true, type: 'string' },
    },
  },
  purchase_orders: {
    fields: {
      partner_id:  { required: true, type: 'string', fk: 'suppliers.id' },
      date_order:  { required: true, type: 'string' },
    },
  },
  hr_employees: {
    fields: {
      name: { required: true, type: 'string' },
    },
  },
  account_moves: {
    fields: {
      move_type: { required: true, type: 'string', enum: ['entry', 'out_invoice', 'in_invoice', 'out_refund', 'in_refund'] },
      date:      { required: true, type: 'string' },
    },
  },
  crm_leads: {
    fields: {
      name: { required: true, type: 'string' },
    },
  },
  customer_levels: {
    fields: {
      name: { required: true, type: 'string' },
    },
  },
  announcements: {
    fields: {
      title: { required: true, type: 'string' },
    },
  },
};

/**
 * 驗證必填欄位
 * @returns null 表示驗證通過，否則回傳錯誤訊息
 */
export function validateRequiredFields(
  tableName: string,
  body: Record<string, unknown>
): string | null {
  const schema = TABLE_SCHEMAS[tableName];
  if (!schema?.fields) return null;

  const errors: string[] = [];
  for (const [fieldName, rule] of Object.entries(schema.fields)) {
    if (!rule.required) continue;

    const value = body[fieldName];
    if (value === undefined || value === null || value === '') {
      let msg = `必填欄位 '${fieldName}' 未提供`;
      if (rule.enum) msg += `（允許值: ${rule.enum.join(', ')}）`;
      if (rule.fk) msg += `（需為 ${rule.fk} 的有效 UUID）`;
      errors.push(msg);
    }

    // 列舉驗證
    if (rule.enum && value !== undefined && value !== null) {
      if (!rule.enum.includes(String(value))) {
        errors.push(`欄位 '${fieldName}' 的值 '${value}' 無效（允許值: ${rule.enum.join(', ')}）`);
      }
    }
  }

  return errors.length > 0 ? errors.join('；') : null;
}

/**
 * 檢查表是否為唯讀
 */
export function isReadonlyTable(tableName: string): boolean {
  return TABLE_SCHEMAS[tableName]?.readonly === true;
}

/**
 * 取得表的 Schema 資訊（供前端頁面使用）
 */
export function getTableSchema(tableName: string): TableSchema | undefined {
  return TABLE_SCHEMAS[tableName];
}

// ============================================
// 工廠方法 — 帶驗證的 Route Handler
// ============================================

/**
 * 建立列表 Route Handler（GET + POST），帶必填驗證
 * 唯讀表僅含 GET
 */
export function createListRouteHandlers(tableName: string) {
  const readonly = isReadonlyTable(tableName);

  const GET = async (request: NextRequest) => {
    try {
      const proxy = erpProxy();
      const options = parseQueryOptions(request);

      if (!options.limit) options.limit = 20;
      if (options.offset === undefined) options.offset = 0;

      const hasAdvanced = options.filters || options.search || options.order_by || options.select_columns;

      let data;
      if (hasAdvanced) {
        data = await proxy.query(tableName, options);
      } else {
        data = await proxy.list(tableName, options.limit, options.offset);
      }

      let total: number | undefined;
      const wantCount = request.nextUrl.searchParams.get('count') === 'true';
      if (wantCount) {
        try {
          total = await proxy.count(tableName, {
            filters: options.filters,
            search: options.search,
            search_columns: options.search_columns,
          });
        } catch {
          // count 失敗不影響主查詢
        }
      }

      return NextResponse.json({
        data,
        pagination: { limit: options.limit, offset: options.offset, total },
      });
    } catch (error) {
      return handleApiError(error);
    }
  };

  // 唯讀表不提供 POST
  if (readonly) {
    return { GET };
  }

  const POST = async (request: NextRequest) => {
    try {
      const proxy = erpProxy();
      const body = await request.json();

      // 必填欄位驗證
      const validationError = validateRequiredFields(tableName, body);
      if (validationError) {
        return NextResponse.json(
          { error: '驗證失敗', detail: validationError },
          { status: 400 }
        );
      }

      const result = await proxy.create(tableName, body);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  };

  return { GET, POST };
}

/**
 * 建立單筆 Route Handler（GET / PATCH / DELETE），帶必填驗證
 * 唯讀表僅含 GET
 */
export function createDetailRouteHandlers(tableName: string) {
  const readonly = isReadonlyTable(tableName);

  const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const proxy = erpProxy();
      const data = await proxy.getById(tableName, id);
      if (!data) {
        return NextResponse.json({ error: '找不到指定資料' }, { status: 404 });
      }
      return NextResponse.json(data);
    } catch (error) {
      return handleApiError(error);
    }
  };

  // 唯讀表僅提供 GET
  if (readonly) {
    return { GET };
  }

  const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const proxy = erpProxy();
      const body = await request.json();

      // PATCH 的列舉驗證（不強制必填，但若有傳值就要合法）
      const schema = TABLE_SCHEMAS[tableName];
      if (schema?.fields) {
        for (const [fieldName, rule] of Object.entries(schema.fields)) {
          if (rule.enum && body[fieldName] !== undefined) {
            if (!rule.enum.includes(String(body[fieldName]))) {
              return NextResponse.json(
                { error: '驗證失敗', detail: `欄位 '${fieldName}' 的值 '${body[fieldName]}' 無效（允許值: ${rule.enum.join(', ')}）` },
                { status: 400 }
              );
            }
          }
        }
      }

      const result = await proxy.update(tableName, id, body);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  };

  const DELETE = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;
      const proxy = erpProxy();
      await proxy.remove(tableName, id);
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return handleApiError(error);
    }
  };

  return { GET, PATCH, DELETE };
}

// ============================
// Custom Table 專用工廠（不需驗證，欄位由 AI GO 動態管理）
// ============================

export function createCustomTableRouteHandlers(tableName: string) {
  return {
    GET: async (request: NextRequest) => {
      try {
        const proxy = erpCustomData();
        const options = parseQueryOptions(request);

        if (!options.limit) options.limit = 20;
        if (options.offset === undefined) options.offset = 0;

        const hasAdvanced = options.filters || options.search || options.order_by || options.select_columns;

        let data;
        if (hasAdvanced) {
          data = await proxy.query(tableName, options);
        } else {
          data = await proxy.list(tableName, options.limit, options.offset);
        }

        let total: number | undefined;
        const wantCount = request.nextUrl.searchParams.get('count') === 'true';
        if (wantCount) {
          try {
            total = await proxy.count(tableName, {
              filters: options.filters,
              search: options.search,
              search_columns: options.search_columns,
            });
          } catch { /* 不影響 */ }
        }

        return NextResponse.json({
          data,
          pagination: { limit: options.limit, offset: options.offset, total },
        });
      } catch (error) {
        return handleApiError(error);
      }
    },

    POST: async (request: NextRequest) => {
      try {
        const proxy = erpCustomData();
        const body = await request.json();
        const result = await proxy.create(tableName, body);
        return NextResponse.json(result, { status: 201 });
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
}

export function createCustomTableDetailRouteHandlers(tableName: string) {
  return {
    GET: async (
      _request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const proxy = erpCustomData();
        const data = await proxy.getById(tableName, id);
        if (!data) {
          return NextResponse.json({ error: '找不到指定資料' }, { status: 404 });
        }
        return NextResponse.json(data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    PATCH: async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const proxy = erpCustomData();
        const body = await request.json();
        const result = await proxy.update(tableName, id, body);
        return NextResponse.json(result);
      } catch (error) {
        return handleApiError(error);
      }
    },

    DELETE: async (
      _request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const proxy = erpCustomData();
        await proxy.remove(tableName, id);
        return new NextResponse(null, { status: 204 });
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
}
