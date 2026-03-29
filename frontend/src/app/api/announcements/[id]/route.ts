/**
 * 公告 — 單筆操作
 */
import { createDetailRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, PATCH, DELETE } = createDetailRouteHandlers('announcements');
