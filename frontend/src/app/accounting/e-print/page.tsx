'use client';
/** 電子發票列印 | API: /api/accounting */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '傳票編號', dataIndex: 'name', width: 150 },
  { title: '類型', dataIndex: 'move_type', width: 100 },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="電子發票列印"
      columns={columns}
      apiPath="/api/accounting"
      rowKey="id"
      searchPlaceholder="搜尋電子發票列印..."
      showExport
    />
  );
}
