'use client';

/**
 * Auth Guard — 頁面授權守衛
 *
 * 包裝在需要保護的頁面外層，未登入使用者自動重導至 /login。
 * 載入中時顯示全頁 Loading（避免畫面閃爍）。
 */
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Spin, Result, Button } from 'antd';
import { LoadingOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // 載入中：顯示全頁 Spinner（避免未登入閃爍）
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f6fa',
      }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} tip="驗證登入狀態…" size="large">
          <div style={{ padding: '60px' }} />
        </Spin>
      </div>
    );
  }

  // 未登入：顯示引導畫面
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Result
          icon={<LockOutlined style={{ color: '#fff' }} />}
          title={<span style={{ color: '#fff', fontSize: 24 }}>需要登入</span>}
          subTitle={<span style={{ color: 'rgba(255,255,255,0.8)' }}>請先透過 AI GO 平台登入後使用吉航旅遊 ERP 系統</span>}
          style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: '48px 40px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            maxWidth: 480,
          }}
          extra={
            <Button
              type="primary"
              size="large"
              icon={<LockOutlined />}
              onClick={() => router.push('/login')}
              style={{
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                background: '#fff',
                color: '#764ba2',
                border: 'none',
              }}
            >
              前往登入頁面
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
