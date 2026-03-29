/**
 * 導遊派遣 API — 列表 & 新增
 * GET  /api/custom/guide-assignments
 * POST /api/custom/guide-assignments
 * 路徑: /open/data/objects/guideassignments/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('guideassignments');
