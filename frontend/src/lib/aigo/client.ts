/**
 * AI GO 基底 HTTP Client
 * 封裝所有 AI GO API 呼叫的共用邏輯：
 * - API Key 注入
 * - 統一錯誤處理
 * - 自動 JSON 序列化
 */

/** AI GO API 錯誤 */
export class AigoApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`AI GO API 錯誤 [${status}]: ${statusText}`);
    this.name = 'AigoApiError';
  }
}

/** HTTP Client 設定 */
interface AigoClientConfig {
  /** AI GO API 基底 URL */
  baseUrl: string;
  /** API Key (sk_live_xxx) */
  apiKey: string;
}

/**
 * AI GO 基底 HTTP Client
 * Server-side only — 不可在瀏覽器端使用
 */
export class AigoClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: AigoClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
  }

  /** 組合完整 URL */
  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /** 共用 Headers */
  private getHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  /** 處理回應 */
  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      // 先用 text() 讀一次，再嘗試解析 JSON，避免 body 被讀取兩次
      const rawText = await res.text();
      let body: unknown;
      try {
        body = JSON.parse(rawText);
      } catch {
        body = rawText;
      }
      throw new AigoApiError(res.status, res.statusText, body);
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  /** GET 請求 */
  async get<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(extraHeaders),
    });
    return this.handleResponse<T>(res);
  }

  /** POST 請求 */
  async post<T>(
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(extraHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  /** PATCH 請求 */
  async patch<T>(
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(extraHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  /** DELETE 請求 */
  async delete<T>(
    path: string,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(extraHeaders),
    });
    return this.handleResponse<T>(res);
  }
}
