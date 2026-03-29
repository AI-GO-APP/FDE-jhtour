/**
 * 匯率歷史 API（唯讀 — 全域參考表）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('currency_rates');
export const GET = handlers.GET;
