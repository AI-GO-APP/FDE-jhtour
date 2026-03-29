/**
 * CRM 商機 API
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('crm_leads');
