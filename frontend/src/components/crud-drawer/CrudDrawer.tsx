'use client';

/**
 * 通用 CRUD 側拉面板元件
 * 用於所有新增/編輯/檢視操作
 * 支援 initialValues 以在編輯模式下預填資料
 * 自動轉換日期字串為 dayjs 物件（相容 DatePicker）
 */
import React, { useEffect } from 'react';
import { Drawer, Button, Space, Form, Spin } from 'antd';
import dayjs from 'dayjs';

/** 日期字串正則：yyyy-mm-dd 開頭 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}/;

/**
 * 自動正規化 initialValues，防止各類控制項崩潰：
 * 1. 日期字串 → dayjs 物件（DatePicker 相容）
 * 2. Odoo 陣列 [id, "display_name"] → 取出 id 字串（Select/RelationSelect 相容）
 * 3. false/0 → 保留原值不被意外轉換
 */
function normalizeFormValues(values: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(values)) {
    // (1) Odoo FK 陣列格式：[uuid, "Display Name"] → 取 uuid
    if (Array.isArray(val) && val.length === 2 && typeof val[0] === 'string') {
      normalized[key] = val[0];
    }
    // (2) 日期字串 → dayjs
    else if (typeof val === 'string' && DATE_REGEX.test(val)) {
      const d = dayjs(val);
      normalized[key] = d.isValid() ? d : val;
    }
    // (3) 其他值原樣保留
    else {
      normalized[key] = val;
    }
  }
  return normalized;
}

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
  /** 編輯/檢視時的初始值 */
  initialValues?: Record<string, unknown>;
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
  initialValues,
}: CrudDrawerProps) {
  const [form] = Form.useForm();

  // 當 initialValues 或 open 變化時，設定表單值
  useEffect(() => {
    if (open && initialValues && (mode === 'edit' || mode === 'view')) {
      // 自動將日期字串轉為 dayjs，避免 DatePicker 崩潰
      form.setFieldsValue(normalizeFormValues(initialValues));
    }
    if (open && mode === 'create') {
      form.resetFields();
    }
  }, [open, initialValues, mode, form]);

  const handleFinish = (values: Record<string, unknown>) => {
    // 送出前：將 dayjs 物件轉回 ISO 字串，確保 API 接到正確格式
    const serialized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(values)) {
      if (dayjs.isDayjs(val)) {
        serialized[key] = val.format('YYYY-MM-DD');
      } else {
        serialized[key] = val;
      }
    }
    onSubmit(serialized);
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
