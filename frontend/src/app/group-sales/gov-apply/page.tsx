'use client';
/** 政府核准件 | API: /api/custom/departure-schedules */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '團號', dataIndex: 'group_code', width: 120 },
  { title: '出發日', dataIndex: 'departure_date', width: 120 },
  { title: '人數', dataIndex: 'current_pax', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="政府核准件"
      columns={columns}
      apiPath="/api/custom/departure-schedules"
      rowKey="id"
      searchPlaceholder="搜尋政府核准件..."
      showExport
    />
  );
}
