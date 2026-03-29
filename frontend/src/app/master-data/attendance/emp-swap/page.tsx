'use client';
/** 人員調班 | API: /api/hr */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '員工', dataIndex: 'name', width: 200 },
  { title: '職稱', dataIndex: 'job_title', width: 150 },
  { title: '部門', dataIndex: 'department_id', width: 150 },
];

export default function Page() {
  return (
    <PageShell
      title="人員調班"
      columns={columns}
      apiPath="/api/hr"
      rowKey="id"
      searchPlaceholder="搜尋人員調班..."
      showExport
    />
  );
}
