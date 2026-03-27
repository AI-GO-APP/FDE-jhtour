'use client';
/** A15-A18. 地理資訊 (洲/國/城市/機場) | Tabs 整合 */
import React from 'react';
import { Tabs, Table, Button, Space, Typography, Form, Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { mockAreas, mockNations, mockCities, mockAirports } from '@/mock/master-data';
import type { Area, Nation, City, Airport } from '@/types';

const { Title } = Typography;
const areaCols: ColumnsType<Area> = [{ title: '洲別代碼', dataIndex: 'AREA_CD' },{ title: '洲別名稱', dataIndex: 'AREA_NM' }];
const nationCols: ColumnsType<Nation> = [{ title: '國家代碼', dataIndex: 'NATN_CD' },{ title: '國家名稱', dataIndex: 'NATN_NM' },{ title: '洲別', dataIndex: 'AREA_CD' }];
const cityCols: ColumnsType<City> = [{ title: '城市代碼', dataIndex: 'CITY_CD' },{ title: '城市名稱', dataIndex: 'CITY_NM' },{ title: '國家', dataIndex: 'NATN_CD' }];
const airportCols: ColumnsType<Airport> = [{ title: '機場代碼', dataIndex: 'AIRP_CD' },{ title: '機場名稱', dataIndex: 'AIRP_NM' },{ title: '城市', dataIndex: 'CITY_CD' },{ title: '類型', dataIndex: 'DMST_FG', render: (v: boolean) => <Tag color={v ? 'blue' : 'green'}>{v ? '國內' : '國際'}</Tag> }];

export default function GeoPage() {
  return (
    <div>
      <Title level={4}>地理資訊管理</Title>
      <Tabs items={[
        { key: 'area', label: '洲別', children: <><Space style={{marginBottom:16}}><Button type="primary" icon={<PlusOutlined />}>新增洲別</Button></Space><Table columns={areaCols} dataSource={mockAreas as unknown as Area[]} rowKey="AREA_CD" size="middle" bordered pagination={false} /></> },
        { key: 'nation', label: '國家', children: <><Space style={{marginBottom:16}}><Button type="primary" icon={<PlusOutlined />}>新增國家</Button></Space><Table columns={nationCols} dataSource={mockNations as unknown as Nation[]} rowKey="NATN_CD" size="middle" bordered pagination={false} /></> },
        { key: 'city', label: '城市', children: <><Space style={{marginBottom:16}}><Button type="primary" icon={<PlusOutlined />}>新增城市</Button></Space><Table columns={cityCols} dataSource={mockCities as unknown as City[]} rowKey="CITY_CD" size="middle" bordered pagination={false} /></> },
        { key: 'airport', label: '機場', children: <><Space style={{marginBottom:16}}><Button type="primary" icon={<PlusOutlined />}>新增機場</Button></Space><Table columns={airportCols} dataSource={mockAirports as unknown as Airport[]} rowKey="AIRP_CD" size="middle" bordered pagination={false} /></> },
      ]} />
    </div>
  );
}
