'use client';
/** A5. 國外 Local | L_locl.asp | DB: local_agents */
import React from 'react';
import { Form, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockLocalAgents } from '@/mock/master-data';
import type { LocalAgent } from '@/types';
const columns: ColumnsType<LocalAgent> = [
  { title: '代碼', dataIndex: 'LOCL_CD', width: 90 },
  { title: '名稱', dataIndex: 'LOCL_NM', width: 150 },
  { title: '國家', dataIndex: 'NATN_CD', width: 80 },
  { title: '城市', dataIndex: 'CITY_CD', width: 80 },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 120 },
  { title: '電話', dataIndex: 'TEL', width: 150 },
  { title: 'Email', dataIndex: 'EMAIL', width: 180 },
  { title: '狀態', dataIndex: 'INVALID_FG', width: 80, render: (v: boolean) => <Tag color={v ? 'red' : 'green'}>{v ? '停用' : '啟用'}</Tag> },
];
const formContent = (<>
  {/* === [API] POST/PUT /api/local-agents === DB: INSERT/UPDATE local_agents === */}
  <Form.Item name="LOCL_NM" label="名稱" rules={[{ required: true }]}><Input /></Form.Item>
  <Form.Item name="NATN_CD" label="國家代碼"><Input /></Form.Item>
  <Form.Item name="CITY_CD" label="城市代碼"><Input /></Form.Item>
  <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
  <Form.Item name="TEL" label="電話"><Input /></Form.Item>
  <Form.Item name="EMAIL" label="Email"><Input /></Form.Item>
</>);
export default function Page() { return <PageShell title="國外 Local 資料管理" columns={columns} dataSource={mockLocalAgents as unknown as LocalAgent[]} rowKey="LOCL_CD" formContent={formContent} />; }
