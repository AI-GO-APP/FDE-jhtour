'use client';
/** 公佈欄 | API: /api/announcements */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '標題', dataIndex: 'name', width: 200 },
  { title: '日期', dataIndex: 'date_start', width: 120 },
];

export default function Page() {
  return (
    <PageShell
      title="公佈欄"
      columns={columns}
      apiPath="/api/announcements"
      rowKey="id"
      searchPlaceholder="搜尋公佈欄..."
      showExport
    />
  );
}
