'use client';
/** 證照及辦證文件 | API: /api/custom/visa-requirements */
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import RelationSelect from '@/components/form/RelationSelect';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '前往國家', dataIndex: 'country', width: 120 },
  { title: '護照國籍', dataIndex: 'passport_country', width: 120 },
  { title: '簽證類型', dataIndex: 'visa_type', width: 100 },
  { title: '處理天數', dataIndex: 'processing_days', width: 100 },
  { title: '費用', dataIndex: 'fee', width: 100 },
];

const formContent = (
  <>
    <Form.Item name="country" label="前往國家" rules={[{ required: true }]}>
      <RelationSelect apiPath="/api/countries" placeholder="搜尋國家..." />
    </Form.Item>
    <Form.Item name="passport_country" label="護照國籍">
      <RelationSelect apiPath="/api/countries" placeholder="搜尋國籍..." />
    </Form.Item>
    <Form.Item name="visa_type" label="簽證類型">
      <Select placeholder="選擇簽證類型" options={[
        { label: '觀光簽證', value: 'tourist' },
        { label: '商務簽證', value: 'business' },
        { label: '落地簽', value: 'on_arrival' },
        { label: '電子簽證', value: 'e_visa' },
        { label: '免簽', value: 'visa_free' },
      ]} />
    </Form.Item>
    <Form.Item name="processing_days" label="處理天數">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} addonAfter="天" />
    </Form.Item>
    <Form.Item name="fee" label="費用">
      <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="輸入費用" />
    </Form.Item>
    <Form.Item name="currency" label="幣別">
      <RelationSelect apiPath="/api/currencies" placeholder="搜尋幣別..." />
    </Form.Item>
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
