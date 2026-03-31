'use client';

/**
 * Auth Callback 前端頁面
 *
 * AI GO 重導流程：
 * 1. 使用者在 AI GO 點「前往應用」
 * 2. AI GO 重導至 /api/auth/callback?code=xxx（由 API Route 處理 exchange + cookie 設定）
 * 3. API Route 成功後重導至 /（首頁）
 *
 * 此頁面僅作為 fallback：當使用者直接訪問 /auth/callback 時顯示提示。
 */
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Spin, Result, Button } from 'antd';
import { LoadingOutlined, WarningOutlined, CloudOutlined } from '@ant-design/icons';

/** 載入中畫面 */
function CallbackLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        maxWidth: 420,
        width: '100%',
      }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#667eea' }} spin />} />
        <h2 style={{ marginTop: 24, color: '#333', fontSize: 20 }}>正在登入...</h2>
        <p style={{ color: '#888', fontSize: 14 }}>正在與 AI GO 交換憑證，請稍候。</p>
      </div>
    </div>
  );
}

/** 實際處理 callback 邏輯的元件 */
function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'no-code'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      // 無 code 參數 — 使用者可能直接訪問此頁面
      setStatus('no-code');
      return;
    }

    // 有 code：重導至 API Route 進行 exchange
    // 正常流程中，AI GO 直接重導到 /api/auth/callback?code=xxx
    // 此處為備用路徑
    window.location.href = `/api/auth/callback?code=${encodeURIComponent(code)}`;
  }, [searchParams, router]);

  if (status === 'loading') {
    return <CallbackLoading />;
  }

  if (status === 'no-code') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Result
          icon={<WarningOutlined style={{ color: '#faad14' }} />}
          title="無效存取"
          subTitle="此頁面僅供 AI GO 認證回呼使用，請從 AI GO 平台開啟此應用。"
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '48px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxWidth: 480,
          }}
          extra={[
            <Button
              key="login"
              type="primary"
              size="large"
              icon={<CloudOutlined />}
              onClick={() => router.push('/login')}
              style={{
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              前往登入頁面
            </Button>,
          ]}
        />
      </div>
    );
  }

  // error
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Result
        status="error"
        title="登入失敗"
        subTitle={errorMsg || '與 AI GO 交換憑證時發生錯誤，請重試。'}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          maxWidth: 480,
        }}
        extra={[
          <Button
            key="retry"
            type="primary"
            size="large"
            onClick={() => router.push('/login')}
            style={{
              height: 48,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            返回登入頁面
          </Button>,
        ]}
      />
    </div>
  );
}

/** 頁面入口 — 包裹 Suspense Boundary（Next.js 要求 useSearchParams 外層有 Suspense） */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackHandler />
    </Suspense>
  );
}
