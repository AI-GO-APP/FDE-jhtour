/**
 * account_move_lines（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('account_move_lines');
export const GET = handlers.GET;