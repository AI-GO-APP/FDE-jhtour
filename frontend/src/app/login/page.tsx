'use client';

/**
 * 登入頁面
 * 支援兩種登入方式：
 * 1. AI GO Platform Auth（OTC 流程）— 正式登入
 * 2. Demo 角色選擇 — 開發測試用
 */
import React, { useState } from 'react';
import { Card, Button, Select, Typography, Space, Divider, message, Row, Col, Alert } from 'antd';
import { LoginOutlined, RocketOutlined, CloudOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_INFO } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

const { Title, Text, Paragraph } = Typography;

const roleOptions = (Object.keys(ROLE_INFO) as Role[]).map((r) => ({
  label: `${ROLE_INFO[r].label} — ${ROLE_INFO[r].description}`,
  value: r,
}));

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  /** AI GO OTC 登入 — 跳轉到 AI GO 主站 */
  const handleAigoLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST' });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        message.error('無法取得登入 URL');
      }
    } catch {
      message.error('登入服務連線失敗');
    } finally {
      setLoading(false);
    }
  };

  /** Demo 角色快速登入 */
  const handleDemoLogin = (role: Role) => {
    login(role);
    message.success(`歡迎登入！角色：${ROLE_INFO[role].label}`);
    router.push(ROLE_INFO[role].defaultPath);
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
        styles={{ body: { padding: '40px 48px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <RocketOutlined style={{ fontSize: 48, color: '#667eea' }} />
          <Title level={2} style={{ margin: '16px 0 4px' }}>吉航旅遊 ERP</Title>
          <Text type="secondary">企業資源規劃系統 v2.0</Text>
        </div>

        {/* === 正式登入：AI GO OTC === */}
        <Button
          type="primary"
          size="large"
          block
          icon={<CloudOutlined />}
          loading={loading}
          onClick={handleAigoLogin}
          style={{
            height: 52,
            fontSize: 16,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          }}
        >
          透過 AI GO 平台登入
        </Button>

        <Alert
          type="info"
          showIcon
          message="點擊上方按鈕後將跳轉至 AI GO 平台進行身份認證"
          style={{ marginTop: 16, borderRadius: 8 }}
        />

        <Divider plain style={{ margin: '32px 0 16px' }}>
          <Space>
            <UserSwitchOutlined />
            <span>Demo 快速登入</span>
          </Space>
        </Divider>

        <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
          {(Object.keys(ROLE_INFO) as Role[]).map((r) => (
            <Col span={4} key={r}>
              <Button
                block
                size="small"
                style={{
                  borderColor: ROLE_INFO[r].color,
                  color: ROLE_INFO[r].color,
                  fontSize: 11,
                  padding: '2px 4px',
                }}
                onClick={() => handleDemoLogin(r)}
              >
                {ROLE_INFO[r].label}
              </Button>
            </Col>
          ))}
        </Row>

        <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24, fontSize: 12 }}>
          © 2026 吉航旅遊 ERP v2.0 — Powered by AI GO
        </Paragraph>
      </Card>
    </div>
  );
}
