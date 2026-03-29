/**
 * 銷售訂單明細 API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('sale_order_lines');
