/**
 * 產品範本 API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('product_templates');
