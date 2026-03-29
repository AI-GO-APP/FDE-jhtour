/**
 * 行程模板 API — 列表 & 新增
 * GET  /api/custom/itinerary-templates
 * POST /api/custom/itinerary-templates
 * 路徑: /open/data/objects/touritinerarytemplates/records（免引用、免發布）
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('touritinerarytemplates');
