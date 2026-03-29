'use client';
/** 飯店利潤 | API: /api/custom/hotel-contracts */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '飯店', dataIndex: 'hotel_name', width: 200 },
  { title: '費率', dataIndex: 'rate', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="飯店利潤"
      columns={columns}
      apiPath="/api/custom/hotel-contracts"
      rowKey="id"
      searchPlaceholder="搜尋飯店利潤..."
      showExport
    />
  );
}
