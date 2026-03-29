/**
 * 會計科目 API（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

// 科目表為唯讀，僅匯出 GET
const handlers = createListRouteHandlers('account_accounts');
export const GET = handlers.GET;
