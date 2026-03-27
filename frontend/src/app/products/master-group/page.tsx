'use client';
/** 基本團型管理 | L_mgroup.asp | DB: master_groups */
import React from 'react';
import { Typography, Table, Button, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/products/master-group === DB: master_groups === TODO: [替換] 改為實際 API ===
const mockData = Array.from({length:10},(_,i)=>({ key:String(i+1), id:'MGR' + String(i+1).padStart(4,'0'), name:'基本團型管理項目' + (i+1), status:i%3===0?'停用':'啟用', date:'2026-03-' + String(20+i).padStart(2,'0') }));
const columns = [
  { title: '編號', dataIndex: 'id', width: 120 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '狀態', dataIndex: 'status', width: 80, render: (v:string) => <Tag color={v==='啟用'?'green':'red'}>{v}</Tag> },
  { title: '操作', key: 'action', width: 120, render: () => <Space size="small"><Button type="text" size="small" icon={<EditOutlined />} /><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Space> },
];

export default function Page() {
  return (<div>
    <div className="table-toolbar"><Title level={4} style={{margin:0}}>基本團型管理</Title>
    <Button type="primary" icon={<PlusOutlined />} onClick={()=>message.info('新增功能 (待接後端)')}>新增</Button></div>
    {/* === [API] POST /api/products/master-group === DB: INSERT INTO master_groups === TODO: [替換] === */}
    {/* === [API] PUT /api/products/master-group/:id === DB: UPDATE master_groups SET ... === TODO: [替換] === */}
    {/* === [API] DELETE /api/products/master-group/:id === DB: DELETE FROM master_groups WHERE MGRP_CD=:id === TODO: [替換] === */}
    <Table dataSource={mockData} columns={columns} rowKey="key" size="middle" bordered
      pagination={{ defaultPageSize:20, showSizeChanger:true, showTotal:(t:number,r:number[])=>'第 ' + r[0] + '~' + r[1] + ' 筆 / 共 ' + t + ' 筆' }} />
  </div>);
}