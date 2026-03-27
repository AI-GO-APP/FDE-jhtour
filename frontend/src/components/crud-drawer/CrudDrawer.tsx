'use client';

/**
 * 通用 CRUD 側拉面板元件
 * 用於所有新增/編輯操作
 */
import React from 'react';
import { Drawer, Button, Space, Form, Spin } from 'antd';

interface CrudDrawerProps {
  /** 標題 */
  title: string;
  /** 是否開啟 */
  open: boolean;
  /** 關閉回呼 */
  onClose: () => void;
  /** 送出回呼 */
  onSubmit: (values: Record<string, unknown>) => void;
  /** 是否載入中 */
  loading?: boolean;
  /** 寬度 */
  width?: number;
  /** 表單內容 */
  children: React.ReactNode;
  /** 模式 */
  mode?: 'create' | 'edit' | 'view';
}

export default function CrudDrawer({
  title,
  open,
  onClose,
  onSubmit,
  loading = false,
  width = 600,
  children,
  mode = 'create',
}: CrudDrawerProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, unknown>) => {
    onSubmit(values);
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const isViewMode = mode === 'view';

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleClose}
      width={width}
      destroyOnClose
      extra={
        !isViewMode && (
          <Space>
            <Button onClick={handleClose}>取消</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>
              {mode === 'create' ? '新增' : '儲存'}
            </Button>
          </Space>
        )
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={isViewMode}
        >
          {children}
        </Form>
      </Spin>
    </Drawer>
  );
}
