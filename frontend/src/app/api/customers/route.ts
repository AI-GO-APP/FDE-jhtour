/**
 * 客戶 API — 列表 & 新增
 * GET  /api/customers — 查詢客戶列表
 * POST /api/customers — 新增客戶
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('customers');
