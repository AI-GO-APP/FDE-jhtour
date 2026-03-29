'use client';
/** 員工使用者管理 | API: /api/hr */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '員工編號', dataIndex: 'code', width: 100 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: 'Email', dataIndex: 'work_email', width: 180 },
];

const formContent = (
  <>
    <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="work_email" label="Email"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="員工使用者管理"
      columns={columns}
      apiPath="/api/hr"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋員工使用者管理..."
      showExport
    />
  );
}
