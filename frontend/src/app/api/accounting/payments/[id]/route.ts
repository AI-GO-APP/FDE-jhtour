import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
const handlers = createDetailRouteHandlers('account_payments');
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;