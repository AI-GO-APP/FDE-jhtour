/**
 * CRM 商機 API — 根路徑轉發
 * GET  /api/crm → 查詢商機列表 (crm_leads)
 * POST /api/crm → 新增商機
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('crm_leads');
