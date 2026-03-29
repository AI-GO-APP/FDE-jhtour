'use client';
/** 團體自由行 | API: /api/custom/itinerary-templates */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '行程名稱', dataIndex: 'name', width: 200 },
  { title: '目的地', dataIndex: 'destination', width: 150 },
  { title: '天數', dataIndex: 'duration_days', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="團體自由行"
      columns={columns}
      apiPath="/api/custom/itinerary-templates"
      rowKey="id"
      searchPlaceholder="搜尋團體自由行..."
      showExport
    />
  );
}
