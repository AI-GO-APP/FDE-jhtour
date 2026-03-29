/**
 * account_journals（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('account_journals');
export const GET = handlers.GET;