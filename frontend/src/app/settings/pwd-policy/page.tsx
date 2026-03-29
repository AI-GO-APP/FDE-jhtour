'use client';
/** 密碼政策 | API: /api/hr */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '員工', dataIndex: 'name', width: 200 },
  { title: 'Email', dataIndex: 'work_email', width: 200 },
];

export default function Page() {
  return (
    <PageShell
      title="密碼政策"
      columns={columns}
      apiPath="/api/hr"
      rowKey="id"
      searchPlaceholder="搜尋密碼政策..."
      showExport
    />
  );
}
