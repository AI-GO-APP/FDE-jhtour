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

    // 設定 httpOnly cookie 儲存 access_token
    const response = NextResponse.redirect(new URL('/', request.url));

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
