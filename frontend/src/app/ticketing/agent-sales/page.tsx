'use client';
/** 代理銷售 | API: /api/custom/airline-contracts */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
  { title: '航空公司', dataIndex: 'airline_name', width: 200 },
  { title: '路線', dataIndex: 'route', width: 150 },
  { title: '狀態', dataIndex: 'status', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="代理銷售"
      columns={columns}
      apiPath="/api/custom/airline-contracts"
      rowKey="id"
      searchPlaceholder="搜尋代理銷售..."
      showExport
    />
  );
}
