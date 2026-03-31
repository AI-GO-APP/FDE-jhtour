'use client';

/**
 * 登入頁面
 *
 * 正式登入：AI GO Platform Auth（OTC 流程）
 * Demo 登入：僅在 development 環境下顯示，用於本地開發測試
 */
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider, message, Row, Col, Alert } from 'antd';
import { RocketOutlined, CloudOutlined, UserSwitchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_INFO } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

const { Title, Text, Paragraph } = Typography;

/** 是否為開發環境 */
const IS_DEV = process.env.NODE_ENV === 'development';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, loginWithAigo, loginDemo } = useAuth();
  const [loading, setLoading] = useState(false);

  // 已登入時自動重導至首頁
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading, router]);

  /** AI GO OTC 登入 — 跳轉到 AI GO 主站 */
  const handleAigoLogin = async () => {
    setLoading(true);
    try {
      await loginWithAigo();
    } catch {
      message.error('登入服務連線失敗');
    } finally {
      setLoading(false);
    }
  };

  /** Demo 角色快速登入 */
  const handleDemoLogin = (role: Role) => {
    loginDemo(role);
    message.success(`歡迎登入！角色：${ROLE_INFO[role].label}`);
    router.push(ROLE_INFO[role].defaultPath);
  };

  // 載入中或已登入，不要顯示登入頁
  if (isLoading || isLoggedIn) {
    return null;
  }

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
          使用 AI GO 帳號登入
        </Button>

        <Alert
          type="info"
          showIcon
          message="將跳轉至 AI GO 平台進行授權驗證"
          style={{ marginTop: 16, borderRadius: 8 }}
        />

        {/* === Demo 快速登入 — 僅開發環境 === */}
        {IS_DEV && (
          <>
            <Divider plain style={{ margin: '32px 0 16px' }}>
              <Space>
                <UserSwitchOutlined />
                <span>Demo 快速登入（開發模式）</span>
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

            <Alert
              type="warning"
              showIcon
              message="Demo 模式僅供本地開發使用，正式環境將不會顯示此區塊"
              style={{ borderRadius: 8, fontSize: 12 }}
            />
          </>
        )}

        <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24, fontSize: 12 }}>
          © 2026 吉航旅遊 ERP v2.0 — Powered by AI GO
        </Paragraph>
      </Card>
    </div>
  );
}
