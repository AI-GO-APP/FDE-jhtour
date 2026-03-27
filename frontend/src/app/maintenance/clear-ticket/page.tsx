'use client';
/** 清除機票資料 | L_ticket_clear.asp */
import React from 'react';
import { Typography, Card, DatePicker, Button, Form, Input, Alert, Popconfirm, message } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
const { Title } = Typography;
export default function Page() {
  return (<div><Title level={4}>清除機票資料</Title>
    <Alert type="warning" message="此操作將永久刪除資料，請確認後再執行" showIcon icon={<WarningOutlined />} style={{marginBottom:16}} />
    <Card>
    {/* === [API] POST /api/maintenance/clear-ticket === DB: DELETE FROM data_clear WHERE ... === TODO: [替換] === */}
    <Form layout="vertical">
      <Form.Item label="基準日期" rules={[{required:true}]}><DatePicker style={{width:300}} /></Form.Item>
      <Form.Item label="備註"><Input.TextArea rows={3} /></Form.Item>
      <Popconfirm title="確定執行清除？此操作不可復原！" onConfirm={()=>message.success('清除完成 (Mock)')}>
        <Button type="primary" danger icon={<DeleteOutlined />}>執行清除</Button></Popconfirm>
    </Form></Card></div>);
}