/**
 * AI GO SDK — 統一匯出入口
 */

export { AigoClient, AigoApiError } from './client';
export { AigoProxyClient } from './proxy-client';
export { AigoCustomDataClient } from './custom-data-client';
export {
  getAigoClient,
  getProxyClient,
  getCustomDataClient,
  getAppId,
  erpProxy,
  erpCustomData,
  type IntegrationType,
} from './integration-router';

// Route Handler 工具
export { parseQueryOptions, handleApiError } from './route-helpers';
export {
  createListRouteHandlers,
  createDetailRouteHandlers,
  createCustomTableRouteHandlers,
  createCustomTableDetailRouteHandlers,
  validateRequiredFields,
  isReadonlyTable,
  getTableSchema,
  TABLE_SCHEMAS,
} from './crud-factory';

// 型別匯出
export type * from './types';
