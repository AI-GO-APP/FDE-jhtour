/**
 * API Client — 預留後端對接
 * 
 * 本階段使用 Mock 資料，所有 API 呼叫點均標記 TODO 註解。
 * 後端就緒後，取消下方的 baseURL 註解即可切換至實際 API。
 */

// === [API] 後端服務 base URL ===
// TODO: [替換] 後端上線後取消以下註解
// const API_BASE_URL = 'http://localhost:8006/api';

/**
 * 通用 API 請求函式
 * 目前回傳 Mock 資料，後端就緒後改為 fetch 呼叫
 */

// === [API] GET 請求 ===
// TODO: [替換] 改為實際 fetch 呼叫
// async function apiGet<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
//   const url = new URL(`${API_BASE_URL}${endpoint}`);
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== '') {
//         url.searchParams.append(key, String(value));
//       }
//     });
//   }
//   const res = await fetch(url.toString());
//   if (!res.ok) throw new Error(`API Error: ${res.status}`);
//   return res.json();
// }

// === [API] POST 請求 ===
// TODO: [替換] 改為實際 fetch 呼叫
// async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error(`API Error: ${res.status}`);
//   return res.json();
// }

// === [API] PUT 請求 ===
// TODO: [替換] 改為實際 fetch 呼叫
// async function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error(`API Error: ${res.status}`);
//   return res.json();
// }

// === [API] DELETE 請求 ===
// TODO: [替換] 改為實際 fetch 呼叫
// async function apiDelete<T>(endpoint: string): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
//   if (!res.ok) throw new Error(`API Error: ${res.status}`);
//   return res.json();
// }

export const api = {
  // TODO: [替換] 取消下方 mock 實作，改用上方的 apiGet/Post/Put/Delete
  get: async <T>(endpoint: string, _params?: Record<string, unknown>): Promise<T> => {
    console.log(`[Mock API] GET ${endpoint}`, _params);
    return {} as T;
  },
  post: async <T>(endpoint: string, _body: unknown): Promise<T> => {
    console.log(`[Mock API] POST ${endpoint}`, _body);
    return { success: true, message: '操作成功' } as T;
  },
  put: async <T>(endpoint: string, _body: unknown): Promise<T> => {
    console.log(`[Mock API] PUT ${endpoint}`, _body);
    return { success: true, message: '更新成功' } as T;
  },
  delete: async <T>(endpoint: string): Promise<T> => {
    console.log(`[Mock API] DELETE ${endpoint}`);
    return { success: true, message: '刪除成功' } as T;
  },
};
