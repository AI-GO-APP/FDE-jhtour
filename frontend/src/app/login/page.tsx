'use client';

/**
 * 登入頁面 — Mock 角色選擇
 * 後端接上後替換為實際帳號密碼登入 UI
 */
import React from 'react';
import { Card, Form, Input, Button, Select, Typography, Space, Divider, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, RocketOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_INFO } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

const { Title, Text, Paragraph } = Typography;

// === [API] POST /api/auth/login { email, password } === DB: users === TODO: [替換] ===

const roleOptions = (Object.keys(ROLE_INFO) as Role[]).map((r) => ({
  label: `${ROLE_INFO[r].label} — ${ROLE_INFO[r].description}`,
  value: r,
}));

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (values: { role: Role }) => {
    login(values.role);
    message.success(`歡迎登入！角色：${ROLE_INFO[values.role].label}`);
    router.push(ROLE_INFO[values.role].defaultPath);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card
        style={{ width: 520, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        bodyStyle={{ padding: '40px 48px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <RocketOutlined style={{ fontSize: 48, color: '#667eea' }} />
          <Title level={2} style={{ margin: '16px 0 4px' }}>吉航旅遊 ERP</Title>
          <Text type="secondary">請選擇角色登入系統</Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin} initialValues={{ role: 'ACCT' }}>
          <Divider plain>Demo 快速登入</Divider>

          <Form.Item name="role" label="登入角色" rules={[{ required: true }]}>
            <Select options={roleOptions} size="large" />
          </Form.Item>

          <Row gutter={8} style={{ marginBottom: 24 }}>
            {(Object.keys(ROLE_INFO) as Role[]).map((r) => (
              <Col span={4} key={r}>
                <Button
                  block
                  size="small"
                  style={{ borderColor: ROLE_INFO[r].color, color: ROLE_INFO[r].color, fontSize: 11, padding: '2px 4px' }}
                  onClick={() => {
                    login(r);
                    message.success(`以 ${ROLE_INFO[r].label} 登入`);
                    router.push(ROLE_INFO[r].defaultPath);
                  }}
                >
                  {ROLE_INFO[r].label}
                </Button>
              </Col>
            ))}
          </Row>

          <Divider plain>帳號密碼登入 (待接後端)</Divider>

          {/* === [API] POST /api/auth/login === TODO: [替換] 改為實際帳密驗證 === */}
          <Form.Item label="帳號">
            <Input prefix={<UserOutlined />} placeholder="Email 或員工代碼" size="large" disabled />
          </Form.Item>
          <Form.Item label="密碼">
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" disabled />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            icon={<LoginOutlined />}
            style={{ height: 48, fontSize: 16, borderRadius: 8 }}
          >
            以選擇的角色登入
          </Button>
        </Form>

        <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24, fontSize: 12 }}>
          © 2026 吉航旅遊 ERP v2.0 | 帳號密碼登入需後端 API 支援
        </Paragraph>
      </Card>
    </div>
  );
}
