/**
 * 國家 API（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('countries');
export const GET = handlers.GET;
