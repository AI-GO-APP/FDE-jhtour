'use client';

/**
 * Dashboard 首頁
 * 替代舊系統的 mainFrame 初始頁面 (N/L_news.asp 公佈欄)
 * Phase 7 再補完整 KPI/圖表，本階段先放基礎骨架
 */
import React from 'react';
import { Card, Col, Row, Statistic, Typography, List, Tag, Space, Timeline } from 'antd';
import {
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  GlobalOutlined,
  RiseOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// === [API] GET /api/dashboard/stats ===
// 回傳: { total_passengers, total_orders, monthly_revenue, active_groups }
// DB: 聚合查詢 passengers, orders, groups
// TODO: [替換] 改為實際 API 呼叫
const mockStats = {
  totalPassengers: 12580,
  totalOrders: 3842,
  monthlyRevenue: 28560000,
  activeGroups: 47,
};

// === [API] GET /api/dashboard/recent-orders ===
// DB: SELECT TOP 5 FROM orders ORDER BY CRT_DT DESC
// TODO: [替換] 改為實際 API 呼叫
const mockRecentOrders = [
  { ORD_NO: 'ORD-20260327-001', PAX_CNM: '王小明', PROD_TP: '團體', AMT: 42800, ORD_STUS: '確認' },
  { ORD_NO: 'ORD-20260327-002', PAX_CNM: '李美玲', PROD_TP: '機票', AMT: 12500, ORD_STUS: '報名' },
  { ORD_NO: 'ORD-20260326-003', PAX_CNM: '張志豪', PROD_TP: '旅館', AMT: 8900, ORD_STUS: '待付款' },
  { ORD_NO: 'ORD-20260326-004', PAX_CNM: '陳雅芳', PROD_TP: '團體', AMT: 38600, ORD_STUS: '確認' },
  { ORD_NO: 'ORD-20260325-005', PAX_CNM: '林建宏', PROD_TP: '套旅', AMT: 55200, ORD_STUS: '完成' },
];

// === [API] GET /api/dashboard/upcoming-groups ===
// DB: SELECT FROM groups WHERE DEP_DT > NOW() ORDER BY DEP_DT LIMIT 5
// TODO: [替換] 改為實際 API 呼叫
const mockUpcomingGroups = [
  { GRUP_CD: 'JP2603-001', GRUP_NM: '日本 東京賞櫻五日遊', DEP_DT: '2026-04-01', SOLD_PAX: 28, MAX_PAX: 30 },
  { GRUP_CD: 'KR2604-002', GRUP_NM: '韓國 首爾美食四日遊', DEP_DT: '2026-04-05', SOLD_PAX: 18, MAX_PAX: 25 },
  { GRUP_CD: 'EU2604-003', GRUP_NM: '歐洲 法瑞義十日遊', DEP_DT: '2026-04-10', SOLD_PAX: 22, MAX_PAX: 35 },
  { GRUP_CD: 'TH2604-004', GRUP_NM: '泰國 曼谷芭達雅五日', DEP_DT: '2026-04-12', SOLD_PAX: 32, MAX_PAX: 40 },
  { GRUP_CD: 'VN2604-005', GRUP_NM: '越南 下龍灣四日遊', DEP_DT: '2026-04-15', SOLD_PAX: 12, MAX_PAX: 20 },
];

const statusColor: Record<string, string> = {
  '確認': 'green',
  '報名': 'blue',
  '待付款': 'orange',
  '完成': 'cyan',
  '取消': 'red',
};

export default function DashboardPage() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <CalendarOutlined style={{ marginRight: 8 }} />
        儀表板總覽
      </Title>

      {/* KPI 卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="旅客總數"
              value={mockStats.totalPassengers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="訂單總數"
              value={mockStats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="本月營收"
              value={mockStats.monthlyRevenue}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="進行中團體"
              value={mockStats.activeGroups}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 下方兩列：近期訂單 + 即將出團 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined />
                <span>近期訂單</span>
              </Space>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={mockRecentOrders}
              renderItem={(item) => (
                <List.Item
                  extra={
                    <Text strong>NT$ {item.AMT.toLocaleString()}</Text>
                  }
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text code>{item.ORD_NO}</Text>
                        <Tag color={statusColor[item.ORD_STUS]}>{item.ORD_STUS}</Tag>
                      </Space>
                    }
                    description={`${item.PAX_CNM} — ${item.PROD_TP}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>即將出團</span>
              </Space>
            }
            size="small"
          >
            <Timeline
              items={mockUpcomingGroups.map((g) => ({
                color: g.SOLD_PAX >= g.MAX_PAX ? 'red' : g.SOLD_PAX >= g.MAX_PAX * 0.8 ? 'orange' : 'green',
                children: (
                  <div>
                    <Space>
                      <Text strong>{g.DEP_DT}</Text>
                      <Text code>{g.GRUP_CD}</Text>
                    </Space>
                    <div>{g.GRUP_NM}</div>
                    <Text type="secondary">
                      已報 {g.SOLD_PAX} / {g.MAX_PAX} 位
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
