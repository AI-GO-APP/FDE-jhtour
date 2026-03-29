/**
 * itinerary-templates API — 單筆 (取得 / 更新 / 刪除)
 * GET / PATCH / DELETE
 */
import { createCustomTableDetailRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, PATCH, DELETE } = createCustomTableDetailRouteHandlers('touritinerarytemplates');