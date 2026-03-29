'use client';
/** 旅館資料管理 | API: /api/custom/hotel-contracts */
import React from 'react';
import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';

const columns: ColumnsType<Record<string, unknown>> = [
  { title: '飯店名稱', dataIndex: 'hotel_name', width: 200 },
  { title: '城市', dataIndex: 'city', width: 100 },
  { title: '國家', dataIndex: 'country', width: 100 },
  { title: '房型', dataIndex: 'room_type', width: 80 },
  { title: '房價', dataIndex: 'rate', width: 100 },
  { title: '狀態', dataIndex: 'status', width: 80 },
];

const formContent = (
  <>
    <Form.Item name="hotel_name" label="飯店名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="city" label="城市"><Input /></Form.Item>
    <Form.Item name="country" label="國家"><Input /></Form.Item>
    <Form.Item name="room_type" label="房型"><Input /></Form.Item>
    <Form.Item name="rate" label="房價"><Input /></Form.Item>
    <Form.Item name="currency" label="幣別"><Input /></Form.Item>
    <Form.Item name="contract_start" label="合約起日"><Input /></Form.Item>
    <Form.Item name="contract_end" label="合約訖日"><Input /></Form.Item>
    <Form.Item name="status" label="狀態"><Input /></Form.Item>
  </>
);

export default function Page() {
  return (
    <PageShell
      title="旅館資料管理"
      columns={columns}
      apiPath="/api/custom/hotel-contracts"
      rowKey="id"
      formContent={formContent}
      searchPlaceholder="搜尋旅館資料管理..."
      showExport
    />
  );
}
