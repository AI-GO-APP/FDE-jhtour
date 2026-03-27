'use client';
/** A27c. 考勤狀況表 — 出勤子路由 */
import React from 'react';
import { Table, Typography, Tag, DatePicker, Select, Space, Button, Card, Row, Col, Statistic } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
const { Title } = Typography;

// === [API] GET /api/attendance/summary === DB: attendance_summary (聚合查詢) ===
// TODO: [替換] 改為 await api.get('/attendance/summary', { params: { month, dept } })
const mockSummary = Array.from({length:10},(_,i)=>({
  key:String(i), EMP_CD:`E${String(i%5+1).padStart(3,'0')}`,
  EMP_NM:['劉俊宏','陳怡君','林志明','張雅婷','王建民','黃淑芬','吳宗翰','周美華','鄭文凱','蔡佳玲'][i],
  WORK_DAYS:[22,22,21,22,20,22,22,21,22,22][i],
  LATE_CNT:[0,1,3,0,0,0,2,0,1,0][i],
  EARLY_CNT:[0,0,0,1,0,0,0,0,0,0][i],
  LEAVE_DAYS:[0,1,1,0,2,0,0,1,0,0][i],
  OT_HRS:[4,0,8,0,0,2,6,0,0,0][i],
}));

export default function SummaryPage() {
  return (
    <div>
      <Title level={4}>考勤狀況表</Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="本月出勤率" value={96.5} suffix="%" prefix={<CheckCircleOutlined />} valueStyle={{color:'#52c41a'}} /></Card></Col>
        <Col span={6}><Card><Statistic title="遲到次數" value={7} prefix={<ClockCircleOutlined />} valueStyle={{color:'#faad14'}} /></Card></Col>
        <Col span={6}><Card><Statistic title="請假人次" value={5} prefix={<CloseCircleOutlined />} valueStyle={{color:'#ff4d4f'}} /></Card></Col>
        <Col span={6}><Card><Statistic title="加班總時數" value={20} suffix="h" /></Card></Col>
      </Row>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker picker="month" />
        <Select defaultValue="all" options={[{label:'全部門',value:'all'},{label:'業務部',value:'sales'},{label:'OP部',value:'op'},{label:'會計室',value:'acc'}]} style={{width:150}} />
        <Button type="primary" icon={<SearchOutlined />}>查詢</Button>
      </Space>
      <Table
        dataSource={mockSummary}
        columns={[
          { title: '員工代碼', dataIndex: 'EMP_CD', width: 90 },
          { title: '員工姓名', dataIndex: 'EMP_NM', width: 100 },
          { title: '出勤天數', dataIndex: 'WORK_DAYS', width: 90 },
          { title: '遲到次數', dataIndex: 'LATE_CNT', width: 90, render: (v: number) => v > 0 ? <Tag color="orange">{v}</Tag> : 0 },
          { title: '早退次數', dataIndex: 'EARLY_CNT', width: 90, render: (v: number) => v > 0 ? <Tag color="red">{v}</Tag> : 0 },
          { title: '請假天數', dataIndex: 'LEAVE_DAYS', width: 90 },
          { title: '加班時數', dataIndex: 'OT_HRS', width: 90 },
        ]}
        rowKey="key" size="middle" bordered
      />
    </div>
  );
}
