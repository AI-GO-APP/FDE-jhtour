'use client';
/** OP 人員訂單作業 | API: /api/sale-orders */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import RelationSelect from '@/components/form/RelationSelect';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '訂單編號', dataIndex: 'name', width: 140 },
  { title: '客戶', dataIndex: 'partner_id', width: 150 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="partner_id" label="客戶" rules={[{ required: true }]}>
      <RelationSelect apiPath="/api/customers" placeholder="搜尋客戶..." />
    </Form.Item>
    <Form.Item name="note" label="備註"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="OP 人員訂單作業"
      columns={columns}
      apiPath="/api/sale-orders"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋OP 人員訂單作業..."
      showExport
    />
  );
}
