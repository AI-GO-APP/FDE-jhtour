'use client';
/** 基本團型管理 | API: /api/products */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '產品編號', dataIndex: 'default_code', width: 100 },
  { title: '產品名稱', dataIndex: 'name', width: 200 },
  { title: '售價', dataIndex: 'list_price', width: 100 },
  { title: '類別', dataIndex: 'categ_id', width: 120 },
];

const formContent = (
  <>
    <Form.Item name="name" label="團型名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="default_code" label="編號"><Input /></Form.Item>
    <Form.Item name="list_price" label="售價"><Input /></Form.Item>
    <Form.Item name="description" label="說明"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="基本團型管理"
      columns={columns}
      apiPath="/api/products"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋基本團型管理..."
      showExport
    />
  );
}
