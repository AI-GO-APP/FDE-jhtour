/**
 * 出團班表 API — 列表 & 新增
 * GET  /api/custom/departure-schedules
 * POST /api/custom/departure-schedules
 * 路徑: /open/data/objects/tourdepartureschedules/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('tourdepartureschedules');
