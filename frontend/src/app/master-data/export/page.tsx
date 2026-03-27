'use client';
/** A13. 資料匯出 | L_pax_output.asp */
import React from 'react'; import { Typography, Card, Button, Space, Select, DatePicker, Checkbox, Form, message } from 'antd'; import { ExportOutlined, FileExcelOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;
export default function ExportPage() {
  return (<div><Title level={4}>資料匯出作業</Title><Card>
    {/* === [API] POST /api/export/passengers === DB: SELECT FROM passengers WHERE ... === TODO: [替換] === */}
    <Form layout="vertical">
      <Form.Item label="匯出類型"><Select defaultValue="passengers" options={[{label:'旅客資料',value:'passengers'},{label:'同業資料',value:'agents'},{label:'機關行號',value:'companies'}]} style={{width:300}} /></Form.Item>
      <Form.Item label="日期範圍"><DatePicker.RangePicker /></Form.Item>
      <Form.Item label="匯出欄位"><Checkbox.Group options={['編號','姓名','電話','Email','地址','業務員','狀態']} defaultValue={['編號','姓名','電話']} /></Form.Item>
      <Space><Button type="primary" icon={<FileExcelOutlined />} onClick={()=>message.info('匯出功能 (待接後端)')}>匯出 Excel</Button><Button icon={<ExportOutlined />} onClick={()=>message.info('匯出功能 (待接後端)')}>匯出 CSV</Button></Space>
    </Form></Card></div>);
}
