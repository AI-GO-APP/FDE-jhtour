/**
 * 匯率歷史 API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('currency_rates');
