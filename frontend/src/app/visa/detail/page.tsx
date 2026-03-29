'use client';
/** 簽證明細 | API: /api/custom/visa-requirements */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '國家', dataIndex: 'country', width: 150 },
  { title: '護照國', dataIndex: 'passport_country', width: 150 },
  { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
  { title: '處理天數', dataIndex: 'processing_days', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="簽證明細"
      columns={columns}
      apiPath="/api/custom/visa-requirements"
      rowKey="id"
      searchPlaceholder="搜尋簽證明細..."
      showExport
    />
  );
}
