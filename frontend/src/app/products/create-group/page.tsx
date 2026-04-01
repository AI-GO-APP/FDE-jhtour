'use client';
/** 開團作業 | API: /api/custom/departure-schedules */
import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '團號', dataIndex: 'group_code', width: 140 },
  { title: '出發日', dataIndex: 'departure_date', width: 110 },
  { title: '回程日', dataIndex: 'return_date', width: 110 },
  { title: '售價', dataIndex: 'price', width: 100 },
  { title: '報名', dataIndex: 'current_pax', width: 80 },
  { title: '上限', dataIndex: 'max_pax', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 90 },
];

const formContent = (
  <>
    <Form.Item name="group_code" label="團號" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="departure_date" label="出發日" rules={[{ required: true }]}>
      <DatePicker style={{ width: '100%' }} placeholder="選擇出發日" />
    </Form.Item>
    <Form.Item name="return_date" label="回程日">
      <DatePicker style={{ width: '100%' }} placeholder="選擇回程日" />
    </Form.Item>
    <Form.Item name="min_pax" label="最低成團">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="最低人數" />
    </Form.Item>
    <Form.Item name="max_pax" label="上限人數">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="上限人數" />
    </Form.Item>
    <Form.Item name="price" label="售價">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="輸入售價" addonAfter="元" />
    </Form.Item>
    <Form.Item name="status" label="狀態">
      <Select placeholder="選擇狀態" options={[
        { label: '規劃中', value: 'planning' },
        { label: '已開放', value: 'open' },
        { label: '已成團', value: 'confirmed' },
        { label: '已取消', value: 'cancelled' },
      ]} />
    </Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="開團作業"
      columns={columns}
      apiPath="/api/custom/departure-schedules"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋開團作業..."
      showExport
    />
  );
}
