'use client';
/** 電子代轉批次開立 | L_etord_o_AL.asp | DB: e_transfer_batch */
import React from 'react';
import { Typography, Table, Button, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/accounting/e-batch === DB: e_transfer_batch === TODO: [替換] 改為實際 API ===
const mockData = Array.from({length:10},(_,i)=>({ key:String(i+1), id:'BAT' + String(i+1).padStart(4,'0'), name:'電子代轉批次開立項目' + (i+1), status:i%3===0?'停用':'啟用', date:'2026-03-' + String(20+i).padStart(2,'0') }));
const columns = [
  { title: '編號', dataIndex: 'id', width: 120 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '狀態', dataIndex: 'status', width: 80, render: (v:string) => <Tag color={v==='啟用'?'green':'red'}>{v}</Tag> },
  { title: '操作', key: 'action', width: 120, render: () => <Space size="small"><Button type="text" size="small" icon={<EditOutlined />} /><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Space> },
];

export default function Page() {
  return (<div>
    <div className="table-toolbar"><Title level={4} style={{margin:0}}>電子代轉批次開立</Title>
    <Button type="primary" icon={<PlusOutlined />} onClick={()=>message.info('新增功能 (待接後端)')}>新增</Button></div>
    {/* === [API] POST /api/accounting/e-batch === DB: INSERT INTO e_transfer_batch === TODO: [替換] === */}
    {/* === [API] PUT /api/accounting/e-batch/:id === DB: UPDATE e_transfer_batch SET ... === TODO: [替換] === */}
    {/* === [API] DELETE /api/accounting/e-batch/:id === DB: DELETE FROM e_transfer_batch WHERE BATCH_ID=:id === TODO: [替換] === */}
    <Table dataSource={mockData} columns={columns} rowKey="key" size="middle" bordered
      pagination={{ defaultPageSize:20, showSizeChanger:true, showTotal:(t:number,r:number[])=>'第 ' + r[0] + '~' + r[1] + ' 筆 / 共 ' + t + ' 筆' }} />
  </div>);
}