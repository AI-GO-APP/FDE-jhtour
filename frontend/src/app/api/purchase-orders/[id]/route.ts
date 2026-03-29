/**
 * 採購訂單 API — 單筆操作
 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, PATCH, DELETE } = createDetailRouteHandlers('purchase_orders');
