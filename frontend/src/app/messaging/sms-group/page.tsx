'use client';
/** 群發對象 | API: /api/customers */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '客戶名稱', dataIndex: 'name', width: 200 },
  { title: '電話', dataIndex: 'phone', width: 130 },
];

export default function Page() {
  return (
    <PageShell
      title="群發對象"
      columns={columns}
      apiPath="/api/customers"
      rowKey="id"
      searchPlaceholder="搜尋群發對象..."
      showExport
    />
  );
}
