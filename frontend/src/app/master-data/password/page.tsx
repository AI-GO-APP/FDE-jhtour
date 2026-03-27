'use client';
/** A29. 個人密碼修改 | L_myinfo.asp */
import React from 'react'; import { Typography, Card, Form, Input, Button, message } from 'antd'; import { LockOutlined } from '@ant-design/icons';
const { Title } = Typography;
export default function Page() {
  return (<div><Title level={4}>個人密碼修改</Title><Card style={{maxWidth:500}}>
    {/* === [API] PUT /api/users/password === DB: UPDATE users SET password === TODO: [替換] === */}
    <Form layout="vertical" onFinish={()=>message.success('密碼修改成功 (Mock)')}>
      <Form.Item name="old" label="舊密碼" rules={[{required:true}]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
      <Form.Item name="new" label="新密碼" rules={[{required:true}]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
      <Form.Item name="confirm" label="確認新密碼" rules={[{required:true}]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
      <Button type="primary" htmlType="submit">更新密碼</Button>
    </Form></Card></div>);
}
