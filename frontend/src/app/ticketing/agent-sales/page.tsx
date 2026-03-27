'use client';
/** 同業網路銷售統計 | L_agt_tkt_report.asp | DB: reports */
import React from 'react';
import { Typography, Card, Select, DatePicker, Button, Space, Form, Divider, message } from 'antd';
import { PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
const { Title } = Typography;
export default function Page() {
  return (<div><Title level={4}>同業網路銷售統計</Title><Card>
    {/* === [API] GET /api/reports/agent-sales === DB: reports === TODO: [替換] 改為實際 API === */}
    <Form layout="vertical">
      <Form.Item label="報表類型"><Select defaultValue="default" options={[{label:'明細表',value:'default'},{label:'總表',value:'summary'},{label:'分析表',value:'analysis'}]} style={{width:300}} /></Form.Item>
      <Form.Item label="日期範圍"><DatePicker.RangePicker /></Form.Item>
      <Divider />
      <Space><Button type="primary" icon={<PrinterOutlined />} onClick={()=>message.info('列印功能 (待接後端)')}>列印</Button>
      <Button icon={<FileExcelOutlined />} onClick={()=>message.info('匯出功能 (待接後端)')}>匯出 Excel</Button></Space>
    </Form></Card></div>);
}