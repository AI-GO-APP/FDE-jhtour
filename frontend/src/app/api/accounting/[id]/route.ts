/** 帳務傳票 — 單筆 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
export const { GET, PATCH, DELETE } = createDetailRouteHandlers('account_moves');
