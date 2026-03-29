/**
 * account_taxes（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('account_taxes');
export const GET = handlers.GET;