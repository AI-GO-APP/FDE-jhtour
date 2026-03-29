'use client';
/** 批次收款 | API: /api/accounting/payments */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '金額', dataIndex: 'amount', width: 120 },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '類型', dataIndex: 'payment_type', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="批次收款"
      columns={columns}
      apiPath="/api/accounting/payments"
      rowKey="id"
      searchPlaceholder="搜尋批次收款..."
      showExport
    />
  );
}
