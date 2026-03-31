/**
 * Route Helpers 單元測試
 * 測試 parseQueryOptions 解析 URL 參數
 */
import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { parseQueryOptions, handleApiError } from '@/lib/aigo/route-helpers'
import { AigoApiError } from '@/lib/aigo/client'

/** 建立 mock NextRequest */
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3006'))
}

describe('parseQueryOptions()', () => {
  describe('分頁參數', () => {
    it('應解析 limit 和 offset', () => {
      const req = createRequest('/api/customers?limit=50&offset=10')
      const opts = parseQueryOptions(req)
      expect(opts.limit).toBe(50)
      expect(opts.offset).toBe(10)
    })

    it('limit 上限應為 200', () => {
      const req = createRequest('/api/customers?limit=999')
      const opts = parseQueryOptions(req)
      expect(opts.limit).toBe(200)
    })

    it('未提供分頁時不應有預設值', () => {
      const req = createRequest('/api/customers')
      const opts = parseQueryOptions(req)
      expect(opts.limit).toBeUndefined()
      expect(opts.offset).toBeUndefined()
    })
  })

  describe('搜尋參數', () => {
    it('應解析 search 關鍵字', () => {
      const req = createRequest('/api/customers?search=王')
      const opts = parseQueryOptions(req)
      expect(opts.search).toBe('王')
    })

    it('應解析 search_columns 為陣列', () => {
      const req = createRequest('/api/customers?search_columns=name,email,phone')
      const opts = parseQueryOptions(req)
      expect(opts.search_columns).toEqual(['name', 'email', 'phone'])
    })
  })

  describe('排序參數', () => {
    it('應解析 order_by 為陣列', () => {
      const req = createRequest('/api/customers?order_by=name:asc,created_at:desc')
      const opts = parseQueryOptions(req)
      expect(opts.order_by).toEqual([
        { column: 'name', direction: 'asc' },
        { column: 'created_at', direction: 'desc' },
      ])
    })

    it('未指定方向應預設為 asc', () => {
      const req = createRequest('/api/customers?order_by=name')
      const opts = parseQueryOptions(req)
      expect(opts.order_by?.[0].direction).toBe('asc')
    })
  })

  describe('select_columns 參數', () => {
    it('應解析為陣列', () => {
      const req = createRequest('/api/customers?select_columns=id,name,email')
      const opts = parseQueryOptions(req)
      expect(opts.select_columns).toEqual(['id', 'name', 'email'])
    })
  })

  describe('filter 參數', () => {
    it('應解析 filter_{column}_{op} 格式', () => {
      const req = createRequest('/api/customers?filter_status_eq=active')
      const opts = parseQueryOptions(req)
      expect(opts.filters).toHaveLength(1)
      expect(opts.filters![0]).toEqual({ column: 'status', op: 'eq', value: 'active' })
    })

    it('數值 filter 值應自動轉為 number', () => {
      const req = createRequest('/api/sale-orders?filter_amount_total_gte=1000')
      const opts = parseQueryOptions(req)
      expect(opts.filters![0].value).toBe(1000)
    })

    it('in 運算子的值應解析為陣列', () => {
      const req = createRequest('/api/sale-orders?filter_state_in=draft,sale,done')
      const opts = parseQueryOptions(req)
      expect(opts.filters![0].value).toEqual(['draft', 'sale', 'done'])
    })

    it('is_null 運算子的值應為 true', () => {
      const req = createRequest('/api/customers?filter_email_is_null=1')
      const opts = parseQueryOptions(req)
      expect(opts.filters![0].op).toBe('is_null')
      expect(opts.filters![0].value).toBe(true)
    })

    it('多個 filter 應全部解析', () => {
      const req = createRequest('/api/orders?filter_state_eq=sale&filter_amount_total_gte=500')
      const opts = parseQueryOptions(req)
      expect(opts.filters).toHaveLength(2)
    })

    it('非 filter 格式的參數不應被收集', () => {
      const req = createRequest('/api/customers?limit=10&name=test')
      const opts = parseQueryOptions(req)
      expect(opts.filters).toBeUndefined()
    })
  })

  describe('複合查詢', () => {
    it('應同時解析所有參數類型', () => {
      const req = createRequest(
        '/api/customers?limit=20&offset=0&search=test&order_by=name:asc&filter_status_eq=active'
      )
      const opts = parseQueryOptions(req)
      expect(opts.limit).toBe(20)
      expect(opts.offset).toBe(0)
      expect(opts.search).toBe('test')
      expect(opts.order_by).toHaveLength(1)
      expect(opts.filters).toHaveLength(1)
    })
  })
})

describe('handleApiError()', () => {
  it('AigoApiError 應回傳對應 status', () => {
    const error = new AigoApiError(403, 'Forbidden', { detail: '禁止存取' })
    const response = handleApiError(error)
    expect(response.status).toBe(403)
  })

  it('一般 Error 應回傳 500', () => {
    const error = new Error('意外錯誤')
    const response = handleApiError(error)
    expect(response.status).toBe(500)
  })

  it('非 Error 物件應回傳 500', () => {
    const response = handleApiError('string error')
    expect(response.status).toBe(500)
  })
})
