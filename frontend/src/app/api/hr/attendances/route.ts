/**
 * hr_attendances（唯讀）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

const handlers = createListRouteHandlers('hr_attendances');
export const GET = handlers.GET;