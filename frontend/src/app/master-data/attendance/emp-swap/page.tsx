'use client';
/** A33. 業務員替換作業 — 出勤子路由 */
import React from 'react';
import { Typography, Card, Form, Select, Button, Table, Alert, message, Space, Tag } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/employees?stus=在職 === DB: employees WHERE EMP_STUS='在職' ===
// TODO: [替換] 改為實際 API
const empOptions = ['劉俊宏 (E001)','陳怡君 (E002)','林志明 (E003)','張雅婷 (E004)','王建民 (E005)'].map((v,i)=>({label:v,value:`E${String(i+1).padStart(3,'0')}`}));

// === [API] POST /api/employees/swap === DB: UPDATE orders, groups, passengers SET EMP_CD=:new WHERE EMP_CD=:old ===
// TODO: [替換] 改為實際 API，需批次更新多張表的業務員欄位

const mockAffected = Array.from({length:5},(_,i)=>({
  key:String(i), table:['orders','passengers','groups','ticket_details','visa_records'][i],
  tableName:['訂單','旅客','團體','機票','證照'][i], count:[15,42,3,8,6][i],
}));

export default function EmpSwapPage() {
  return (
    <div>
      <Title level={4}>業務員替換作業</Title>
      <Alert type="info" message="此功能會將指定業務員負責的所有資料（訂單、旅客、團體等）批次轉移至新業務員" showIcon style={{marginBottom:16}} />
      <Card>
        <Form layout="inline" onFinish={()=>message.success('替換完成 (Mock)')}>
          <Form.Item name="from" label="原業務員" rules={[{required:true}]}>
            <Select options={empOptions} style={{width:200}} placeholder="選擇原業務員" />
          </Form.Item>
          <Form.Item label="">
            <SwapOutlined style={{fontSize:20,color:'#1677ff'}} />
          </Form.Item>
          <Form.Item name="to" label="新業務員" rules={[{required:true}]}>
            <Select options={empOptions} style={{width:200}} placeholder="選擇新業務員" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SwapOutlined />}>執行替換</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="影響範圍預覽" style={{marginTop:16}} size="small">
        <Table
          dataSource={mockAffected}
          columns={[
            { title: '資料表', dataIndex: 'tableName', width: 100 },
            { title: 'DB Table', dataIndex: 'table', width: 150 },
            { title: '影響筆數', dataIndex: 'count', width: 100, render: (v: number) => <Tag color={v>10?'orange':'green'}>{v} 筆</Tag> },
          ]}
          rowKey="key" size="small" bordered pagination={false}
        />
      </Card>
    </div>
  );
}
