'use client';
/** 旅遊輔助資訊 */
import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '編號', dataIndex: 'id', width: 100 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '狀態', dataIndex: 'status', width: 100 },
  { title: '日期', dataIndex: 'create_date', width: 120 },
];

export default function Page() {
  return (
    <PageShell
      title="旅遊輔助資訊"
      columns={columns}
      dataSource={[]}
      rowKey="id"
      searchPlaceholder="搜尋旅遊輔助資訊..."
    />
  );
}
