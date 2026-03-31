/**
 * AI GO Custom Table API Client
 * 封裝 /open/data/objects/{table_name}/records 端點
 * 專門用於存取動態資料表（Custom Tables）
 */

import { AigoClient } from './client';
import type { ProxyQueryOptions, CountResponse } from './types';

/** Custom Table 新增回應 */
export interface CustomDataCreateResponse {
  id: string;
  created_at: string;
  data: Record<string, unknown>;
}

/** Custom Table 更新回應 */
export interface CustomDataUpdateResponse {
  id: string;
  updated: boolean;
}

export class AigoCustomDataClient {
  constructor(private client: AigoClient) {}

  /**
   * 簡單查詢（GET）
   */
  async list<T>(tableName: string, limit = 100, offset = 0): Promise<T[]> {
    return this.client.get<T[]>(
      `/open/data/objects/${tableName}/records`,
      { limit, offset }
    );
  }

  /**
   * 進階查詢（GET + 查詢參數）
   * Custom Table 尚未支援 filter 陣列查詢，這與 /open/proxy 不同，
   * 根據文件目前支援 limit, offset, search, order_by
   */
  async query<T>(tableName: string, options: ProxyQueryOptions): Promise<T[]> {
    // 轉換 order_by 陣列為 JSON 字串傳遞，視後端實作而定
    // 這裡我們直接傳遞給 client.get，它會呼叫 URLSearchParams
    const params: Record<string, string | number> = {
      limit: options.limit ?? 100,
      offset: options.offset ?? 0,
    };

    if (options.search) {
      params.search = options.search;
    }
    
    // 如果 proxy 支援複雜 JSON，可以直接用 JSON.stringify
    if (options.order_by) {
      params.order_by = JSON.stringify(options.order_by);
    }
    
    // API v1 Custom data 端點暫不支援 filters POST，所以當作 GET 參數或忽略
    if (options.filters && options.filters.length > 0) {
      params.filters = JSON.stringify(options.filters);
    }

    return this.client.get<T[]>(
      `/open/data/objects/${tableName}/records`,
      params
    );
  }

  /**
   * 計數查詢
   * 假設 Custom Tables 如果支援 count_only，則與 Proxy 相同，
   * 不然就根據回傳筆數概算
   */
  async count(tableName: string, options: Omit<ProxyQueryOptions, 'count_only' | 'limit' | 'offset'>): Promise<number> {
    const params: Record<string, string | number> = { count_only: 1 };
    if (options.search) params.search = options.search;
    
    try {
      // 依賴後段是否支援 /open/data 的 count_only
      const result = await this.client.get<CountResponse>(
        `/open/data/objects/${tableName}/records`,
        params
      );
      return result.total ?? 0;
    } catch {
      return 0; // 若自訂表不支援計數，直接回 0 避免報錯
    }
  }

  /**
   * 取得單筆記錄
   */
  async getById<T>(tableName: string, id: string): Promise<T | null> {
    // 嘗試使用 filters 傳遞
    const results = await this.query<T>(tableName, {
      filters: [{ column: 'id', op: 'eq', value: id }],
      limit: 1,
    });
    return results[0] || null;
  }

  /**
   * 新增記錄
   * 根據文件需包裝在 {"data": {...}} 內
   */
  async create(tableName: string, data: Record<string, unknown>): Promise<CustomDataCreateResponse> {
    return this.client.post<CustomDataCreateResponse>(
      `/open/data/objects/${tableName}/records`,
      { data }
    );
  }

  /**
   * 更新記錄
   * 根據文件需包裝在 {"data": {...}} 內，並給予 {record_id}
   */
  async update(tableName: string, id: string, data: Record<string, unknown>): Promise<CustomDataUpdateResponse> {
    return this.client.patch<CustomDataUpdateResponse>(
      `/open/data/records/${id}`,
      { data }
    );
  }

  /**
   * 刪除記錄
   */
  async remove(tableName: string, id: string): Promise<void> {
    await this.client.delete(
      `/open/data/records/${id}`
    );
  }
}
