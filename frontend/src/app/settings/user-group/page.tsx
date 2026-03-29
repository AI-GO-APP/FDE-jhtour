'use client';
/** 使用者群組 | API: /api/hr/departments */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '部門名稱', dataIndex: 'name', width: 200 },
];

const formContent = (
  <>
    <Form.Item name="name" label="群組名稱" rules={[{ required: true }]}><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="使用者群組"
      columns={columns}
      apiPath="/api/hr/departments"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋使用者群組..."
      showExport
    />
  );
}
