'use client';
/** 請款單作業 | API: /api/accounting */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '單號', dataIndex: 'name', width: 140 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
  { title: '日期', dataIndex: 'date', width: 120 },
];

const formContent = (
  <>
    <Form.Item name="partner_id" label="對象" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="amount_total" label="金額"><Input /></Form.Item>
    <Form.Item name="date" label="日期"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="請款單作業"
      columns={columns}
      apiPath="/api/accounting"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋請款單作業..."
      showExport
    />
  );
}
