'use client';
/** 票價異動通知 | API: /api/custom/airline-contracts */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空公司', dataIndex: 'airline_name', width: 200 },
  { title: '路線', dataIndex: 'route', width: 150 },
  { title: '費率', dataIndex: 'rate', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="票價異動通知"
      columns={columns}
      apiPath="/api/custom/airline-contracts"
      rowKey="id"
      searchPlaceholder="搜尋票價異動通知..."
      showExport
    />
  );
}
