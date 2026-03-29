/**
 * 會計傳票 API — 根路徑轉發
 * GET  /api/accounting → 查詢傳票列表 (account_moves)
 * POST /api/accounting → 新增傳票
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_moves');
