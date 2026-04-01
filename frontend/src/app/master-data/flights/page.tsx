'use client';
/** 航班時刻表 | API: /api/custom/airline-contracts */
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空代碼', dataIndex: 'airline_code', width: 100 },
  { title: '航空名稱', dataIndex: 'airline_name', width: 150 },
  { title: '航線', dataIndex: 'route', width: 120 },
  { title: '艙等', dataIndex: 'seat_class', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 80 },
];

const formContent = (
  <>
    <Form.Item name="airline_code" label="航空代碼" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="airline_name" label="航空名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="route" label="航線"><Input /></Form.Item>
    <Form.Item name="seat_class" label="艙等">
      <Select placeholder="選擇艙等" options={[
        { label: '經濟艙', value: 'economy' },
        { label: '商務艙', value: 'business' },
        { label: '頭等艙', value: 'first' },
      ]} />
    </Form.Item>
    <Form.Item name="rate" label="票價">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="輸入票價" />
    </Form.Item>
    <Form.Item name="status" label="狀態">
      <Select placeholder="選擇狀態" options={[
        { label: '有效', value: 'active' },
        { label: '已過期', value: 'expired' },
        { label: '暫停', value: 'suspended' },
      ]} />
    </Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="航班時刻表"
      columns={columns}
      apiPath="/api/custom/airline-contracts"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋航班時刻表..."
      showExport
    />
  );
}
