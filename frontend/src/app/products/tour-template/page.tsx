'use client';
/** 共用基本行程 | API: /api/custom/itinerary-templates */
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '行程名稱', dataIndex: 'name', width: 200 },
  { title: '目的地', dataIndex: 'destination', width: 120 },
  { title: '天數', dataIndex: 'duration_days', width: 80 },
  { title: '分類', dataIndex: 'category', width: 100 },
  { title: '狀態', dataIndex: 'status', width: 80 },
];

const formContent = (
  <>
    <Form.Item name="name" label="行程名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="destination" label="目的地" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="duration_days" label="天數">
      <InputNumber style={{ width: '100%' }} min={1} precision={0} addonAfter="天" />
    </Form.Item>
    <Form.Item name="category" label="分類">
      <Select placeholder="選擇分類" options={[
        { label: '團體旅遊', value: 'group' },
        { label: '自由行', value: 'free' },
        { label: '商務考察', value: 'business' },
        { label: '郵輪', value: 'cruise' },
      ]} />
    </Form.Item>
    <Form.Item name="status" label="狀態">
      <Select placeholder="選擇狀態" options={[
        { label: '啟用', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '草稿', value: 'draft' },
      ]} />
    </Form.Item>
    <Form.Item name="description" label="簡述"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="共用基本行程"
      columns={columns}
      apiPath="/api/custom/itinerary-templates"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋共用基本行程..."
      showExport
    />
  );
}
