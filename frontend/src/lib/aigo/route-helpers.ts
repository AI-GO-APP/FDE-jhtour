/**
 * Route Handler 共用工具
 * 提供 Query 參數解析、錯誤回應、分頁等共用功能
 */

import { NextResponse, type NextRequest } from 'next/server';
import { AigoApiError } from '@/lib/aigo';
import type { ProxyQueryOptions, QueryFilter, QueryOrderBy } from '@/lib/aigo';

/** 標準列表回應格式 */
export interface ListResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total?: number;
  };
}

/** 標準錯誤回應格式 */
interface ErrorResponse {
  error: string;
  status: number;
  detail?: unknown;
}

/**
 * 從 URL SearchParams 解析 ProxyQueryOptions
 * 支援的參數：
 * - limit, offset （分頁）
 * - search （搜尋關鍵字）
 * - search_columns （搜尋欄位，逗號分隔）
 * - order_by （排序，格式：column:direction，逗號分隔）
 * - filter_{column}_{op} （過濾器，如 filter_status_eq=active）
 */
export function parseQueryOptions(request: NextRequest): ProxyQueryOptions {
  const sp = request.nextUrl.searchParams;

  const options: ProxyQueryOptions = {};

  // 分頁
  const limit = sp.get('limit');
  const offset = sp.get('offset');
  if (limit) options.limit = Math.min(Number(limit), 200);
  if (offset) options.offset = Number(offset);

  // 搜尋
  const search = sp.get('search');
  if (search) options.search = search;

  const searchColumns = sp.get('search_columns');
  if (searchColumns) options.search_columns = searchColumns.split(',');

  // 排序
  const orderBy = sp.get('order_by');
  if (orderBy) {
    options.order_by = orderBy.split(',').map((item): QueryOrderBy => {
      const [column, direction = 'asc'] = item.split(':');
      return { column, direction: direction as 'asc' | 'desc' };
    });
  }

  // 選擇欄位
  const selectColumns = sp.get('select_columns');
  if (selectColumns) options.select_columns = selectColumns.split(',');

  // 過濾器（filter_{column}_{op}=value 格式）
  const filters: QueryFilter[] = [];
  sp.forEach((value, key) => {
    const filterMatch = key.match(/^filter_(.+?)_(eq|ne|gt|gte|lt|lte|like|ilike|is_null|is_not_null|in)$/);
    if (filterMatch) {
      const [, column, op] = filterMatch;
      let parsedValue: unknown = value;

      // in 運算子：值為逗號分隔的陣列
      if (op === 'in') {
        parsedValue = value.split(',');
      }
      // is_null / is_not_null：無需值
      else if (op === 'is_null' || op === 'is_not_null') {
        parsedValue = true;
      }
      // 嘗試轉為數字
      else if (!isNaN(Number(value)) && value !== '') {
        parsedValue = Number(value);
      }

      filters.push({ column, op: op as QueryFilter['op'], value: parsedValue });
    }
  });
  if (filters.length > 0) options.filters = filters;

  return options;
}

/**
 * 統一錯誤回應處理
 * 將 AigoApiError 轉換為前端友善的回應格式
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof AigoApiError) {
    return NextResponse.json(
      {
        error: `AI GO API 錯誤`,
        status: error.status,
        detail: error.body,
      },
      { status: error.status }
    );
  }

  console.error('[Route Handler] 未預期錯誤:', error);
  return NextResponse.json(
    {
      error: '內部伺服器錯誤',
      status: 500,
      detail: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}

/**
 * 從路由參數取得 ID
 */
export function getIdParam(params: Promise<{ id: string }>): Promise<string> {
  return params.then(p => p.id);
}
