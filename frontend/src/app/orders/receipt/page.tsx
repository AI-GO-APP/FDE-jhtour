'use client';
/** 繳款單作業 | API: /api/accounting */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '單號', dataIndex: 'name', width: 140 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="繳款單作業"
      columns={columns}
      apiPath="/api/accounting"
      rowKey="id"
      searchPlaceholder="搜尋繳款單作業..."
      showExport
    />
  );
}
