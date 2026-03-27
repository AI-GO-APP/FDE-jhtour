'use client';
/** A21~A26. 旅遊輔助資訊 (小費/電壓/辦證文件/電碼/交通/注意事項) | Tabs 整合 */
import React from 'react';
import { Tabs, Table, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

// === [API] GET /api/travel-info/{type} === DB: 各輔助資料表 ===
// TODO: [替換] 改為實際 API 呼叫
const mockTips = Array.from({length:10},(_,i)=>({key:String(i),NATN_CD:['JP','KR','TH','SG','US','FR','GB','AU','CA','TW'][i],TIP_DESC:`${['日本','韓國','泰國','新加坡','美國','法國','英國','澳洲','加拿大','台灣'][i]}：${['不需小費','不需小費','20泰銖','不需','15-20%','10-15%','10-12%','10%','15-20%','自由'][i]}`}));
const mockVoltage = Array.from({length:10},(_,i)=>({key:String(i),NATN_CD:['JP','KR','TH','SG','US','FR','GB','AU','CA','TW'][i],VOLTAGE:['100V','220V','220V','230V','120V','230V','230V','230V','120V','110V'][i],TIME_DIFF:['+1','+1','+1','+0','-13','-7','-8','-2','-13','+0'][i],TEL_PREFIX:['+81','+82','+66','+65','+1','+33','+44','+61','+1','+886'][i]}));

export default function TravelInfoPage() {
  return (
    <div>
      <Title level={4}>旅遊輔助資訊</Title>
      <Tabs items={[
        { key: 'tip', label: '小費建議', children: <><Space style={{marginBottom:16}}><Button type="primary" icon={<PlusOutlined />}>新增</Button></Space><Table dataSource={mockTips} columns={[{title:'國家',dataIndex:'NATN_CD',width:80},{title:'小費建議',dataIndex:'TIP_DESC'}]} rowKey="key" size="middle" bordered /></> },
        { key: 'voltage', label: '電壓時差', children: <Table dataSource={mockVoltage} columns={[{title:'國家',dataIndex:'NATN_CD',width:80},{title:'電壓',dataIndex:'VOLTAGE',width:80},{title:'時差',dataIndex:'TIME_DIFF',width:80},{title:'國碼',dataIndex:'TEL_PREFIX',width:80}]} rowKey="key" size="middle" bordered /> },
        { key: 'doc', label: '辦證文件', children: <p>辦證所需文件定義 — {/* === [API] GET /api/documents === DB: documents === TODO: [替換] === */}待接後端</p> },
        { key: 'code', label: '電碼英譯', children: <p>中文電碼/英譯對照 — {/* === [API] GET /api/tele-codes === DB: tele_codes === TODO: [替換] === */}待接後端</p> },
        { key: 'traffic', label: '交通設施', children: <p>交通工具選項 — {/* === [API] GET /api/transport === DB: transport_facilities === TODO: [替換] === */}待接後端</p> },
        { key: 'notice', label: '出國注意事項', children: <p>標準出國提醒 — {/* === [API] GET /api/travel-notices === DB: travel_notices === TODO: [替換] === */}待接後端</p> },
      ]} />
    </div>
  );
}
