/**
 * AI GO Proxy API Client
 * 封裝 /open/proxy/ 端點，用於存取 AI GO 既有資料表
 *
 * 支援：
 * - 簡單查詢（GET + limit/offset）
 * - 進階查詢（POST /query，含 filters/search/order_by 等）
 * - 新增（POST）
 * - 更新（PATCH）
 * - 刪除（DELETE）
 */

import { AigoClient } from './client';
import type {
  ProxyQueryOptions,
  ProxyCreateResponse,
  ProxyUpdateResponse,
  CountResponse,
} from './types';

/** 預設 Proxy API 路徑前綴（標準引用表） */
const PROXY_PREFIX = '/open/proxy';

export class AigoProxyClient {
  private prefix: string;

  constructor(private client: AigoClient, prefix?: string) {
    this.prefix = prefix ?? PROXY_PREFIX;
  }



  /**
   * 簡單查詢（GET）
   * 適用於無過濾條件的簡單列表
   */
  async list<T>(table: string, limit = 100, offset = 0): Promise<T[]> {
    return this.client.get<T[]>(
      `${this.prefix}/${table}`,
      { limit, offset }
    );
  }

  /**
   * 進階查詢（POST /query）
   * 支援 filters、search、order_by、select_columns、count_only
   */
  async query<T>(table: string, options: ProxyQueryOptions): Promise<T[]> {
    // 如果是 count_only，使用不同的回傳型別
    if (options.count_only) {
      throw new Error('count_only 模式請使用 count() 方法');
    }

    return this.client.post<T[]>(
      `${this.prefix}/${table}/query`,
      options
    );
  }

  /**
   * 計數查詢
   * 僅回傳符合條件的總筆數
   */
  async count(table: string, options: Omit<ProxyQueryOptions, 'count_only' | 'limit' | 'offset'>): Promise<number> {
    const result = await this.client.post<CountResponse>(
      `${this.prefix}/${table}/query`,
      { ...options, count_only: true }
    );
    return result.total;
  }

  /**
   * 取得單筆記錄
   * 用 query + filter id 實現
   */
  async getById<T>(table: string, id: string): Promise<T | null> {
    const results = await this.query<T>(table, {
      filters: [{ column: 'id', op: 'eq', value: id }],
      limit: 1,
    });
    return results[0] || null;
  }

  /**
   * 新增記錄
   */
  async create(table: string, data: Record<string, unknown>): Promise<ProxyCreateResponse> {
    return this.client.post<ProxyCreateResponse>(
      `${this.prefix}/${table}`,
      data
    );
  }

  /**
   * 更新記錄
   */
  async update(table: string, id: string, data: Record<string, unknown>): Promise<ProxyUpdateResponse> {
    return this.client.patch<ProxyUpdateResponse>(
      `${this.prefix}/${table}/${id}`,
      data
    );
  }

  /**
   * 刪除記錄
   */
  async remove(table: string, id: string): Promise<void> {
    await this.client.delete(
      `${this.prefix}/${table}/${id}`
    );
  }
}
