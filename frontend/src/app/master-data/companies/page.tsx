'use client';
/** 機關行號客戶 | API: /api/customers */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '公司編號', dataIndex: 'code', width: 100 },
  { title: '公司名稱', dataIndex: 'name', width: 200 },
  { title: 'Email', dataIndex: 'email', width: 180 },
  { title: '電話', dataIndex: 'phone', width: 130 },
];

const formContent = (
  <>
    <Form.Item name="name" label="公司名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="code" label="統一編號"><Input /></Form.Item>
    <Form.Item name="phone" label="電話"><Input /></Form.Item>
    <Form.Item name="email" label="Email"><Input /></Form.Item>
    <Form.Item name="address" label="地址"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="機關行號客戶"
      columns={columns}
      apiPath="/api/customers"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋機關行號客戶..."
      showExport
    />
  );
}
