'use client';
/** A2. 同業資料管理 | 來源: L_agt.asp | DB: agents */
import React from 'react';
import { Form, Input, Select, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockAgents } from '@/mock/master-data';
import type { Agent } from '@/types';

const columns: ColumnsType<Agent> = [
  { title: '同業編號', dataIndex: 'AGT_CD', width: 100, fixed: 'left' },
  { title: '簡稱', dataIndex: 'AGT_SNM', width: 80 },
  { title: '全名', dataIndex: 'AGT_NM', width: 150 },
  { title: '統編', dataIndex: 'UNI_NO', width: 100 },
  { title: '等級', dataIndex: 'AMRNK', width: 60, render: (v: string) => <Tag color={v === 'A' ? 'gold' : v === 'B' ? 'blue' : 'default'}>{v}</Tag> },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },
  { title: '電話', dataIndex: 'TEL', width: 130 },
  { title: '業務員', dataIndex: 'EMP_CD', width: 80 },
  { title: '區域', dataIndex: 'AREA_FG', width: 80 },
  { title: '狀態', dataIndex: 'STUS_CD', width: 80, render: (v: string) => <Tag color="green">{v}</Tag> },
  { title: '團體', dataIndex: 'GRP_FG', width: 60, render: (v: boolean) => v ? '✓' : '' },
  { title: '票務', dataIndex: 'TKT_FG', width: 60, render: (v: boolean) => v ? '✓' : '' },
];

const formContent = (
  <>
    {/* === [API] POST/PUT /api/agents === DB: INSERT/UPDATE agents === */}
    <Form.Item name="AGT_NM" label="全名" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="AGT_SNM" label="簡稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="UNI_NO" label="統一編號"><Input /></Form.Item>
    <Form.Item name="AMRNK" label="價格等級"><Select options={[{ label: 'A', value: 'A' },{ label: 'B', value: 'B' },{ label: 'C', value: 'C' }]} /></Form.Item>
    <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
    <Form.Item name="TEL" label="電話"><Input /></Form.Item>
    <Form.Item name="EMAIL" label="Email"><Input /></Form.Item>
    <Form.Item name="ADDR" label="地址"><Input.TextArea rows={2} /></Form.Item>
  </>
);

export default function AgentsPage() {
  return <PageShell<Agent> title="同業資料管理" columns={columns} dataSource={mockAgents as unknown as Agent[]} rowKey="AGT_CD" formContent={formContent} searchPlaceholder="搜尋同業名稱、統編..." showExport />;
}
