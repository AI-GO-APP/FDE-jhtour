'use client';
/** A7. 餐廳管理 | L_rest.asp | DB: restaurants */
import React from 'react';
import { Form, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockRestaurants } from '@/mock/master-data';
import type { Restaurant } from '@/types';
const columns: ColumnsType<Restaurant> = [
  { title: '編號', dataIndex: 'REST_CD', width: 80 },
  { title: '餐廳名稱', dataIndex: 'REST_NM', width: 180 },
  { title: '國家', dataIndex: 'NATN_CD', width: 80 },
  { title: '城市', dataIndex: 'CITY_CD', width: 80 },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },
  { title: '電話', dataIndex: 'TEL', width: 130 },
  { title: '狀態', dataIndex: 'INVALID_FG', width: 80, render: (v: boolean) => <Tag color={v ? 'red' : 'green'}>{v ? '停用' : '啟用'}</Tag> },
];
const formContent = (<>
  {/* === [API] POST/PUT /api/restaurants === DB: INSERT/UPDATE restaurants === */}
  <Form.Item name="REST_NM" label="餐廳名稱" rules={[{ required: true }]}><Input /></Form.Item>
  <Form.Item name="NATN_CD" label="國家代碼"><Input /></Form.Item>
  <Form.Item name="CITY_CD" label="城市代碼"><Input /></Form.Item>
  <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
  <Form.Item name="TEL" label="電話"><Input /></Form.Item>
</>);
export default function Page() { return <PageShell title="餐廳管理" columns={columns} dataSource={mockRestaurants as unknown as Restaurant[]} rowKey="REST_CD" formContent={formContent} />; }
