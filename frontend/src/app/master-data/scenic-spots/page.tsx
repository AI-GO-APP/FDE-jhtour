'use client';
/** 旅遊景點 | API: /api/suppliers */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '編號', dataIndex: 'code', width: 100 },
  { title: '景點名稱', dataIndex: 'name', width: 200 },
  { title: '電話', dataIndex: 'phone', width: 130 },
];

const formContent = (
  <>
    <Form.Item name="name" label="景點名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="phone" label="電話"><Input /></Form.Item>
    <Form.Item name="address" label="地址"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="旅遊景點"
      columns={columns}
      apiPath="/api/suppliers"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋旅遊景點..."
      showExport
    />
  );
}
