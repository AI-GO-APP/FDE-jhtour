/** CRM 商機 — 單筆 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
export const { GET, PATCH, DELETE } = createDetailRouteHandlers('crm_leads');
