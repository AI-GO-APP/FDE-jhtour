/**
 * 飯店合約 API — 列表 & 新增
 * GET  /api/custom/hotel-contracts
 * POST /api/custom/hotel-contracts
 * 路徑: /open/data/objects/hotelcontracts/records
 */
import { createCustomTableRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createCustomTableRouteHandlers('hotelcontracts');
