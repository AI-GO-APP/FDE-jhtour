/**
 * 客戶 API — 單筆操作
 * GET    /api/customers/[id] — 取得單筆
 * PATCH  /api/customers/[id] — 更新
 * DELETE /api/customers/[id] — 刪除
 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, PATCH, DELETE } = createDetailRouteHandlers('customers');
