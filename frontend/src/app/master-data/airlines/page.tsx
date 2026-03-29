'use client';
/** 航空公司 | API: /api/suppliers */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '航空代碼', dataIndex: 'code', width: 100 },
  { title: '航空名稱', dataIndex: 'name', width: 200 },
  { title: 'Email', dataIndex: 'email', width: 180 },
  { title: '電話', dataIndex: 'phone', width: 130 },
];

const formContent = (
  <>
    <Form.Item name="code" label="IATA 代碼" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="name" label="航空公司名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="phone" label="電話"><Input /></Form.Item>
    <Form.Item name="email" label="Email"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="航空公司"
      columns={columns}
      apiPath="/api/suppliers"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋航空公司..."
      showExport
    />
  );
}
