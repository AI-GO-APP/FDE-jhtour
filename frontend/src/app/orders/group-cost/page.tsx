'use client';
/** 團體成本請款 | API: /api/purchase-orders */
import React from 'react';
import { Form, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import RelationSelect from '@/components/form/RelationSelect';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '單號', dataIndex: 'name', width: 140 },
  { title: '供應商', dataIndex: 'partner_id', width: 150 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="partner_id" label="供應商" rules={[{ required: true }]}>
      <RelationSelect apiPath="/api/suppliers" placeholder="搜尋供應商..." />
    </Form.Item>
    <Form.Item name="amount_total" label="金額">
      <InputNumber style={{ width: '100%' }} min={0} precision={2} placeholder="輸入金額" />
    </Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="團體成本請款"
      columns={columns}
      apiPath="/api/purchase-orders"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋團體成本請款..."
      showExport
    />
  );
}
