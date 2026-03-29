/** HR 員工 — 單筆 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';
export const { GET, PATCH, DELETE } = createDetailRouteHandlers('hr_employees');
