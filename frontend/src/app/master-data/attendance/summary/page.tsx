'use client';
/** 考勤彙總 | API: /api/hr/attendances */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '編號', dataIndex: 'id', width: 100 },
  { title: '名稱', dataIndex: 'name', width: 200 },
];

export default function Page() {
  return (
    <PageShell
      title="考勤彙總"
      columns={columns}
      apiPath="/api/hr/attendances"
      rowKey="id"
      searchPlaceholder="搜尋考勤彙總..."
      showExport
    />
  );
}
