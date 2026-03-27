/**
 * 角色專屬 Dashboard 元件
 * 依登入角色動態載入不同 KPI、資料區塊
 * 各角色的 Mock 資料與 API 對接點
 */
'use client';

import React from 'react';
import { Card, Col, Row, Statistic, Typography, List, Tag, Space, Timeline, Progress, Badge, Alert } from 'antd';
import {
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  GlobalOutlined,
  RiseOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  CrownOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { Role } from '@/lib/rbac';

const { Title, Text } = Typography;

// ===========================
// 共用的狀態色彩映射
// ===========================
const statusColor: Record<string, string> = {
  '確認': 'green', '報名': 'blue', '待付款': 'orange', '完成': 'cyan', '取消': 'red',
  '已售': 'green', '未售': 'default', '退票': 'orange', '作廢': 'red',
  '接件': 'blue', '送件': 'processing', '核准': 'green', '退件': 'red', '還件': 'cyan',
};

// ===========================
// ADMIN Dashboard — 全系統總覽
// ===========================
// === [API] GET /api/dashboard/admin/stats === DB: 聚合查詢 === TODO: [替換] ===
const adminStats = {
  totalPassengers: 12580, totalOrders: 3842, monthlyRevenue: 28560000, activeGroups: 47,
  pendingPayments: 156, ticketStock: 320, visaPending: 23, smsQuota: 4500,
};

export function AdminDashboard() {
  return (
    <>
      {/* KPI 8 卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="旅客總數" value={adminStats.totalPassengers} prefix={<TeamOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="訂單總數" value={adminStats.totalOrders} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月營收" value={adminStats.monthlyRevenue} prefix={<DollarOutlined />} suffix="元" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="進行中團體" value={adminStats.activeGroups} prefix={<GlobalOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待付款單" value={adminStats.pendingPayments} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="機票庫存" value={adminStats.ticketStock} prefix={<FileTextOutlined />} valueStyle={{ color: '#2f54eb' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="證照待辦" value={adminStats.visaPending} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#eb2f96' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="簡訊額度" value={adminStats.smsQuota} prefix={<FileDoneOutlined />} valueStyle={{ color: '#13c2c2' }} /></Card>
        </Col>
      </Row>
      <SharedOrdersAndGroups />
    </>
  );
}

// ===========================
// SALES Dashboard — 業務員銷售 KPI
// ===========================
// === [API] GET /api/dashboard/sales/stats === DB: orders WHERE EMP_CD = current === TODO: [替換] ===
const salesStats = {
  myOrders: 156, monthTarget: 5000000, monthAchieved: 3280000, pendingCollection: 12,
  conversionRate: 68, newCustomers: 23, repeatRate: 45,
};

const salesFollowUp = [
  { name: '王大明', company: '台積電', lastContact: '3 天前', status: '待回覆' },
  { name: '李美華', company: '鴻海集團', lastContact: '5 天前', status: '待報價' },
  { name: '張建國', company: '國泰人壽', lastContact: '1 週前', status: '已報價' },
  { name: '陳玉蘭', company: '中華電信', lastContact: '2 天前', status: '待簽約' },
  { name: '林志玲', company: '聯華電子', lastContact: '今天', status: '追蹤中' },
];

export function SalesDashboard() {
  const achievementRate = Math.round((salesStats.monthAchieved / salesStats.monthTarget) * 100);
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="我的訂單" value={salesStats.myOrders} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="目標達成率" value={achievementRate} suffix="%" prefix={<RiseOutlined />} valueStyle={{ color: achievementRate >= 80 ? '#52c41a' : '#fa8c16' }} />
            <Progress percent={achievementRate} size="small" status={achievementRate >= 100 ? 'success' : 'active'} style={{ marginTop: 8 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待收款筆數" value={salesStats.pendingCollection} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月新客" value={salesStats.newCustomers} prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<Space><TeamOutlined /><span>客戶跟進提醒</span></Space>} size="small">
            <List size="small" dataSource={salesFollowUp} renderItem={(item) => (
              <List.Item extra={<Tag color={item.status === '待簽約' ? 'green' : item.status === '待報價' ? 'orange' : 'blue'}>{item.status}</Tag>}>
                <List.Item.Meta title={item.name} description={`${item.company} · 最後聯繫 ${item.lastContact}`} />
              </List.Item>
            )} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <SharedRecentOrders />
        </Col>
      </Row>
    </>
  );
}

// ===========================
// OP Dashboard — 出團操作 KPI
// ===========================
// === [API] GET /api/dashboard/op/stats === DB: groups, orders WHERE OP_EMP = current === TODO: [替換] ===
const opStats = {
  upcomingGroups: 8, needRoomAssign: 3, needCarAssign: 2, missingDocs: 5,
};

const opTimeline = [
  { date: '2026-04-01', group: 'JP2603-001', name: '日本 東京賞櫻五日遊', pax: 28, leader: '王大衛', status: '已分房' },
  { date: '2026-04-03', group: 'JP2603-006', name: '日本 京都伏見稻荷', pax: 20, leader: '林美惠', status: '待分房' },
  { date: '2026-04-05', group: 'KR2604-002', name: '韓國 首爾美食四日遊', pax: 18, leader: '陳建志', status: '已確認' },
  { date: '2026-04-10', group: 'EU2604-003', name: '歐洲 法瑞義十日遊', pax: 22, leader: '張淑芬', status: '待派車' },
  { date: '2026-04-12', group: 'TH2604-004', name: '泰國 曼谷芭達雅五日', pax: 32, leader: '劉明哲', status: '已確認' },
];

export function OpDashboard() {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="即將出團" value={opStats.upcomingGroups} prefix={<GlobalOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Badge.Ribbon text="待處理" color="orange">
              <Statistic title="待分房團" value={opStats.needRoomAssign} prefix={<ScheduleOutlined />} valueStyle={{ color: '#fa8c16' }} />
            </Badge.Ribbon>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待派車" value={opStats.needCarAssign} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="缺件旅客" value={opStats.missingDocs} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
      </Row>

      <Card title={<Space><CalendarOutlined /><span>近 7 日出團時間線</span></Space>} size="small">
        <Timeline items={opTimeline.map((g) => ({
          color: g.status === '已確認' || g.status === '已分房' ? 'green' : 'orange',
          children: (
            <Row gutter={16} align="middle">
              <Col span={4}><Text strong>{g.date}</Text></Col>
              <Col span={4}><Text code>{g.group}</Text></Col>
              <Col span={8}>{g.name}</Col>
              <Col span={3}>{g.pax} 人 · {g.leader}</Col>
              <Col span={3}><Tag color={g.status.includes('待') ? 'orange' : 'green'}>{g.status}</Tag></Col>
            </Row>
          ),
        }))} />
      </Card>
    </>
  );
}

// ===========================
// TICKET Dashboard — 票務 KPI
// ===========================
// === [API] GET /api/dashboard/ticket/stats === DB: tickets, ticket_details === TODO: [替換] ===
const ticketStats = {
  unsoldTickets: 85, monthImported: 320, monthRefunded: 12, bspBalance: 4580000,
};

const ticketAlerts = [
  { type: 'warning' as const, message: '3 張票即將過期（效期 < 7 天）' },
  { type: 'info' as const, message: 'BSP 對帳週期截止：2026-04-15' },
  { type: 'error' as const, message: '2 筆退票申請待處理' },
  { type: 'success' as const, message: '本月進票作業已完成 320 張' },
];

export function TicketDashboard() {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="未售票庫存" value={ticketStats.unsoldTickets} prefix={<FileTextOutlined />} valueStyle={{ color: '#2f54eb' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月進票" value={ticketStats.monthImported} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月退票" value={ticketStats.monthRefunded} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="BSP 餘額" value={ticketStats.bspBalance} prefix={<BankOutlined />} suffix="元" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
      </Row>

      <Card title={<Space><WarningOutlined /><span>票務提醒</span></Space>} size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          {ticketAlerts.map((a, i) => (
            <Alert key={i} type={a.type} message={a.message} showIcon />
          ))}
        </Space>
      </Card>
    </>
  );
}

// ===========================
// VISA Dashboard — 證照人員 KPI
// ===========================
// === [API] GET /api/dashboard/visa/stats === DB: visa_records === TODO: [替換] ===
const visaStats = {
  pendingCases: 23, overdueCases: 4, todayReturn: 6, monthCompleted: 85,
};

const visaProgress = [
  { paxName: '王小明', type: '日本簽證', status: '送件', days: 3, deadline: '2026-04-05' },
  { paxName: '李美玲', type: '泰國簽證', status: '核准', days: 0, deadline: '2026-04-01' },
  { paxName: '張志豪', type: '護照換發', status: '接件', days: 7, deadline: '2026-04-10' },
  { paxName: '陳雅芳', type: '歐洲申根', status: '送件', days: 5, deadline: '2026-04-08' },
  { paxName: '林建宏', type: '美國簽證', status: '接件', days: 14, deadline: '2026-04-15' },
];

export function VisaDashboard() {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待辦件數" value={visaStats.pendingCases} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#eb2f96' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Badge.Ribbon text="緊急" color="red">
              <Statistic title="已逾期" value={visaStats.overdueCases} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} />
            </Badge.Ribbon>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="今日還件" value={visaStats.todayReturn} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月完成" value={visaStats.monthCompleted} prefix={<FileDoneOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
      </Row>

      <Card title={<Space><ClockCircleOutlined /><span>辦證進度追蹤</span></Space>} size="small">
        <List size="small" dataSource={visaProgress} renderItem={(item) => (
          <List.Item extra={<Text type="secondary">截止 {item.deadline}</Text>}>
            <List.Item.Meta
              title={<Space><Text strong>{item.paxName}</Text><Tag color={statusColor[item.status]}>{item.status}</Tag></Space>}
              description={`${item.type} · 剩餘 ${item.days} 天`}
            />
            <Progress percent={item.status === '核准' ? 100 : item.status === '送件' ? 60 : 20} size="small" style={{ width: 120 }} />
          </List.Item>
        )} />
      </Card>
    </>
  );
}

// ===========================
// ACCT Dashboard — 會計 KPI
// ===========================
// === [API] GET /api/dashboard/acct/stats === DB: receivables, payables === TODO: [替換] ===
const acctStats = {
  totalReceivable: 15680000, totalPayable: 9230000, monthRevenue: 28560000, overdueCount: 8,
};

const acctAlerts = [
  { type: 'error' as const, message: `${acctStats.overdueCount} 筆應收帳款已逾期，總計 NT$ 2,350,000` },
  { type: 'warning' as const, message: '3 筆應付帳款將於 3 日內到期' },
  { type: 'info' as const, message: '電子代轉批次列印：本月尚有 45 筆待列印' },
  { type: 'success' as const, message: 'BSP 對帳已完成（2026-03 期）' },
];

export function AcctDashboard() {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="應收總額" value={acctStats.totalReceivable} prefix={<DollarOutlined />} suffix="元" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="應付總額" value={acctStats.totalPayable} prefix={<DollarOutlined />} suffix="元" valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月營收" value={acctStats.monthRevenue} prefix={<BankOutlined />} suffix="元" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Badge.Ribbon text="需處理" color="red">
              <Statistic title="逾期帳款" value={acctStats.overdueCount} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} suffix="筆" />
            </Badge.Ribbon>
          </Card>
        </Col>
      </Row>

      <Card title={<Space><ExclamationCircleOutlined /><span>帳務到期提醒</span></Space>} size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          {acctAlerts.map((a, i) => (
            <Alert key={i} type={a.type} message={a.message} showIcon />
          ))}
        </Space>
      </Card>
    </>
  );
}

// ===========================
// 共用子元件
// ===========================
// === [API] GET /api/dashboard/recent-orders === TODO: [替換] ===
const mockRecentOrders = [
  { ORD_NO: 'ORD-20260327-001', PAX_CNM: '王小明', PROD_TP: '團體', AMT: 42800, ORD_STUS: '確認' },
  { ORD_NO: 'ORD-20260327-002', PAX_CNM: '李美玲', PROD_TP: '機票', AMT: 12500, ORD_STUS: '報名' },
  { ORD_NO: 'ORD-20260326-003', PAX_CNM: '張志豪', PROD_TP: '旅館', AMT: 8900, ORD_STUS: '待付款' },
  { ORD_NO: 'ORD-20260326-004', PAX_CNM: '陳雅芳', PROD_TP: '團體', AMT: 38600, ORD_STUS: '確認' },
  { ORD_NO: 'ORD-20260325-005', PAX_CNM: '林建宏', PROD_TP: '套旅', AMT: 55200, ORD_STUS: '完成' },
];

function SharedRecentOrders() {
  return (
    <Card title={<Space><RiseOutlined /><span>近期訂單</span></Space>} size="small">
      <List size="small" dataSource={mockRecentOrders} renderItem={(item) => (
        <List.Item extra={<Text strong>NT$ {item.AMT.toLocaleString()}</Text>}>
          <List.Item.Meta
            title={<Space><Text code>{item.ORD_NO}</Text><Tag color={statusColor[item.ORD_STUS]}>{item.ORD_STUS}</Tag></Space>}
            description={`${item.PAX_CNM} — ${item.PROD_TP}`}
          />
        </List.Item>
      )} />
    </Card>
  );
}

// === [API] GET /api/dashboard/upcoming-groups === TODO: [替換] ===
const mockUpcomingGroups = [
  { GRUP_CD: 'JP2603-001', GRUP_NM: '日本 東京賞櫻五日遊', DEP_DT: '2026-04-01', SOLD_PAX: 28, MAX_PAX: 30 },
  { GRUP_CD: 'KR2604-002', GRUP_NM: '韓國 首爾美食四日遊', DEP_DT: '2026-04-05', SOLD_PAX: 18, MAX_PAX: 25 },
  { GRUP_CD: 'EU2604-003', GRUP_NM: '歐洲 法瑞義十日遊', DEP_DT: '2026-04-10', SOLD_PAX: 22, MAX_PAX: 35 },
  { GRUP_CD: 'TH2604-004', GRUP_NM: '泰國 曼谷芭達雅五日', DEP_DT: '2026-04-12', SOLD_PAX: 32, MAX_PAX: 40 },
  { GRUP_CD: 'VN2604-005', GRUP_NM: '越南 下龍灣四日遊', DEP_DT: '2026-04-15', SOLD_PAX: 12, MAX_PAX: 20 },
];

function SharedOrdersAndGroups() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}><SharedRecentOrders /></Col>
      <Col xs={24} lg={12}>
        <Card title={<Space><CalendarOutlined /><span>即將出團</span></Space>} size="small">
          <Timeline items={mockUpcomingGroups.map((g) => ({
            color: g.SOLD_PAX >= g.MAX_PAX ? 'red' : g.SOLD_PAX >= g.MAX_PAX * 0.8 ? 'orange' : 'green',
            children: (
              <div>
                <Space><Text strong>{g.DEP_DT}</Text><Text code>{g.GRUP_CD}</Text></Space>
                <div>{g.GRUP_NM}</div>
                <Text type="secondary">已報 {g.SOLD_PAX} / {g.MAX_PAX} 位</Text>
              </div>
            ),
          }))} />
        </Card>
      </Col>
    </Row>
  );
}

// ===========================
// 角色 Dashboard 總調度器
// ===========================
/** 根據角色回傳對應的 Dashboard 元件 */
export function RoleDashboard({ role }: { role: Role }) {
  const titleMap: Record<Role, { icon: React.ReactNode; text: string }> = {
    ADMIN:  { icon: <CrownOutlined />, text: '系統總覽' },
    SALES:  { icon: <ShoppingCartOutlined />, text: '銷售業績' },
    OP:     { icon: <ScheduleOutlined />, text: '出團操作中心' },
    TICKET: { icon: <FileTextOutlined />, text: '票務工作台' },
    VISA:   { icon: <SafetyCertificateOutlined />, text: '證照辦理中心' },
    ACCT:   { icon: <DollarOutlined />, text: '帳務管理中心' },
  };

  const { icon, text } = titleMap[role];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        {icon}
        <span style={{ marginLeft: 8 }}>{text}</span>
      </Title>
      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'SALES' && <SalesDashboard />}
      {role === 'OP' && <OpDashboard />}
      {role === 'TICKET' && <TicketDashboard />}
      {role === 'VISA' && <VisaDashboard />}
      {role === 'ACCT' && <AcctDashboard />}
    </div>
  );
}
