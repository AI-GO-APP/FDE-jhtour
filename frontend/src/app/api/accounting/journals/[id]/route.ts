import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
const handlers = createDetailRouteHandlers('account_journals');
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;