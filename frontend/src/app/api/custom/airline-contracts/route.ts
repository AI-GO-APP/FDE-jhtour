/**
 * 航空合約 API — 列表 & 新增
 * GET  /api/custom/airline-contracts
 * POST /api/custom/airline-contracts
 * 路徑: /open/data/objects/airlinecontracts/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('airlinecontracts');
