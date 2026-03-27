'use client';
/** A27b. 刷卡狀況表 — 出勤子路由 */
import React from 'react';
import { Table, Typography, Tag, DatePicker, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/attendance/clock === DB: attendance_records ===
// TODO: [替換] 改為 await api.get('/attendance/clock', { params: filters })
const mockClock = Array.from({length:10},(_,i)=>({
  key:String(i), EMP_CD:`E${String(i%5+1).padStart(3,'0')}`,
  EMP_NM:['劉俊宏','陳怡君','林志明','張雅婷','王建民'][i%5],
  WORK_DT:`2026-03-${String(i+18).padStart(2,'0')}`,
  IN_TIME:['08:55','09:02','09:15','08:48','08:59'][i%5],
  OUT_TIME:['18:05','18:10','18:30','17:55','18:01'][i%5],
  LATE_FG:i===2, EARLY_FG:i===3,
  OT_HRS:[0,0,0.5,0,0][i%5],
}));

export default function ClockPage() {
  return (
    <div>
      <Title level={4}>刷卡狀況表</Title>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker />
        <Button type="primary" icon={<SearchOutlined />}>查詢</Button>
      </Space>
      <Table
        dataSource={mockClock}
        columns={[
          { title: '員工代碼', dataIndex: 'EMP_CD', width: 90 },
          { title: '員工姓名', dataIndex: 'EMP_NM', width: 100 },
          { title: '日期', dataIndex: 'WORK_DT', width: 120 },
          { title: '上班打卡', dataIndex: 'IN_TIME', width: 90 },
          { title: '下班打卡', dataIndex: 'OUT_TIME', width: 90 },
          { title: '遲到', dataIndex: 'LATE_FG', width: 60, render: (v: boolean) => v ? <Tag color="red">遲到</Tag> : null },
          { title: '早退', dataIndex: 'EARLY_FG', width: 60, render: (v: boolean) => v ? <Tag color="orange">早退</Tag> : null },
          { title: '加班', dataIndex: 'OT_HRS', width: 60, render: (v: number) => v > 0 ? `${v}h` : '' },
        ]}
        rowKey="key" size="middle" bordered
      />
    </div>
  );
}
