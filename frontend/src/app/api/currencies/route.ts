/**
 * 幣別 API（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('currencies');
export const GET = handlers.GET;
