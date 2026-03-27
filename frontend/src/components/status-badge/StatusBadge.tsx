'use client';

/**
 * 通用狀態標籤元件
 * 自動根據狀態值顯示對應顏色
 */
import React from 'react';
import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
}

export default function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
}
