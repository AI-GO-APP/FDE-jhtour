/**
 * 認證 API — Token 刷新
 * POST /api/auth/refresh
 *
 * 流程：從 cookie 取得 token → 呼叫 AI GO refresh → 更新 cookie
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getAigoClient } from '@/lib/aigo';
import { handleApiError } from '@/lib/aigo/route-helpers';
import type { TokenRefreshResponse } from '@/lib/aigo';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('aigo_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登入', authenticated: false },
        { status: 401 }
      );
    }

    const client = getAigoClient('erp');

    const result = await client.post<TokenRefreshResponse>(
      '/ext/auth/refresh',
      { token }
    );

    // 更新 cookie
    const response = NextResponse.json({
      success: true,
      expires_in: result.expires_in,
    });

    response.cookies.set('aigo_token', result.access_token, {
      httpOnly: true,
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
