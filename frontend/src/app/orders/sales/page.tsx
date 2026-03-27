'use client';
/** B1. 業務員訂單作業 | L_order.asp | DB: orders */
import React from 'react'; import { Form, Input, Select, DatePicker, Col, Tag } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockOrders } from '@/mock/all-modules'; import { ORDER_STATUS_COLOR, ORDER_STATUS_OPTIONS, PRODUCT_TYPE_OPTIONS } from '@/lib/constants'; import type { Order } from '@/types/orders';
const columns: ColumnsType<Order> = [
  { title: '訂單編號', dataIndex: 'ORD_NO', width: 180, fixed: 'left' },
  { title: '序號', dataIndex: 'OP_SQ', width: 60 },
  { title: '產品', dataIndex: 'PROD_TP', width: 80, render: (v: string) => <Tag>{v}</Tag> },
  { title: '旅客', dataIndex: 'PAX_CD', width: 80 },
  { title: '團號', dataIndex: 'GRUP_CD', width: 130 },
  { title: '出發日', dataIndex: 'DEP_DT', width: 110 },
  { title: '金額', dataIndex: 'AMT', width: 110, render: (v: number) => `NT$ ${v.toLocaleString()}` },
  { title: '業務員', dataIndex: 'EMP_CD', width: 80 },
  { title: 'OP', dataIndex: 'OP_EMP_CD', width: 80 },
  { title: '狀態', dataIndex: 'ORD_STUS', width: 80, render: (v: string) => <Tag color={ORDER_STATUS_COLOR[v]}>{v}</Tag> },
  { title: '建立日', dataIndex: 'CRT_DT', width: 110, render: (v: string) => v?.split('T')[0] },
];
const filterContent = (<>
  <Col span={6}><Form.Item name="prod_tp" label="產品類別"><Select options={PRODUCT_TYPE_OPTIONS} allowClear placeholder="全部" /></Form.Item></Col>
  <Col span={6}><Form.Item name="ord_stus" label="訂單狀態"><Select options={ORDER_STATUS_OPTIONS} allowClear placeholder="全部" /></Form.Item></Col>
  <Col span={6}><Form.Item name="dep_dt" label="出發日期"><DatePicker.RangePicker style={{width:'100%'}} /></Form.Item></Col>
  <Col span={6}><Form.Item name="emp_cd" label="業務員"><Input placeholder="員工代碼" /></Form.Item></Col>
</>);
const formContent = (<>{/* === [API] POST/PUT /api/orders === DB: INSERT/UPDATE orders === */}
  <Form.Item name="PROD_TP" label="產品類別" rules={[{required:true}]}><Select options={PRODUCT_TYPE_OPTIONS} /></Form.Item>
  <Form.Item name="PAX_CD" label="旅客編號"><Input /></Form.Item>
  <Form.Item name="GRUP_CD" label="團號"><Input /></Form.Item>
  <Form.Item name="DEP_DT" label="出發日"><DatePicker style={{width:'100%'}} /></Form.Item>
  <Form.Item name="AMT" label="金額"><Input type="number" /></Form.Item>
  <Form.Item name="ORD_STUS" label="狀態"><Select options={ORDER_STATUS_OPTIONS} /></Form.Item>
</>);
export default function Page() { return <PageShell<Order> title="業務員訂單作業" columns={columns} dataSource={mockOrders as unknown as Order[]} rowKey="ORD_NO" filterContent={filterContent} formContent={formContent} searchPlaceholder="搜尋訂單編號、旅客..." showExport showPrint />; }
