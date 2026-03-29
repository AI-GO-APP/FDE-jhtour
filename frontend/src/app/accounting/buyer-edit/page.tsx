'use client';
/** 買受人修改 | API: /api/customers */
import React from 'react';
import { Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '客戶名稱', dataIndex: 'name', width: 200 },
  { title: '類型', dataIndex: 'customer_type', width: 100 },
  { title: '電話', dataIndex: 'phone', width: 130 },
  { title: 'Email', dataIndex: 'email', width: 180 },
];

const formContent = (
  <>
    <Form.Item name="name" label="客戶名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="customer_type" label="類型" rules={[{ required: true }]}>
      <Select placeholder="請選擇">
      <Select.Option value="company">company</Select.Option>
      <Select.Option value="individual">individual</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="phone" label="電話"><Input /></Form.Item>
    <Form.Item name="email" label="Email"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="買受人修改"
      columns={columns}
      apiPath="/api/customers"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋買受人修改..."
      showExport
    />
  );
}
