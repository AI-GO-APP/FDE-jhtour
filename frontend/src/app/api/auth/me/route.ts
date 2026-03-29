/**
 * 認證 API — 取得當前用戶資訊
 * GET /api/auth/me
 *
 * 從 cookie 讀取用戶資訊回傳，驗證 session 有效性
 */

import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('aigo_token')?.value;
  const userCookie = request.cookies.get('aigo_user')?.value;

  if (!token || !userCookie) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  try {
    const user = JSON.parse(userCookie);
    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
}

/**
 * 登出 — 清除 cookie
 * DELETE /api/auth/me
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('aigo_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('aigo_user', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
