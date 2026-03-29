/**
 * 稅額（Account Taxes）API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_taxes');
