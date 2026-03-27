'use client';
/** ED卡/海關單 | L_edcard.asp | DB: ed_cards */
import React from 'react';
import { Typography, Table, Button, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/visa/ed-card === DB: ed_cards === TODO: [替換] 改為實際 API ===
const mockData = Array.from({length:10},(_,i)=>({ key:String(i+1), id:'GRU' + String(i+1).padStart(4,'0'), name:'ED卡/海關單項目' + (i+1), status:i%3===0?'停用':'啟用', date:'2026-03-' + String(20+i).padStart(2,'0') }));
const columns = [
  { title: '編號', dataIndex: 'id', width: 120 },
  { title: '名稱', dataIndex: 'name', width: 200 },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '狀態', dataIndex: 'status', width: 80, render: (v:string) => <Tag color={v==='啟用'?'green':'red'}>{v}</Tag> },
  { title: '操作', key: 'action', width: 120, render: () => <Space size="small"><Button type="text" size="small" icon={<EditOutlined />} /><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Space> },
];

export default function Page() {
  return (<div>
    <div className="table-toolbar"><Title level={4} style={{margin:0}}>ED卡/海關單</Title>
    <Button type="primary" icon={<PlusOutlined />} onClick={()=>message.info('新增功能 (待接後端)')}>新增</Button></div>
    {/* === [API] POST /api/visa/ed-card === DB: INSERT INTO ed_cards === TODO: [替換] === */}
    {/* === [API] PUT /api/visa/ed-card/:id === DB: UPDATE ed_cards SET ... === TODO: [替換] === */}
    {/* === [API] DELETE /api/visa/ed-card/:id === DB: DELETE FROM ed_cards WHERE GRUP_CD=:id === TODO: [替換] === */}
    <Table dataSource={mockData} columns={columns} rowKey="key" size="middle" bordered
      pagination={{ defaultPageSize:20, showSizeChanger:true, showTotal:(t:number,r:number[])=>'第 ' + r[0] + '~' + r[1] + ' 筆 / 共 ' + t + ' 筆' }} />
  </div>);
}