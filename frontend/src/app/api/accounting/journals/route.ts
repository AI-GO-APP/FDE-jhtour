/**
 * 日記帳（Account Journals）API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_journals');
