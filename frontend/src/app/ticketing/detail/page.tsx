'use client';
/** 機票明細資料 | API: /api/custom/airline-contracts */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
  { title: '航空名稱', dataIndex: 'airline_name', width: 150 },
  { title: '航線', dataIndex: 'route', width: 120 },
  { title: '艙等', dataIndex: 'seat_class', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 80 },
];

export default function Page() {
  return (
    <PageShell
      title="機票明細資料"
      columns={columns}
      apiPath="/api/custom/airline-contracts"
      rowKey="id"
      searchPlaceholder="搜尋機票明細資料..."
      showExport
    />
  );
}
