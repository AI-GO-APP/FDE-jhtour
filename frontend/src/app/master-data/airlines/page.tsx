'use client';
/** A4. 航空公司 | 來源: L_carr.asp | DB: airlines */
import React from 'react';
import { Form, Input, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockAirlines } from '@/mock/master-data';
import type { Airline } from '@/types';

const columns: ColumnsType<Airline> = [
  { title: '代碼', dataIndex: 'CARR_CD', width: 80 },
  { title: '中文名', dataIndex: 'CARR_CNM', width: 120 },
  { title: '英文名', dataIndex: 'CARR_ENM', width: 180 },
  { title: '航線', dataIndex: 'DMST_FG', width: 80, render: (v: boolean) => <Tag color={v ? 'blue' : 'green'}>{v ? '國內' : '國際'}</Tag> },
  { title: '帳號', dataIndex: 'ACCT_NO', width: 100 },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },
  { title: '電話', dataIndex: 'TEL', width: 130 },
  { title: '狀態', dataIndex: 'INVALID_FG', width: 80, render: (v: boolean) => <Tag color={v ? 'red' : 'green'}>{v ? '停用' : '啟用'}</Tag> },
];

const formContent = (
  <>
    {/* === [API] POST/PUT /api/airlines === DB: INSERT/UPDATE airlines === */}
    <Form.Item name="CARR_CD" label="航空代碼" rules={[{ required: true }]}><Input maxLength={3} /></Form.Item>
    <Form.Item name="CARR_CNM" label="中文名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="CARR_ENM" label="英文名稱"><Input /></Form.Item>
    <Form.Item name="DMST_FG" label="國內航線" valuePropName="checked"><Switch /></Form.Item>
    <Form.Item name="ACCT_NO" label="帳號"><Input /></Form.Item>
    <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
    <Form.Item name="TEL" label="電話"><Input /></Form.Item>
  </>
);

export default function AirlinesPage() {
  return <PageShell<Airline> title="航空公司資料管理" columns={columns} dataSource={mockAirlines as unknown as Airline[]} rowKey="CARR_CD" formContent={formContent} searchPlaceholder="搜尋航空代碼或名稱..." />;
}
