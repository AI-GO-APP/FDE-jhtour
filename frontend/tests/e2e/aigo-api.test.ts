/**
 * AI GO API E2E 整合測試
 * 使用真實 API Key 打 AI GO 端點，驗證連線、認證、資料存取
 *
 * 需要環境變數：
 * - AIGO_API_BASE_URL
 * - AIGO_ERP_API_KEY
 * - AIGO_ERP_APP_ID
 */
import { describe, it, expect, beforeAll } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// 手動讀取 .env.local
function loadEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, '../../.env.local')
  if (!fs.existsSync(envPath)) return {}
  const content = fs.readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    env[key] = val
  }
  return env
}

let API_BASE: string
let API_KEY: string
let APP_ID: string

beforeAll(() => {
  const env = loadEnv()
  API_BASE = env.AIGO_API_BASE_URL || process.env.AIGO_API_BASE_URL || ''
  API_KEY = env.AIGO_ERP_API_KEY || process.env.AIGO_ERP_API_KEY || ''
  APP_ID = env.AIGO_ERP_APP_ID || process.env.AIGO_ERP_APP_ID || ''

  if (!API_BASE || !API_KEY) {
    console.warn('⚠️ 缺少必要環境變數，E2E 測試可能失敗')
  }
})

/** 共用 fetch helper */
async function aigoFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE}${path}`
  return fetch(url, {
    ...options,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
}

// ============================
// 1. 連線與認證測試
// ============================

describe('E2E: 連線與認證', () => {
  it('有效 API Key 應回傳 200', async () => {
    const res = await aigoFetch('/open/proxy/customers?limit=1')
    expect(res.status).toBe(200)
  })

  it('無效 API Key 應回傳 401', async () => {
    const res = await fetch(`${API_BASE}/open/proxy/customers?limit=1`, {
      headers: {
        'X-API-Key': 'sk_live_invalid_key_1234567890abcdef',
        'Content-Type': 'application/json',
      },
    })
    expect(res.status).toBe(401)
  })

  it('缺少 API Key 應回傳 401 或 403', async () => {
    const res = await fetch(`${API_BASE}/open/proxy/customers?limit=1`, {
      headers: { 'Content-Type': 'application/json' },
    })
    expect([401, 403, 422]).toContain(res.status)
  })
})

// ============================
// 2. Proxy API — 簡單查詢
// ============================

describe('E2E: Proxy API — 簡單查詢', () => {
  it('GET 客戶列表應回傳陣列', async () => {
    const res = await aigoFetch('/open/proxy/customers?limit=5')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('GET 客戶列表的每筆記錄應含 id 欄位', async () => {
    const res = await aigoFetch('/open/proxy/customers?limit=3')
    const data = await res.json()
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id')
    }
  })

  it('limit 參數應限制回傳筆數', async () => {
    const res = await aigoFetch('/open/proxy/customers?limit=2')
    const data = await res.json()
    expect(data.length).toBeLessThanOrEqual(2)
  })

  it('offset 參數應跳過前 N 筆', async () => {
    const res1 = await aigoFetch('/open/proxy/customers?limit=5&offset=0')
    const data1 = await res1.json()
    const res2 = await aigoFetch('/open/proxy/customers?limit=5&offset=5')
    const data2 = await res2.json()

    if (data1.length === 5 && data2.length > 0) {
      // 第二頁的第一筆不應與第一頁重複
      expect(data2[0].id).not.toBe(data1[0].id)
    }
  })
})

// ============================
// 3. Proxy API — 進階查詢
// ============================

describe('E2E: Proxy API — 進階查詢', () => {
  it('POST /query 應支援 filters', async () => {
    const res = await aigoFetch('/open/proxy/customers/query', {
      method: 'POST',
      body: JSON.stringify({
        filters: [{ column: 'customer_type', op: 'eq', value: 'individual' }],
        limit: 5,
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('POST /query 應支援 search', async () => {
    const res = await aigoFetch('/open/proxy/customers/query', {
      method: 'POST',
      body: JSON.stringify({
        search: '測試',
        search_columns: ['name'],
        limit: 5,
      }),
    })
    expect(res.status).toBe(200)
  })

  it('POST /query 應支援 order_by', async () => {
    const res = await aigoFetch('/open/proxy/customers/query', {
      method: 'POST',
      body: JSON.stringify({
        order_by: [{ column: 'created_at', direction: 'desc' }],
        limit: 5,
      }),
    })
    expect(res.status).toBe(200)
  })

  it('POST /query 應支援 count_only', async () => {
    const res = await aigoFetch('/open/proxy/customers/query', {
      method: 'POST',
      body: JSON.stringify({ count_only: true }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('total')
    expect(typeof data.total).toBe('number')
  })

  it('POST /query 應支援 select_columns', async () => {
    const res = await aigoFetch('/open/proxy/customers/query', {
      method: 'POST',
      body: JSON.stringify({
        select_columns: ['id', 'name'],
        limit: 3,
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id')
      expect(data[0]).toHaveProperty('name')
    }
  })
})

// ============================
// 4. 多表存取測試
// ============================

describe('E2E: 多表存取', () => {
  const tables = [
    'customers',
    'suppliers',
    'product_products',
    'sale_orders',
    'purchase_orders',
  ]

  for (const table of tables) {
    it(`GET /open/proxy/${table} 應回傳 200`, async () => {
      const res = await aigoFetch(`/open/proxy/${table}?limit=1`)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })
  }
})

// ============================
// 5. 未授權表測試
// ============================

describe('E2E: 未授權/不存在表', () => {
  it('不存在的表應回傳 403 或 404', async () => {
    const res = await aigoFetch('/open/proxy/nonexistent_table_xyz?limit=1')
    expect([403, 404]).toContain(res.status)
  })
})

// ============================
// 6. External Auth 端點測試
// ============================

describe('E2E: External Auth 端點', () => {
  it('POST /ext/auth/exchange 無效 code 應回傳 400 或 401', async () => {
    const res = await aigoFetch('/ext/auth/exchange', {
      method: 'POST',
      body: JSON.stringify({ code: 'invalid_code_12345' }),
    })
    // 無效 code 應被拒絕
    expect([400, 401, 404]).toContain(res.status)
  })

  it('POST /ext/auth/refresh 無效 token 應回傳 401', async () => {
    const res = await aigoFetch('/ext/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid.jwt.token' }),
    })
    expect([400, 401]).toContain(res.status)
  })
})

// ============================
// 7. Custom Table API 測試
// ============================

describe('E2E: Custom Table (Open Data) API', () => {
  it('GET /open/data/objects 應回傳 App 的 Custom Table 列表', async () => {
    const res = await aigoFetch('/open/data/objects')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('Custom Table 列表中每個物件應含 api_slug 和 fields', async () => {
    const res = await aigoFetch('/open/data/objects')
    const data = await res.json()
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('api_slug')
      expect(data[0]).toHaveProperty('fields')
      expect(Array.isArray(data[0].fields)).toBe(true)
    }
  })
})

// ============================
// 8. Rate Limit 邊界測試
// ============================

describe('E2E: Rate Limit 基本驗證', () => {
  it('快速連續 5 個請求不應觸發 429', async () => {
    const promises = Array.from({ length: 5 }, () =>
      aigoFetch('/open/proxy/customers?limit=1')
    )
    const results = await Promise.all(promises)
    const statuses = results.map(r => r.status)
    // 所有請求都應該是 200（5 個還不該觸發限流）
    expect(statuses.every(s => s === 200)).toBe(true)
  })
})
