/**
 * 認證 API — 發起 One-Time Code 登入
 * POST /api/auth/login
 *
 * 流程：呼叫 AI GO 產生 One-Time Code → 回傳 redirect_url 給前端跳轉
 */

import { NextResponse } from 'next/server';
import { getAigoClient, getAppId } from '@/lib/aigo';
import { handleApiError } from '@/lib/aigo/route-helpers';
import type { LaunchResponse } from '@/lib/aigo';

export async function POST() {
  try {
    const client = getAigoClient('erp');
    const appId = getAppId('erp');

    // 呼叫 AI GO 產生 One-Time Code
    const result = await client.post<LaunchResponse>(
      `/integrations/${appId}/launch`
    );

    return NextResponse.json({
      redirect_url: result.redirect_url,
      code: result.code,
      expires_in: result.expires_in,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
