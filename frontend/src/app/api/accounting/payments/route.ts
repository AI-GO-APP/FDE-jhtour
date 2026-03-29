/**
 * 付款/收款（Account Payments）API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('account_payments');
