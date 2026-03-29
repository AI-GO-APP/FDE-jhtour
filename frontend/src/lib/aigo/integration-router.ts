/**
 * 多整合路由器
 * 根據使用者類型自動選擇正確的 AI GO 整合（API Key）
 *
 * 架構：
 * - jhtour-erp（內部員工）: Platform Auth
 * - jhtour-customer（外部旅客）: Independent Auth（Phase 6）
 * - jhtour-supplier（外部廠商）: Independent Auth（Phase 6）
 */

import { AigoClient } from './client';
import { AigoProxyClient } from './proxy-client';
import { AigoCustomDataClient } from './custom-data-client';

/** 整合類型 */
export type IntegrationType = 'erp' | 'customer' | 'supplier';

/** 各整合設定 */
interface IntegrationConfig {
  apiKey: string;
  appId: string;
}

/** 環境設定讀取 */
function getConfig(type: IntegrationType): IntegrationConfig {
  switch (type) {
    case 'erp':
      return {
        apiKey: process.env.AIGO_ERP_API_KEY || '',
        appId: process.env.AIGO_ERP_APP_ID || '',
      };
    case 'customer':
      return {
        apiKey: process.env.AIGO_CUSTOMER_API_KEY || '',
        appId: process.env.AIGO_CUSTOMER_APP_ID || '',
      };
    case 'supplier':
      return {
        apiKey: process.env.AIGO_SUPPLIER_API_KEY || '',
        appId: process.env.AIGO_SUPPLIER_APP_ID || '',
      };
  }
}

/** 取得 AI GO API 基底 URL */
function getBaseUrl(): string {
  return process.env.AIGO_API_BASE_URL || 'https://www.ai-go.app/api/v1';
}

// ============================
// 快取的 Client 實例（避免重複建立）
// ============================
const clientCache = new Map<IntegrationType, AigoClient>();
const proxyCache = new Map<IntegrationType, AigoProxyClient>();
const customDataCache = new Map<IntegrationType, AigoCustomDataClient>();

/**
 * 取得指定整合的基底 Client
 */
export function getAigoClient(type: IntegrationType = 'erp'): AigoClient {
  if (!clientCache.has(type)) {
    const config = getConfig(type);
    if (!config.apiKey) {
      throw new Error(`AI GO 整合 [${type}] 的 API Key 未設定。請檢查環境變數。`);
    }
    clientCache.set(type, new AigoClient({
      baseUrl: getBaseUrl(),
      apiKey: config.apiKey,
    }));
  }
  return clientCache.get(type)!;
}

/**
 * 取得指定整合的 Proxy Client
 */
export function getProxyClient(type: IntegrationType = 'erp'): AigoProxyClient {
  if (!proxyCache.has(type)) {
    proxyCache.set(type, new AigoProxyClient(getAigoClient(type)));
  }
  return proxyCache.get(type)!;
}

/**
 * 取得指定整合的 Custom Data Client
 */
export function getCustomDataClient(type: IntegrationType = 'erp'): AigoCustomDataClient {
  if (!customDataCache.has(type)) {
    customDataCache.set(type, new AigoCustomDataClient(getAigoClient(type)));
  }
  return customDataCache.get(type)!;
}

/**
 * 取得指定整合的 App ID
 */
export function getAppId(type: IntegrationType = 'erp'): string {
  const config = getConfig(type);
  if (!config.appId) {
    throw new Error(`AI GO 整合 [${type}] 的 App ID 未設定。請檢查環境變數。`);
  }
  return config.appId;
}

// ============================
// 便捷匯出（預設使用 ERP 整合）
// ============================

/** ERP 整合的 Proxy Client（最常用）*/
export function erpProxy(): AigoProxyClient {
  return getProxyClient('erp');
}

/** ERP 整合的 Custom Table Client（自訂表專用）*/
export function erpCustomData(): AigoCustomDataClient {
  return getCustomDataClient('erp');
}
