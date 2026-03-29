/**
 * 傳票（Account Move）API
 * 會計核心 — 含銷項/進項發票、繳款、收據、日記帳分錄
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_moves');
