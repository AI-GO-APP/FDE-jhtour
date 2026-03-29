'use client';
/** 批次修改 | API: /api/sale-orders */
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
      title="批次修改"
      columns={columns}
      apiPath="/api/sale-orders"
      rowKey="id"
      searchPlaceholder="搜尋批次修改..."
      showExport
    />
  );
}
