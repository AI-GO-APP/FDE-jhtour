'use client';
/** 信用卡刷卡查詢 | API: /api/sale-orders */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '訂單編號', dataIndex: 'name', width: 140 },
  { title: '客戶', dataIndex: 'partner_id', width: 150 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="信用卡刷卡查詢"
      columns={columns}
      apiPath="/api/sale-orders"
      rowKey="id"
      searchPlaceholder="搜尋信用卡刷卡查詢..."
      showExport
    />
  );
}
