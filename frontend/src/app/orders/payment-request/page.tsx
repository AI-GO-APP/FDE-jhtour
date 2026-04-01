'use client';
/** 請款單作業 | API: /api/accounting */
import React from 'react';
import { Form, InputNumber, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import RelationSelect from '@/components/form/RelationSelect';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '單號', dataIndex: 'name', width: 140 },
  { title: '金額', dataIndex: 'amount_total', width: 120 },
  { title: '狀態', dataIndex: 'state', width: 100 },
  { title: '日期', dataIndex: 'date', width: 120 },
];

const formContent = (
  <>
    <Form.Item name="partner_id" label="對象" rules={[{ required: true }]}>
      <RelationSelect apiPath="/api/customers" placeholder="搜尋客戶/供應商..." />
    </Form.Item>
    <Form.Item name="amount_total" label="金額">
      <InputNumber style={{ width: '100%' }} min={0} precision={2} placeholder="輸入金額" />
    </Form.Item>
    <Form.Item name="date" label="日期">
      <DatePicker style={{ width: '100%' }} placeholder="選擇日期" />
    </Form.Item>
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
