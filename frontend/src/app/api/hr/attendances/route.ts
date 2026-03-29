/**
 * 出勤打卡 API（不允許刪除）
 */
import { createListRouteHandlers } from '@/lib/aigo/crud-factory';

export const { GET, POST } = createListRouteHandlers('hr_attendances');
