/**
 * account_accounts（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('account_accounts');
export const GET = handlers.GET;