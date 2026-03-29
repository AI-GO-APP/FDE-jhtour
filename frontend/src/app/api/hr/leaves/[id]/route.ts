import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
const handlers = createDetailRouteHandlers('hr_leaves');
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;