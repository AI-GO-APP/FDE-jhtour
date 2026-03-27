'use client';
/** A13. 員工管理 | 來源: L_emp.asp | DB: employees */
import React from 'react';
import { Form, Input, Select, DatePicker, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockEmployees } from '@/mock/master-data';
import { SEX_OPTIONS, EMP_STATUS_OPTIONS } from '@/lib/constants';
import type { Employee } from '@/types';

const columns: ColumnsType<Employee> = [
  { title: '員工編號', dataIndex: 'EMP_CD', width: 90, fixed: 'left' },
  { title: '姓名', dataIndex: 'EMP_NM', width: 100 },
  { title: '英文名', dataIndex: 'EMP_ENM', width: 100 },
  { title: '部門', dataIndex: 'DEPT_CD', width: 100 },
  { title: '職稱', dataIndex: 'TITLE', width: 80 },
  { title: '性別', dataIndex: 'SEX_CD', width: 60, render: (v: string) => v === 'M' ? '男' : '女' },
  { title: '到職日', dataIndex: 'HIRE_DT', width: 110 },
  { title: '手機', dataIndex: 'MOBILE', width: 130 },
  { title: 'Email', dataIndex: 'EMAIL', width: 180 },
  { title: '狀態', dataIndex: 'EMP_STUS', width: 80, render: (v: string) => <Tag color={v === '在職' ? 'green' : v === '留停' ? 'orange' : 'red'}>{v}</Tag> },
];

const formContent = (
  <>
    {/* === [API] POST/PUT /api/employees === DB: INSERT/UPDATE employees === */}
    <Form.Item name="EMP_NM" label="中文姓名" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="EMP_ENM" label="英文姓名"><Input /></Form.Item>
    <Form.Item name="DEPT_CD" label="部門"><Select options={['業務部','OP部','會計室','票務部','證照部','資訊部','行政部'].map(v=>({label:v,value:v}))} /></Form.Item>
    <Form.Item name="TITLE" label="職稱"><Input /></Form.Item>
    <Form.Item name="SEX_CD" label="性別"><Select options={SEX_OPTIONS} /></Form.Item>
    <Form.Item name="HIRE_DT" label="到職日"><DatePicker style={{ width: '100%' }} /></Form.Item>
    <Form.Item name="MOBILE" label="手機"><Input /></Form.Item>
    <Form.Item name="EMAIL" label="電子郵件"><Input /></Form.Item>
    <Form.Item name="EMP_STUS" label="就職狀態"><Select options={EMP_STATUS_OPTIONS} /></Form.Item>
  </>
);

export default function EmployeesPage() {
  return <PageShell<Employee> title="員工管理" columns={columns} dataSource={mockEmployees as unknown as Employee[]} rowKey="EMP_CD" formContent={formContent} searchPlaceholder="搜尋員工姓名、編號..." />;
}
