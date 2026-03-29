'use client';
/** 旅客辦證記錄 | API: /api/custom/visa-requirements */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '前往國家', dataIndex: 'country', width: 120 },
  { title: '護照國籍', dataIndex: 'passport_country', width: 120 },
  { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
  { title: '處理天數', dataIndex: 'processing_days', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="旅客辦證記錄"
      columns={columns}
      apiPath="/api/custom/visa-requirements"
      rowKey="id"
      searchPlaceholder="搜尋旅客辦證記錄..."
      showExport
    />
  );
}
