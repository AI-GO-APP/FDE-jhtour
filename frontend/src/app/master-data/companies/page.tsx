'use client';
/** A3. 機關行號客戶 | 來源: L_comp.asp | DB: companies */
import React from 'react';
import { Form, Input, Select, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockCompanies } from '@/mock/master-data';
import type { Company } from '@/types';

const columns: ColumnsType<Company> = [
  { title: '編號', dataIndex: 'COMP_CD', width: 80 },
  { title: '公司名稱', dataIndex: 'COMP_NM', width: 250 },
  { title: '簡稱', dataIndex: 'COMP_SNM', width: 100 },
  { title: '統編', dataIndex: 'UNI_NO', width: 100 },
  { title: '行業別', dataIndex: 'COMP_TP', width: 100 },
  { title: '等級', dataIndex: 'AMRNK', width: 60 },
  { title: '聯絡人', dataIndex: 'CTC_NM', width: 100 },
  { title: '業務員', dataIndex: 'EMP_CD', width: 80 },
];

const formContent = (
  <>
    {/* === [API] POST/PUT /api/companies === DB: INSERT/UPDATE companies === */}
    <Form.Item name="COMP_NM" label="公司名稱" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="COMP_SNM" label="簡稱"><Input /></Form.Item>
    <Form.Item name="UNI_NO" label="統一編號"><Input /></Form.Item>
    <Form.Item name="COMP_TP" label="行業別"><Select options={['資訊業','製造業','金融業','服務業','貿易業'].map(v=>({label:v,value:v}))} /></Form.Item>
    <Form.Item name="CTC_NM" label="聯絡人"><Input /></Form.Item>
    <Form.Item name="TEL" label="電話"><Input /></Form.Item>
  </>
);

export default function CompaniesPage() {
  return <PageShell<Company> title="機關行號客戶管理" columns={columns} dataSource={mockCompanies as unknown as Company[]} rowKey="COMP_CD" formContent={formContent} searchPlaceholder="搜尋公司名稱、統編..." />;
}
