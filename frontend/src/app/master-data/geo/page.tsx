'use client';
/** 洲/國/城市/機場 | API: /api/countries */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '代碼', dataIndex: 'code', width: 80 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '電話區碼', dataIndex: 'phone_code', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="code" label="代碼" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="name" label="名稱" rules={[{ required: true }]}><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="洲/國/城市/機場"
      columns={columns}
      apiPath="/api/countries"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋洲/國/城市/機場..."
      showExport
    />
  );
}
