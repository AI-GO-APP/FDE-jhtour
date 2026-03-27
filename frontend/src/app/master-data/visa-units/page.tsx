'use client';
/** A6~A12. 供應商群組頁面（辦證單位/餐廳/廠商/輪船/租車/景點/通路）
 *  這些頁面使用相同 PageShell 模式，由路由區分
 *  每個頁面對應不同 DB 表 */
import React from 'react';
import { Form, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockVisaUnits } from '@/mock/master-data';
import type { VisaUnit } from '@/types';
const columns: ColumnsType<VisaUnit> = [
  { title: '代碼', dataIndex: 'APUN_CD', width: 90 },
  { title: '單位名稱', dataIndex: 'APUN_NM', width: 250 },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },
  { title: '電話', dataIndex: 'TEL', width: 130 },
  { title: '地址', dataIndex: 'ADDR', width: 200 },
];
const formContent = (<>
  {/* === [API] POST/PUT /api/visa-units === DB: INSERT/UPDATE visa_units === */}
  <Form.Item name="APUN_NM" label="單位名稱" rules={[{ required: true }]}><Input /></Form.Item>
  <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
  <Form.Item name="TEL" label="電話"><Input /></Form.Item>
  <Form.Item name="ADDR" label="地址"><Input.TextArea rows={2} /></Form.Item>
</>);
export default function Page() { return <PageShell title="辦證單位管理" columns={columns} dataSource={mockVisaUnits as unknown as VisaUnit[]} rowKey="APUN_CD" formContent={formContent} />; }
