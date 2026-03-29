'use client';
/** 幣別設定 | API: /api/currencies */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '幣別', dataIndex: 'name', width: 100 },
  { title: '全名', dataIndex: 'full_name', width: 200 },
  { title: '符號', dataIndex: 'symbol', width: 80 },
];

export default function Page() {
  return (
    <PageShell
      title="幣別設定"
      columns={columns}
      apiPath="/api/currencies"
      rowKey="id"
      searchPlaceholder="搜尋幣別設定..."
      showExport
    />
  );
}
