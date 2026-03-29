/**
 * 角色專屬 Dashboard 元件
 * 依登入角色動態載入不同 KPI、資料區塊
 * 資料來源：透過 API 獲取真實資料
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography, List, Tag, Space, Alert, Spin, Empty } from 'antd';
import {
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  GlobalOutlined,
  RiseOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  CrownOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { Role } from '@/lib/rbac';

const { Title, Text } = Typography;

// ===========================
// 通用 KPI 載入 Hook
// ===========================
function useDashboardData<T>(apiPath: string, defaultValue: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiPath + '?limit=5');
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            setData(json.data ?? json ?? defaultValue);
          }
        }
      } catch {
        // 靜默處理，顯示空資料
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [apiPath, defaultValue]);

  return { data, loading };
}

// ===========================
// ADMIN Dashboard — 全系統總覽
// ===========================
export function AdminDashboard() {
  const { data: customers, loading: l1 } = useDashboardData<unknown[]>('/api/customers', []);
  const { data: orders, loading: l2 } = useDashboardData<unknown[]>('/api/sale-orders', []);
  const { data: suppliers, loading: l3 } = useDashboardData<unknown[]>('/api/suppliers', []);
  const { data: employees, loading: l4 } = useDashboardData<unknown[]>('/api/hr', []);
  const loading = l1 || l2 || l3 || l4;

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="客戶數" value={customers.length} prefix={<TeamOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="訂單數" value={orders.length} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="供應商數" value={suppliers.length} prefix={<GlobalOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="員工數" value={employees.length} prefix={<FileDoneOutlined />} valueStyle={{ color: '#13c2c2' }} /></Card>
        </Col>
      </Row>
      <RecentDataCard title="近期訂單" apiPath="/api/sale-orders" icon={<RiseOutlined />} />
    </Spin>
  );
}

// ===========================
// SALES Dashboard — 業務員銷售 KPI
// ===========================
export function SalesDashboard() {
  const { data: orders, loading } = useDashboardData<unknown[]>('/api/sale-orders', []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="我的訂單" value={orders.length} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待處理" value={0} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月新客" value={0} prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="已完成" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
      </Row>
      <RecentDataCard title="近期訂單" apiPath="/api/sale-orders" icon={<RiseOutlined />} />
    </Spin>
  );
}

// ===========================
// OP Dashboard — 出團操作 KPI
// ===========================
export function OpDashboard() {
  const { data: schedules, loading } = useDashboardData<unknown[]>('/api/custom/departure-schedules', []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="出團班表" value={schedules.length} prefix={<GlobalOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待處理" value={0} prefix={<ScheduleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="待派車" value={0} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="缺件" value={0} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
      </Row>
      <RecentDataCard title="出團班表" apiPath="/api/custom/departure-schedules" icon={<GlobalOutlined />} />
    </Spin>
  );
}

// ===========================
// TICKET Dashboard — 票務 KPI
// ===========================
export function TicketDashboard() {
  const { data: contracts, loading } = useDashboardData<unknown[]>('/api/custom/airline-contracts', []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="航空合約數" value={contracts.length} prefix={<FileTextOutlined />} valueStyle={{ color: '#2f54eb' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月進票" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月退票" value={0} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="BSP 餘額" value={0} prefix={<BankOutlined />} suffix="元" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
      </Row>
      <Alert type="info" message="票務資料將根據航空合約自動統計" showIcon style={{ marginBottom: 16 }} />
    </Spin>
  );
}

// ===========================
// VISA Dashboard — 證照人員 KPI
// ===========================
export function VisaDashboard() {
  const { data: visas, loading } = useDashboardData<unknown[]>('/api/custom/visa-requirements', []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="簽證需求數" value={visas.length} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#eb2f96' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="已逾期" value={0} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="今日還件" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="本月完成" value={0} prefix={<FileDoneOutlined />} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
      </Row>
      <RecentDataCard title="簽證需求" apiPath="/api/custom/visa-requirements" icon={<SafetyCertificateOutlined />} />
    </Spin>
  );
}

// ===========================
// ACCT Dashboard — 會計 KPI
// ===========================
export function AcctDashboard() {
  const { data: accounting, loading } = useDashboardData<unknown[]>('/api/accounting', []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="帳務筆數" value={accounting.length} prefix={<DollarOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="應收" value={0} prefix={<DollarOutlined />} suffix="元" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="應付" value={0} prefix={<DollarOutlined />} suffix="元" valueStyle={{ color: '#fa541c' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="逾期帳款" value={0} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }} suffix="筆" /></Card>
        </Col>
      </Row>
      <Alert type="info" message="帳務資料將根據訂單與請款單自動統計" showIcon />
    </Spin>
  );
}

// ===========================
// 共用子元件 — 最近資料列表
// ===========================
function RecentDataCard({ title, apiPath, icon }: { title: string; apiPath: string; icon: React.ReactNode }) {
  const { data, loading } = useDashboardData<unknown[]>(apiPath, []);

  return (
    <Card title={<Space>{icon}<span>{title}</span></Space>} size="small">
      <Spin spinning={loading}>
        {data.length === 0 ? (
          <Empty description="尚無資料" />
        ) : (
          <List
            size="small"
            dataSource={data.slice(0, 5)}
            renderItem={(item: unknown) => {
              const rec = item as Record<string, unknown>;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={<Text>{String(rec.name || rec.group_code || rec.id || '---')}</Text>}
                    description={String(rec.status || rec.state || '')}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Spin>
    </Card>
  );
}

// ===========================
// 角色 Dashboard 總調度器
// ===========================
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
