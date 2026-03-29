'use client';
/** 旅客清除 | API: /api/customers */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '客戶名稱', dataIndex: 'name', width: 200 },
  { title: '類型', dataIndex: 'customer_type', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="旅客清除"
      columns={columns}
      apiPath="/api/customers"
      rowKey="id"
      searchPlaceholder="搜尋旅客清除..."
      showExport
    />
  );
}
