/**
 * HR 員工 API — 根路徑轉發
 * GET  /api/hr → 查詢員工列表 (hr_employees)
 * POST /api/hr → 新增員工
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('hr_employees');
