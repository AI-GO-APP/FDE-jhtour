'use client';
/** 其他產品 | API: /api/products */
import React from 'react';

import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '產品名稱', dataIndex: 'name', width: 200 },
  { title: '類型', dataIndex: 'product_type', width: 100 },
];

export default function Page() {
  return (
    <PageShell
      title="其他產品"
      columns={columns}
      apiPath="/api/products"
      rowKey="id"
      searchPlaceholder="搜尋其他產品..."
      showExport
    />
  );
}
