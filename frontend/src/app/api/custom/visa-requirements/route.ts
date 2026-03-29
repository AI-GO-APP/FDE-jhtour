/**
 * 簽證需求 API — 列表 & 新增
 * GET  /api/custom/visa-requirements
 * POST /api/custom/visa-requirements
 * 路徑: /open/data/objects/visarequirements/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('visarequirements');
