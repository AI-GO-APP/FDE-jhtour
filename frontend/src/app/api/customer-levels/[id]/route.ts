/** 客戶等級 — 單筆 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
export const { GET, PATCH, DELETE } = createDetailRouteHandlers('customer_levels');
