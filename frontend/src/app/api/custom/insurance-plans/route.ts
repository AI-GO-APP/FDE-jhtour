/**
 * 保險方案 API — 列表 & 新增
 * GET  /api/custom/insurance-plans
 * POST /api/custom/insurance-plans
 * 路徑: /open/data/objects/insuranceplans/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('insuranceplans');
