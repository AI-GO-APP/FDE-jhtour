'use client';
/** 請假管理 | API: /api/hr/leaves */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '編號', dataIndex: 'id', width: 100 },
  { title: '名稱', dataIndex: 'name', width: 200 },
];

export default function Page() {
  return (
    <PageShell
      title="請假管理"
      columns={columns}
      apiPath="/api/hr/leaves"
      rowKey="id"
      searchPlaceholder="搜尋請假管理..."
      showExport
    />
  );
}
