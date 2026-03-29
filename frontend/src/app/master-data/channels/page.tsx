'use client';
/** 通路類別 | API: /api/product-categories */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '類別編號', dataIndex: 'code', width: 100 },
  { title: '通路名稱', dataIndex: 'name', width: 200 },
];

const formContent = (
  <>
    <Form.Item name="code" label="類別編號" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="name" label="通路名稱" rules={[{ required: true }]}><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="通路類別"
      columns={columns}
      apiPath="/api/product-categories"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋通路類別..."
      showExport
    />
  );
}
