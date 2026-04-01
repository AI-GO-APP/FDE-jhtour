'use client';
/** 訊息編輯與管理 | API: /api/announcements */
import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '標題', dataIndex: 'name', width: 200 },
  { title: '日期', dataIndex: 'date_start', width: 120 },
  { title: '類型', dataIndex: 'announcement_type', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="name" label="標題" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="description" label="內容"><Input.TextArea rows={2} /></Form.Item>
    <Form.Item name="date_start" label="發佈日期">
      <DatePicker style={{ width: '100%' }} placeholder="選擇發佈日期" />
    </Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="訊息編輯與管理"
      columns={columns}
      apiPath="/api/announcements"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋訊息編輯與管理..."
      showExport
    />
  );
}
