'use client';
/** 證照及辦證文件 | API: /api/custom/visa-requirements */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '前往國家', dataIndex: 'country', width: 120 },
  { title: '護照國籍', dataIndex: 'passport_country', width: 120 },
  { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
  { title: '處理天數', dataIndex: 'processing_days', width: 100 },
  { title: '費用', dataIndex: 'fee', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="country" label="前往國家" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="passport_country" label="護照國籍"><Input /></Form.Item>
    <Form.Item name="visa_type" label="簽證類型"><Input /></Form.Item>
    <Form.Item name="processing_days" label="處理天數"><Input /></Form.Item>
    <Form.Item name="fee" label="費用"><Input /></Form.Item>
    <Form.Item name="currency" label="幣別"><Input /></Form.Item>
    <Form.Item name="documents_required" label="所需文件"><Input.TextArea rows={2} /></Form.Item>
    <Form.Item name="notes" label="備註"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="證照及辦證文件"
      columns={columns}
      apiPath="/api/custom/visa-requirements"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋證照及辦證文件..."
      showExport
    />
  );
}
