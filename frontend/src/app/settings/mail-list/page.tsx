'use client';
/** 郵件清單 | API: /api/customers */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '客戶名稱', dataIndex: 'name', width: 200 },
  { title: 'Email', dataIndex: 'email', width: 200 },
];

export default function Page() {
  return (
    <PageShell
      title="郵件清單"
      columns={columns}
      apiPath="/api/customers"
      rowKey="id"
      searchPlaceholder="搜尋郵件清單..."
      showExport
    />
  );
}
