/**
 * 認證 API — 發起登入
 * POST /api/auth/login
 *
 * 流程：回傳 AI GO 整合頁面 URL，使用者在 AI GO 主站登入後點「前往應用」
 * AI GO 會自動產生 OTC 碼並重導到 /api/auth/callback?code=xxx
 *
 * 注意：/integrations/{appId}/launch 端點需要主站 JWT（builder.access 權限），
 * 不能直接用 API Key 呼叫。OTC 碼由 AI GO 主站在使用者點擊「前往應用」時產生。
 */

import { NextResponse } from 'next/server';
import { getAppId } from '@/lib/aigo';

export async function POST() {
  try {
    const appId = getAppId('erp');
    const baseUrl = process.env.AIGO_API_BASE_URL || 'https://www.ai-go.app/api/v1';
    // 從 API base URL 推導主站 URL
    const siteUrl = baseUrl.replace('/api/v1', '');

    // 回傳 AI GO 整合頁面的 URL
    // 使用者需在此頁面登入 AI GO 並點擊「前往應用」
    const integrationUrl = `${siteUrl}/integrations/${appId}`;

    return NextResponse.json({
      redirect_url: integrationUrl,
      message: '請前往 AI GO 平台登入並點擊「前往應用」進入 ERP',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登入發起失敗' },
      { status: 500 }
    );
  }
}
