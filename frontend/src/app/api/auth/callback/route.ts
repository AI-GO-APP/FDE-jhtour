/**
 * 認證 API — Code 換 Token 回呼
 * GET /api/auth/callback?code=xxx
 *
 * 流程：接收 AI GO 重導帶來的 code → exchange 取得 access_token → 設定 cookie
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getAigoClient } from '@/lib/aigo';
import { handleApiError } from '@/lib/aigo/route-helpers';
import type { TokenExchangeResponse } from '@/lib/aigo';

/** 取得真實的對外 Base URL（處理 Docker/Reverse Proxy） */
function getExternalBaseUrl(request: NextRequest): string {
  // 優先使用環境變數（server-only，runtime 可用）
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, '');
  }
  // 其次使用 reverse proxy 轉發的 header
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  // 最後 fallback 到 request.url（本地開發時有效）
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json(
        { error: '缺少 code 參數' },
        { status: 400 }
      );
    }

    const client = getAigoClient('erp');

    // Code 換 Token
    const result = await client.post<TokenExchangeResponse>(
      '/ext/auth/exchange',
      { code }
    );

    // 使用正確的外部 URL 進行重導
    const baseUrl = getExternalBaseUrl(request);
    const response = NextResponse.redirect(new URL('/', baseUrl));

    response.cookies.set('aigo_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.expires_in,
      path: '/',
    });

    // 用戶資訊存在獨立 cookie（前端可讀）
    response.cookies.set('aigo_user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.expires_in,
      path: '/',
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

