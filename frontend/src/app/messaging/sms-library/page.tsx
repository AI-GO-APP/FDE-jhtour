'use client';
/** 簡訊詞庫設定 | L_sms_library_list.asp | DB: sms_templates */
import React from 'react';
import { Typography, Card, Form, Input, Switch, InputNumber, Button, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
const { Title } = Typography;
export default function Page() {
  return (<div><Title level={4}>簡訊詞庫設定</Title><Card>
    {/* === [API] GET/PUT /api/settings/sms-library === DB: sms_templates === TODO: [替換] === */}
    <Form layout="vertical" onFinish={()=>message.success('設定已儲存 (Mock)')}>
      <Form.Item label="設定項目 1"><Input defaultValue="預設值" /></Form.Item>
      <Form.Item label="設定項目 2"><Switch defaultChecked /></Form.Item>
      <Form.Item label="數值設定"><InputNumber defaultValue={8} style={{width:'100%'}} /></Form.Item>
      <Divider />
      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>儲存設定</Button>
    </Form></Card></div>);
}