'use client';
/**
 * A1. 旅客資料管理
 * 來源: L_pax.asp | DB: passengers
 */
import React from 'react';
import { Form, Input, Select, DatePicker, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageShell from '@/components/page-shell/PageShell';
import { mockPassengers } from '@/mock/master-data';
import { PAX_STATUS_COLOR, PAX_STATUS_OPTIONS, SEX_OPTIONS } from '@/lib/constants';
import type { Passenger } from '@/types';

const columns: ColumnsType<Passenger> = [
  { title: '旅客編號', dataIndex: 'PAX_CD', width: 100, fixed: 'left' },
  { title: '中文姓名', dataIndex: 'PAX_CNM', width: 100 },
  { title: '英文姓名', dataIndex: 'PAX_ENM', width: 150 },
  { title: '性別', dataIndex: 'SEX_CD', width: 60, render: (v: string) => v === 'M' ? '男' : '女' },
  { title: '生日', dataIndex: 'BRTH_DT', width: 110 },
  { title: '身分證號', dataIndex: 'ID_NO', width: 120 },
  { title: '護照號碼', dataIndex: 'PSP_NO', width: 120 },
  { title: '手機', dataIndex: 'MOBILE', width: 130 },
  { title: 'Email', dataIndex: 'EMAIL', width: 180 },
  { title: '業務員', dataIndex: 'EMP_CD', width: 80 },
  { title: '狀態', dataIndex: 'PAX_STUS', width: 80, render: (v: string) => <Tag color={PAX_STATUS_COLOR[v]}>{v}</Tag> },
  { title: '建檔日', dataIndex: 'CRT_DT', width: 110, render: (v: string) => v?.split('T')[0] },
];

const filterContent = (
  <>
    <Col span={6}><Form.Item name="pax_cd" label="旅客編號"><Input placeholder="P0001" /></Form.Item></Col>
    <Col span={6}><Form.Item name="id_no" label="身分證號"><Input /></Form.Item></Col>
    <Col span={6}><Form.Item name="sex_cd" label="性別"><Select options={SEX_OPTIONS} allowClear placeholder="全部" /></Form.Item></Col>
    <Col span={6}><Form.Item name="pax_stus" label="往來狀態"><Select options={PAX_STATUS_OPTIONS} allowClear placeholder="全部" /></Form.Item></Col>
    <Col span={6}><Form.Item name="brth_dt" label="生日範圍"><DatePicker.RangePicker style={{ width: '100%' }} /></Form.Item></Col>
    <Col span={6}><Form.Item name="natn_cd" label="國籍"><Input placeholder="TW" /></Form.Item></Col>
  </>
);

const formContent = (
  <>
    {/* === [API] POST/PUT /api/passengers === DB: INSERT/UPDATE passengers === */}
    <Form.Item name="PAX_CNM" label="中文姓名" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="PAX_ENM" label="英文姓名" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="SEX_CD" label="性別" rules={[{ required: true }]}><Select options={SEX_OPTIONS} /></Form.Item>
    <Form.Item name="BRTH_DT" label="生日"><DatePicker style={{ width: '100%' }} /></Form.Item>
    <Form.Item name="ID_NO" label="身分證號"><Input /></Form.Item>
    <Form.Item name="PSP_NO" label="護照號碼"><Input /></Form.Item>
    <Form.Item name="MOBILE" label="手機"><Input /></Form.Item>
    <Form.Item name="EMAIL" label="電子郵件"><Input /></Form.Item>
    <Form.Item name="ADDR" label="地址"><Input.TextArea rows={2} /></Form.Item>
    <Form.Item name="PAX_STUS" label="往來狀態"><Select options={PAX_STATUS_OPTIONS} /></Form.Item>
  </>
);

export default function PassengersPage() {
  return (
    <PageShell<Passenger>
      title="旅客資料管理"
      columns={columns}
      dataSource={mockPassengers as unknown as Passenger[]}
      rowKey="PAX_CD"
      filterContent={filterContent}
      formContent={formContent}
      searchPlaceholder="搜尋旅客姓名、編號、證號..."
      showExport
      showPrint
    />
  );
}
