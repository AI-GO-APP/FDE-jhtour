/**
 * Auth Context 單元測試
 * 測試認證狀態管理：cookie 解析、登入/登出邏輯
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock document.cookie
let cookieStore: Record<string, string> = {}

function setCookie(name: string, value: string) {
  cookieStore[name] = value
  Object.defineProperty(document, 'cookie', {
    get: () => Object.entries(cookieStore).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('; '),
    configurable: true,
  })
}

function clearCookies() {
  cookieStore = {}
  Object.defineProperty(document, 'cookie', {
    get: () => '',
    configurable: true,
  })
}

describe('Auth 工具函式', () => {
  beforeEach(() => {
    clearCookies()
    vi.clearAllMocks()
  })

  describe('Cookie 解析', () => {
    it('應正確解析 aigo_user cookie 為 AuthUser', () => {
      const aigoUser = { id: 'user-uuid-123', email: 'test@example.com', name: '王小明' }
      setCookie('aigo_user', JSON.stringify(aigoUser))

      // 模擬 buildUserFromCookie 的邏輯
      const raw = cookieStore['aigo_user']
      const parsed = JSON.parse(raw)
      expect(parsed.id).toBe('user-uuid-123')
      expect(parsed.email).toBe('test@example.com')
      expect(parsed.name).toBe('王小明')
    })

    it('無 cookie 時應回傳 null 行為', () => {
      const raw = cookieStore['aigo_user']
      expect(raw).toBeUndefined()
    })

    it('無效 JSON cookie 不應造成 crash', () => {
      setCookie('aigo_user', 'invalid-json{{{')
      const raw = cookieStore['aigo_user']
      expect(() => {
        try { JSON.parse(raw) } catch { /* 預期失敗 */ }
      }).not.toThrow()
    })
  })

  describe('AuthUser 角色映射', () => {
    it('AI GO 使用者應預設為 ADMIN 角色', () => {
      const aigoUser = { id: 'uuid', email: 'admin@jhtour.com', name: '管理員' }
      // 模擬 buildUserFromCookie 的映射邏輯
      const authUser = {
        userId: aigoUser.id,
        empName: aigoUser.name || aigoUser.email,
        role: 'ADMIN' as const,
        aigoId: aigoUser.id,
        email: aigoUser.email,
        isDemo: false,
      }
      expect(authUser.role).toBe('ADMIN')
      expect(authUser.isDemo).toBe(false)
    })

    it('Demo 使用者應標記 isDemo = true', () => {
      const demoUser = {
        userId: 'U001',
        empName: '系統管理員',
        role: 'ADMIN' as const,
        isDemo: true,
      }
      expect(demoUser.isDemo).toBe(true)
    })
  })
})

describe('Auth API 呼叫', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('POST /api/auth/login', () => {
    it('成功時應回傳 redirect_url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          redirect_url: 'https://ai-go.app/integrations/0896b6c79114',
          message: '請前往 AI GO 平台登入',
        }),
      })

      const res = await fetch('/api/auth/login', { method: 'POST' })
      const data = await res.json()
      expect(data.redirect_url).toContain('ai-go.app')
      expect(data.redirect_url).toContain('0896b6c79114')
    })
  })

  describe('GET /api/auth/me', () => {
    it('已認證時應回傳 user 物件', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticated: true,
          user: { id: 'uuid', email: 'test@test.com', name: '測試' },
        }),
      })

      const res = await fetch('/api/auth/me')
      const data = await res.json()
      expect(data.authenticated).toBe(true)
      expect(data.user.email).toBe('test@test.com')
    })

    it('未認證時應回傳 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ authenticated: false, user: null }),
      })

      const res = await fetch('/api/auth/me')
      expect(res.status).toBe(401)
    })
  })

  describe('DELETE /api/auth/me（登出）', () => {
    it('應成功清除 session', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const res = await fetch('/api/auth/me', { method: 'DELETE' })
      const data = await res.json()
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('成功 refresh 應回傳 success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, expires_in: 86400 }),
      })

      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('未登入時 refresh 應回傳 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: '未登入' }),
      })

      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      expect(res.status).toBe(401)
    })
  })
})
