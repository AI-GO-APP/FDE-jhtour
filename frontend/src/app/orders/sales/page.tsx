'use client';
/** 業務員訂單作業 | API: /api/sale-orders */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '訂單編號', dataIndex: 'name', width: 140 },
  { title: '客戶', dataIndex: 'partner_id', width: 150 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
  { title: '日期', dataIndex: 'date_order', width: 120 },
];

const formContent = (
  <>
    <Form.Item name="partner_id" label="客戶" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="date_order" label="訂單日期"><Input /></Form.Item>
    <Form.Item name="note" label="備註"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="業務員訂單作業"
      columns={columns}
      apiPath="/api/sale-orders"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋業務員訂單作業..."
      showExport
    />
  );
}
