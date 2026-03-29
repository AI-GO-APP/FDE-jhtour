/**
 * 供應商 API — 列表 & 新增
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('suppliers');
