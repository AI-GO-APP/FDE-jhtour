'use client';
/** A8. 廠商管理 | L_fact.asp | DB: suppliers */
import React from 'react'; import { Form, Input } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockSuppliers } from '@/mock/master-data'; import type { Supplier } from '@/types';
const columns: ColumnsType<Supplier> = [
  { title: '編號', dataIndex: 'FACT_CD', width: 80 },{ title: '名稱', dataIndex: 'FACT_NM', width: 180 },{ title: '簡稱', dataIndex: 'FACT_SNM', width: 100 },{ title: '統編', dataIndex: 'UNI_NO', width: 100 },{ title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },{ title: '電話', dataIndex: 'TEL', width: 130 },{ title: '地址', dataIndex: 'ADDR', width: 200 },
];
const formContent = (<>{/* === [API] POST/PUT /api/suppliers === DB: INSERT/UPDATE suppliers === */}<Form.Item name="FACT_NM" label="廠商名稱" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="FACT_SNM" label="簡稱"><Input /></Form.Item><Form.Item name="UNI_NO" label="統一編號"><Input /></Form.Item><Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item><Form.Item name="TEL" label="電話"><Input /></Form.Item><Form.Item name="ADDR" label="地址"><Input.TextArea rows={2} /></Form.Item></>);
export default function Page() { return <PageShell title="廠商管理" columns={columns} dataSource={mockSuppliers as unknown as Supplier[]} rowKey="FACT_CD" formContent={formContent} />; }
