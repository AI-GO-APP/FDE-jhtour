'use client';
/** 業績統計 | API: /api/sale-orders */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '訂單編號', dataIndex: 'name', width: 150 },
  { title: '日期', dataIndex: 'date_order', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="業績統計"
      columns={columns}
      apiPath="/api/sale-orders"
      rowKey="id"
      searchPlaceholder="搜尋業績統計..."
      showExport
    />
  );
}
