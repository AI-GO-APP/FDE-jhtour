/**
 * API Client — 前端呼叫後端 Route Handlers
 *
 * 此檔案為前端與後端的介面層。
 * 所有請求發送至 /api/* Route Handlers，
 * 由 Route Handler 轉發至 AI GO API。
 *
 * API Key 永遠不會暴露給瀏覽器端。
 */

/** API 呼叫錯誤 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown
  ) {
    super(`API 錯誤 [${status}]`);
    this.name = 'ApiError';
  }
}

/** 列表回應格式 */
export interface ListResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total?: number;
  };
}

/** 共用回應處理 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      detail = await res.text();
    }
    throw new ApiError(res.status, detail);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

/** 組合查詢參數 URL */
function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export const api = {
  /**
   * GET 請求
   * @param endpoint — 如 '/api/customers'
   * @param params — 查詢參數
   */
  get: async <T>(endpoint: string, params?: Record<string, unknown>): Promise<T> => {
    const url = buildUrl(endpoint, params);
    const res = await fetch(url);
    return handleResponse<T>(res);
  },

  /**
   * POST 請求
   */
  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  /**
   * PATCH 請求（部分更新）
   */
  patch: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  /**
   * PUT 請求（完整更新，向下相容舊程式碼）
   */
  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(endpoint, {
      method: 'PATCH', // AI GO 僅支援 PATCH，PUT 自動轉為 PATCH
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  /**
   * DELETE 請求
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(endpoint, { method: 'DELETE' });
    return handleResponse<T>(res);
  },
};

// ============================
// 便捷 API 函式（常用操作）
// ============================

/** 端點前綴 */
const BASE = '/api';

/** 客戶 CRUD */
export const customerApi = {
  list: (params?: Record<string, unknown>) => api.get<ListResponse<unknown>>(`${BASE}/customers`, params),
  getById: (id: string) => api.get<unknown>(`${BASE}/customers/${id}`),
  create: (data: unknown) => api.post<unknown>(`${BASE}/customers`, data),
  update: (id: string, data: unknown) => api.patch<unknown>(`${BASE}/customers/${id}`, data),
  remove: (id: string) => api.delete<unknown>(`${BASE}/customers/${id}`),
};

/** 供應商 CRUD */
export const supplierApi = {
  list: (params?: Record<string, unknown>) => api.get<ListResponse<unknown>>(`${BASE}/suppliers`, params),
  getById: (id: string) => api.get<unknown>(`${BASE}/suppliers/${id}`),
  create: (data: unknown) => api.post<unknown>(`${BASE}/suppliers`, data),
  update: (id: string, data: unknown) => api.patch<unknown>(`${BASE}/suppliers/${id}`, data),
  remove: (id: string) => api.delete<unknown>(`${BASE}/suppliers/${id}`),
};

/** 銷售訂單 CRUD */
export const saleOrderApi = {
  list: (params?: Record<string, unknown>) => api.get<ListResponse<unknown>>(`${BASE}/sale-orders`, params),
  getById: (id: string) => api.get<unknown>(`${BASE}/sale-orders/${id}`),
  create: (data: unknown) => api.post<unknown>(`${BASE}/sale-orders`, data),
  update: (id: string, data: unknown) => api.patch<unknown>(`${BASE}/sale-orders/${id}`, data),
  remove: (id: string) => api.delete<unknown>(`${BASE}/sale-orders/${id}`),
};

/** 產品 CRUD */
export const productApi = {
  list: (params?: Record<string, unknown>) => api.get<ListResponse<unknown>>(`${BASE}/products`, params),
  getById: (id: string) => api.get<unknown>(`${BASE}/products/${id}`),
  create: (data: unknown) => api.post<unknown>(`${BASE}/products`, data),
  update: (id: string, data: unknown) => api.patch<unknown>(`${BASE}/products/${id}`, data),
  remove: (id: string) => api.delete<unknown>(`${BASE}/products/${id}`),
};

/** 認證 */
export const authApi = {
  login: () => api.post<{ redirect_url: string; code: string }>(`${BASE}/auth/login`, {}),
  me: () => api.get<{ authenticated: boolean; user: unknown }>(`${BASE}/auth/me`),
  logout: () => api.delete<unknown>(`${BASE}/auth/me`),
  refresh: () => api.post<unknown>(`${BASE}/auth/refresh`, {}),
};
