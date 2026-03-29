'use client';
/** 團體銷售控管 | API: /api/custom/departure-schedules */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '團號', dataIndex: 'group_code', width: 140 },
  { title: '出發日', dataIndex: 'departure_date', width: 110 },
  { title: '報名', dataIndex: 'current_pax', width: 80 },
  { title: '上限', dataIndex: 'max_pax', width: 80 },
  { title: '狀態', dataIndex: 'status', width: 90 },
];

export default function Page() {
  return (
    <PageShell
      title="團體銷售控管"
      columns={columns}
      apiPath="/api/custom/departure-schedules"
      rowKey="id"
      searchPlaceholder="搜尋團體銷售控管..."
      showExport
    />
  );
}
