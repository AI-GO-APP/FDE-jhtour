'use client';
/** 空白票管理 | API: /api/custom/airline-contracts */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空公司', dataIndex: 'airline_name', width: 200 },
  { title: '艙等', dataIndex: 'seat_class', width: 100 },
  { title: '狀態', dataIndex: 'status', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="空白票管理"
      columns={columns}
      apiPath="/api/custom/airline-contracts"
      rowKey="id"
      searchPlaceholder="搜尋空白票管理..."
      showExport
    />
  );
}
