import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
const handlers = createDetailRouteHandlers('sale_order_lines');
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;