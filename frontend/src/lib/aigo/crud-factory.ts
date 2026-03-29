import { NextResponse, type NextRequest } from 'next/server';
import { erpProxy, erpCustomData } from '@/lib/aigo';
import { parseQueryOptions, handleApiError } from './route-helpers';

/**
 * 建立列表 Route Handler（GET + POST）
 * GET  → list / query
 * POST → create
 */
export function createListRouteHandlers(tableName: string) {
  return {
    /** GET — 列表查詢 */
    GET: async (request: NextRequest) => {
      try {
        const proxy = erpProxy();
        const options = parseQueryOptions(request);

        // 預設分頁
        if (!options.limit) options.limit = 20;
        if (options.offset === undefined) options.offset = 0;

        // 若有過濾條件或搜尋，使用進階查詢
        const hasAdvanced = options.filters || options.search || options.order_by || options.select_columns;

        let data;
        if (hasAdvanced) {
          data = await proxy.query(tableName, options);
        } else {
          data = await proxy.list(tableName, options.limit, options.offset);
        }

        // count 查詢為 opt-in（加 ?count=true 參數）
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
          pagination: {
            limit: options.limit,
            offset: options.offset,
            total,
          },
        });
      } catch (error) {
        return handleApiError(error);
      }
    },

    /** POST — 新增 */
    POST: async (request: NextRequest) => {
      try {
        const proxy = erpProxy();
        const body = await request.json();
        const result = await proxy.create(tableName, body);
        return NextResponse.json(result, { status: 201 });
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
}

/**
 * 建立單筆 Route Handler（GET / PATCH / DELETE）
 * Route: /api/{resource}/[id]
 */
export function createDetailRouteHandlers(tableName: string) {
  return {
    /** GET — 取得單筆 */
    GET: async (
      _request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const proxy = erpProxy();
        const data = await proxy.getById(tableName, id);
        if (!data) {
          return NextResponse.json(
            { error: '找不到指定資料' },
            { status: 404 }
          );
        }
        return NextResponse.json(data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /** PATCH — 更新 */
    PATCH: async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const proxy = erpProxy();
        const body = await request.json();
        const result = await proxy.update(tableName, id, body);
        return NextResponse.json(result);
      } catch (error) {
        return handleApiError(error);
      }
    },

    /** DELETE — 刪除 */
    DELETE: async (
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
    },
  };
}

// ============================
// Custom Table 專用工廠
// 路徑前綴: /open/data/objects/{table_name}/records
// 免引用、免發布，由 AI GO 自動管理
// ============================

/**
 * 建立 Custom Table 列表 Route Handler（GET + POST）
 */
export function createCustomTableRouteHandlers(tableName: string) {
  return {
    /** GET — 列表查詢 */
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
          } catch {
            // count 失敗不影響主查詢
          }
        }

        return NextResponse.json({
          data,
          pagination: {
            limit: options.limit,
            offset: options.offset,
            total,
          },
        });
      } catch (error) {
        return handleApiError(error);
      }
    },

    /** POST — 新增 */
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

/**
 * 建立 Custom Table 單筆 Route Handler（GET / PATCH / DELETE）
 */
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
