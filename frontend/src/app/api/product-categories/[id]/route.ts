/** 產品類別 — 單筆 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
export const { GET, PATCH, DELETE } = createDetailRouteHandlers('product_categories');
