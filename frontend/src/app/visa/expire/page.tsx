'use client';
/** 效期管理 | API: /api/custom/visa-requirements */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '國家', dataIndex: 'country', width: 150 },
  { title: '護照國', dataIndex: 'passport_country', width: 150 },
  { title: '處理天數', dataIndex: 'processing_days', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="效期管理"
      columns={columns}
      apiPath="/api/custom/visa-requirements"
      rowKey="id"
      searchPlaceholder="搜尋效期管理..."
      showExport
    />
  );
}
