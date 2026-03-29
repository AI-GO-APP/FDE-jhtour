'use client';
/** 房間安排 | API: /api/custom/hotel-contracts */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '飯店', dataIndex: 'hotel_name', width: 200 },
  { title: '房型', dataIndex: 'room_type', width: 100 },
  { title: '費率', dataIndex: 'rate', width: 100 },
  { title: '狀態', dataIndex: 'status', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="房間安排"
      columns={columns}
      apiPath="/api/custom/hotel-contracts"
      rowKey="id"
      searchPlaceholder="搜尋房間安排..."
      showExport
    />
  );
}
