/**
 * 銷售訂單明細 API — 單筆操作
 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, PATCH, DELETE } = createDetailRouteHandlers('sale_order_lines');
