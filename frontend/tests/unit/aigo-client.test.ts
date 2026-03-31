/**
 * AI GO Client 單元測試
 * 測試 AigoClient 的 HTTP 方法、錯誤處理、URL 建構
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AigoClient, AigoApiError } from '@/lib/aigo/client'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('AigoClient', () => {
  let client: AigoClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new AigoClient({
      baseUrl: 'https://api.ai-go.app/api/v1',
      apiKey: 'sk_live_test_key_1234567890',
    })
  })

  describe('建構與 URL 組合', () => {
    it('應去除 baseUrl 尾端斜線', () => {
      const c = new AigoClient({
        baseUrl: 'https://api.ai-go.app/api/v1/',
        apiKey: 'sk_live_xxx',
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })
      c.get('/test')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.ai-go.app/api/v1/test'),
        expect.any(Object)
      )
    })

    it('GET 請求應正確組合 query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })

      await client.get('/open/proxy/customers', { limit: 10, offset: 0 })

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain('limit=10')
      expect(calledUrl).toContain('offset=0')
    })

    it('GET 請求應跳過 undefined/null/空字串的 params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })

      await client.get('/test', { a: 'hello', b: undefined, c: '', d: 123 })

      const calledUrl = mockFetch.mock.calls[0][0] as string
      expect(calledUrl).toContain('a=hello')
      expect(calledUrl).toContain('d=123')
      expect(calledUrl).not.toContain('b=')
      expect(calledUrl).not.toContain('c=')
    })
  })

  describe('Headers 注入', () => {
    it('所有請求應攜帶 X-API-Key header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })

      await client.get('/test')

      const calledOptions = mockFetch.mock.calls[0][1]
      expect(calledOptions.headers['X-API-Key']).toBe('sk_live_test_key_1234567890')
    })

    it('所有請求應攜帶 Content-Type: application/json', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })

      await client.post('/test', { data: 1 })

      const calledOptions = mockFetch.mock.calls[0][1]
      expect(calledOptions.headers['Content-Type']).toBe('application/json')
    })

    it('應支援額外 headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })

      await client.get('/test', undefined, { Authorization: 'Bearer xyz' })

      const calledOptions = mockFetch.mock.calls[0][1]
      expect(calledOptions.headers['Authorization']).toBe('Bearer xyz')
    })
  })

  describe('HTTP 方法', () => {
    it('GET 請求使用 GET method', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
      await client.get('/test')
      expect(mockFetch.mock.calls[0][1].method).toBe('GET')
    })

    it('POST 請求使用 POST method 並序列化 body', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
      await client.post('/test', { name: '測試' })
      const options = mockFetch.mock.calls[0][1]
      expect(options.method).toBe('POST')
      expect(options.body).toBe(JSON.stringify({ name: '測試' }))
    })

    it('PATCH 請求使用 PATCH method', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
      await client.patch('/test', { name: '更新' })
      expect(mockFetch.mock.calls[0][1].method).toBe('PATCH')
    })

    it('DELETE 請求使用 DELETE method', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 204, json: () => Promise.resolve(undefined) })
      await client.delete('/test')
      expect(mockFetch.mock.calls[0][1].method).toBe('DELETE')
    })

    it('POST body 為 undefined 時不序列化', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
      await client.post('/test')
      expect(mockFetch.mock.calls[0][1].body).toBeUndefined()
    })
  })

  describe('回應處理', () => {
    it('200 OK 正確回傳 JSON 解析結果', async () => {
      const mockData = [{ id: '1', name: 'A' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await client.get('/test')
      expect(result).toEqual(mockData)
    })

    it('204 No Content 回傳 undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error('no body')),
      })

      const result = await client.delete('/test')
      expect(result).toBeUndefined()
    })
  })

  describe('錯誤處理', () => {
    it('401 應拋出 AigoApiError', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve(JSON.stringify({ detail: 'Invalid API Key' })),
      })

      await expect(client.get('/test')).rejects.toThrow(AigoApiError)
    })

    it('AigoApiError 應包含 status 與 body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: () => Promise.resolve(JSON.stringify({ detail: '此表不可引用' })),
      })

      try {
        await client.get('/test')
      } catch (err) {
        expect(err).toBeInstanceOf(AigoApiError)
        const apiErr = err as AigoApiError
        expect(apiErr.status).toBe(403)
        expect(apiErr.body).toEqual({ detail: '此表不可引用' })
      }
    })

    it('非 JSON 錯誤回應應 fallback 為純文字', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('伺服器內部錯誤'),
      })

      try {
        await client.get('/test')
      } catch (err) {
        const apiErr = err as AigoApiError
        expect(apiErr.body).toBe('伺服器內部錯誤')
      }
    })
  })
})
