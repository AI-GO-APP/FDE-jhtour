/**
 * 傳票 — 單筆操作（不允許刪除）
 */
import { NextResponse, type NextRequest } from 'next/server';
import { erpProxy } from '@/lib/aigo';
import { handleApiError } from '@/lib/aigo/route-helpers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proxy = erpProxy();
    const data = await proxy.getById('account_moves', id);
    if (!data) {
      return NextResponse.json({ error: '找不到指定傳票' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proxy = erpProxy();
    const body = await request.json();
    const result = await proxy.update('account_moves', id, body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

// 注意：會計傳票不提供 DELETE 端點，帳務資料不可任意刪除
