/**
 * 傳票明細行（Account Move Lines）API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_move_lines');
