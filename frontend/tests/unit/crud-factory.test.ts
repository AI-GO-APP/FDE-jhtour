/**
 * CRUD Factory 單元測試
 * 測試 Schema 驗證、必填檢查、唯讀判定
 */
import { describe, it, expect } from 'vitest'
import {
  validateRequiredFields,
  isReadonlyTable,
  getTableSchema,
  TABLE_SCHEMAS,
} from '@/lib/aigo/crud-factory'

describe('TABLE_SCHEMAS 定義', () => {
  it('應包含客戶表定義', () => {
    expect(TABLE_SCHEMAS.customers).toBeDefined()
    expect(TABLE_SCHEMAS.customers.fields?.name?.required).toBe(true)
  })

  it('應包含唯讀參考表', () => {
    expect(TABLE_SCHEMAS.countries?.readonly).toBe(true)
    expect(TABLE_SCHEMAS.currencies?.readonly).toBe(true)
    expect(TABLE_SCHEMAS.currency_rates?.readonly).toBe(true)
  })

  it('客戶表 customer_type 應有列舉限制', () => {
    const field = TABLE_SCHEMAS.customers.fields?.customer_type
    expect(field?.enum).toContain('company')
    expect(field?.enum).toContain('individual')
  })
})

describe('isReadonlyTable()', () => {
  it('唯讀表應回傳 true', () => {
    expect(isReadonlyTable('countries')).toBe(true)
    expect(isReadonlyTable('currencies')).toBe(true)
    expect(isReadonlyTable('account_accounts')).toBe(true)
  })

  it('可寫表應回傳 false', () => {
    expect(isReadonlyTable('customers')).toBe(false)
    expect(isReadonlyTable('sale_orders')).toBe(false)
    expect(isReadonlyTable('suppliers')).toBe(false)
  })

  it('未定義的表應回傳 false', () => {
    expect(isReadonlyTable('unknown_table')).toBe(false)
  })
})

describe('getTableSchema()', () => {
  it('應回傳已定義表的 schema', () => {
    const schema = getTableSchema('customers')
    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
  })

  it('未定義的表應回傳 undefined', () => {
    expect(getTableSchema('nonexistent')).toBeUndefined()
  })
})

describe('validateRequiredFields()', () => {
  describe('customers 表驗證', () => {
    it('完整資料應通過驗證', () => {
      const result = validateRequiredFields('customers', {
        name: '測試客戶',
        customer_type: 'company',
      })
      expect(result).toBeNull()
    })

    it('缺少 name 應回傳錯誤', () => {
      const result = validateRequiredFields('customers', {
        customer_type: 'company',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('name')
    })

    it('缺少 customer_type 應回傳錯誤', () => {
      const result = validateRequiredFields('customers', {
        name: '測試客戶',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('customer_type')
    })

    it('空字串應視為未提供', () => {
      const result = validateRequiredFields('customers', {
        name: '',
        customer_type: 'company',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('name')
    })

    it('null 應視為未提供', () => {
      const result = validateRequiredFields('customers', {
        name: null,
        customer_type: 'company',
      })
      expect(result).not.toBeNull()
    })

    it('無效的 enum 值應回傳錯誤', () => {
      const result = validateRequiredFields('customers', {
        name: '客戶',
        customer_type: 'invalid_type',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('無效')
    })
  })

  describe('sale_orders 表驗證', () => {
    it('完整資料應通過', () => {
      const result = validateRequiredFields('sale_orders', {
        partner_id: '550e8400-e29b-41d4-a716-446655440000',
        date_order: '2026-04-01',
      })
      expect(result).toBeNull()
    })

    it('缺少 partner_id 應包含 FK 提示', () => {
      const result = validateRequiredFields('sale_orders', {
        date_order: '2026-04-01',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('partner_id')
      expect(result).toContain('customers.id')
    })
  })

  describe('account_moves 表驗證', () => {
    it('有效 move_type 應通過', () => {
      const result = validateRequiredFields('account_moves', {
        move_type: 'out_invoice',
        date: '2026-04-01',
      })
      expect(result).toBeNull()
    })

    it('無效 move_type 應失敗', () => {
      const result = validateRequiredFields('account_moves', {
        move_type: 'bad_type',
        date: '2026-04-01',
      })
      expect(result).not.toBeNull()
      expect(result).toContain('無效')
    })
  })

  describe('未定義的表', () => {
    it('未先定義的表應自動通過（無 schema）', () => {
      const result = validateRequiredFields('unknown_table', { any: 'data' })
      expect(result).toBeNull()
    })
  })

  describe('多欄位錯誤', () => {
    it('缺少多個必填欄位應合併回傳', () => {
      const result = validateRequiredFields('customers', {})
      expect(result).not.toBeNull()
      expect(result).toContain('name')
      expect(result).toContain('customer_type')
      // 錯誤以分號分隔
      expect(result).toContain('；')
    })
  })
})
