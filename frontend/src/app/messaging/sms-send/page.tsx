'use client';
/** 發送簡訊 | API: /api/announcements */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '標題', dataIndex: 'title', width: 200 },
];

export default function Page() {
  return (
    <PageShell
      title="發送簡訊"
      columns={columns}
      apiPath="/api/announcements"
      rowKey="id"
      searchPlaceholder="搜尋發送簡訊..."
      showExport
    />
  );
}
