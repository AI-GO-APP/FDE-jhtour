/**
 * Proxy Client 單元測試
 * 測試 AigoProxyClient 的 CRUD 操作與 URL 組合
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AigoProxyClient } from '@/lib/aigo/proxy-client'

/** 建立 mock AigoClient（不使用 vi.mock，改直接建構 mock 物件） */
function createMockClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}

describe('AigoProxyClient', () => {
  let mockClient: ReturnType<typeof createMockClient>
  let proxy: AigoProxyClient

  beforeEach(() => {
    vi.clearAllMocks()
    mockClient = createMockClient()
    // 使用 as any 繞過型別檢查，因為 mock 物件與 AigoClient 簽名一致
    proxy = new AigoProxyClient(mockClient as any)
  })

  describe('list()', () => {
    it('應呼叫 GET /open/proxy/{table}', async () => {
      mockClient.get.mockResolvedValueOnce([{ id: '1', name: 'A' }])
      const result = await proxy.list('customers', 50, 0)
      expect(mockClient.get).toHaveBeenCalledWith('/open/proxy/customers', { limit: 50, offset: 0 })
      expect(result).toHaveLength(1)
    })

    it('預設 limit=100, offset=0', async () => {
      mockClient.get.mockResolvedValueOnce([])
      await proxy.list('customers')
      expect(mockClient.get).toHaveBeenCalledWith('/open/proxy/customers', { limit: 100, offset: 0 })
    })
  })

  describe('query()', () => {
    it('應呼叫 POST /open/proxy/{table}/query', async () => {
      mockClient.post.mockResolvedValueOnce([{ id: '1' }])
      const opts = { filters: [{ column: 'status', op: 'eq' as const, value: 'active' }], limit: 20 }
      await proxy.query('customers', opts)
      expect(mockClient.post).toHaveBeenCalledWith('/open/proxy/customers/query', opts)
    })

    it('count_only 模式應拋出錯誤（引導使用 count()）', async () => {
      await expect(
        proxy.query('customers', { count_only: true })
      ).rejects.toThrow('count_only')
    })
  })

  describe('count()', () => {
    it('應呼叫 POST /query 帶 count_only=true', async () => {
      mockClient.post.mockResolvedValueOnce({ total: 42 })
      const count = await proxy.count('customers', {
        filters: [{ column: 'status', op: 'eq', value: 'active' }],
      })
      expect(count).toBe(42)
      expect(mockClient.post).toHaveBeenCalledWith(
        '/open/proxy/customers/query',
        expect.objectContaining({ count_only: true })
      )
    })
  })

  describe('getById()', () => {
    it('應用 filter id=xxx + limit=1 查詢', async () => {
      mockClient.post.mockResolvedValueOnce([{ id: 'abc', name: 'Test' }])
      const result = await proxy.getById('customers', 'abc')
      expect(result).toEqual({ id: 'abc', name: 'Test' })
      expect(mockClient.post).toHaveBeenCalledWith(
        '/open/proxy/customers/query',
        {
          filters: [{ column: 'id', op: 'eq', value: 'abc' }],
          limit: 1,
        }
      )
    })

    it('找不到時應回傳 null', async () => {
      mockClient.post.mockResolvedValueOnce([])
      const result = await proxy.getById('customers', 'nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('create()', () => {
    it('應呼叫 POST /open/proxy/{table}', async () => {
      const newData = { name: '新客戶', customer_type: 'individual' }
      mockClient.post.mockResolvedValueOnce({ id: 'new-uuid', data: newData })
      await proxy.create('customers', newData)
      expect(mockClient.post).toHaveBeenCalledWith('/open/proxy/customers', newData)
    })
  })

  describe('update()', () => {
    it('應呼叫 PATCH /open/proxy/{table}/{id}', async () => {
      mockClient.patch.mockResolvedValueOnce({ id: 'abc', updated: true })
      await proxy.update('customers', 'abc', { name: '更新名稱' })
      expect(mockClient.patch).toHaveBeenCalledWith('/open/proxy/customers/abc', { name: '更新名稱' })
    })
  })

  describe('remove()', () => {
    it('應呼叫 DELETE /open/proxy/{table}/{id}', async () => {
      mockClient.delete.mockResolvedValueOnce(undefined)
      await proxy.remove('customers', 'abc')
      expect(mockClient.delete).toHaveBeenCalledWith('/open/proxy/customers/abc')
    })
  })

  describe('asCustomTable()', () => {
    it('應回傳新的 ProxyClient 實例', () => {
      const custom = proxy.asCustomTable()
      expect(custom).toBeInstanceOf(AigoProxyClient)
      expect(custom).not.toBe(proxy)
    })
  })
})
