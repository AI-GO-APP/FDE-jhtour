'use client';
/** 同業資料管理 | API: /api/suppliers */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '同業編號', dataIndex: 'code', width: 100 },
  { title: '名稱', dataIndex: 'name', width: 150 },
  { title: 'Email', dataIndex: 'email', width: 180 },
  { title: '電話', dataIndex: 'phone', width: 130 },
  { title: '狀態', dataIndex: 'status', width: 80 },
];

const formContent = (
  <>
    <Form.Item name="name" label="名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="email" label="Email"><Input /></Form.Item>
    <Form.Item name="phone" label="電話"><Input /></Form.Item>
    <Form.Item name="address" label="地址"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="同業資料管理"
      columns={columns}
      apiPath="/api/suppliers"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋同業資料管理..."
      showExport
    />
  );
}
