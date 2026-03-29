'use client';
/** 旅遊資訊 | API: /api/countries */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '國家', dataIndex: 'name', width: 200 },
  { title: '代碼', dataIndex: 'code', width: 80 },
  { title: '電話國碼', dataIndex: 'phone_code', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="旅遊資訊"
      columns={columns}
      apiPath="/api/countries"
      rowKey="id"
      searchPlaceholder="搜尋旅遊資訊..."
      showExport
    />
  );
}
