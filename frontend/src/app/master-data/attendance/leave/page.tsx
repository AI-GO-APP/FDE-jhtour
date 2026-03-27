'use client';
/** A27a. 差假狀況表 — 出勤子路由（自動導向 Tabs） */
import React from 'react';
import { Table, Typography, Tag, DatePicker, Space, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/attendance/leave === DB: leave_records ===
// TODO: [替換] 改為 await api.get('/attendance/leave', { params: filters })
const mockLeave = Array.from({length:10},(_,i)=>({
  key:String(i), EMP_CD:`E${String(i%5+1).padStart(3,'0')}`,
  EMP_NM:['劉俊宏','陳怡君','林志明','張雅婷','王建民'][i%5],
  LEAV_DT:`2026-03-${String(i+15).padStart(2,'0')}`,
  LEAV_TP:['事假','病假','特休','公假','事假'][i%5],
  LEAV_HRS:[8,4,8,8,4][i%5],
  LEAV_REASON:'個人事由',
  APPROVE_STUS:(['已核准','已核准','待核准','已核准','已核准'] as const)[i%5],
}));

export default function LeavePage() {
  return (
    <div>
      <Title level={4}>差假狀況表</Title>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker />
        <Button type="primary" icon={<SearchOutlined />}>查詢</Button>
      </Space>
      <Table
        dataSource={mockLeave}
        columns={[
          { title: '員工代碼', dataIndex: 'EMP_CD', width: 90 },
          { title: '員工姓名', dataIndex: 'EMP_NM', width: 100 },
          { title: '請假日期', dataIndex: 'LEAV_DT', width: 120 },
          { title: '假別', dataIndex: 'LEAV_TP', width: 80, render: (v: string) => <Tag color={v==='特休'?'green':v==='病假'?'orange':'blue'}>{v}</Tag> },
          { title: '時數', dataIndex: 'LEAV_HRS', width: 60 },
          { title: '事由', dataIndex: 'LEAV_REASON', width: 150 },
          { title: '核准狀態', dataIndex: 'APPROVE_STUS', width: 90, render: (v: string) => <Tag color={v==='已核准'?'green':'orange'}>{v}</Tag> },
        ]}
        rowKey="key" size="middle" bordered
      />
    </div>
  );
}
