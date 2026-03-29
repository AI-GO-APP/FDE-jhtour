'use client';
/** 幣別匯率 | API: /api/currencies */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '幣別代碼', dataIndex: 'name', width: 100 },
  { title: '符號', dataIndex: 'symbol', width: 60 },
  { title: '匯率', dataIndex: 'rate', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="name" label="幣別名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="symbol" label="符號"><Input /></Form.Item>
    <Form.Item name="rate" label="匯率"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="幣別匯率"
      columns={columns}
      apiPath="/api/currencies"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋幣別匯率..."
      showExport
    />
  );
}
