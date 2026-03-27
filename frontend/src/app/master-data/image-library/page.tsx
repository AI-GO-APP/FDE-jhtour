'use client';
/** A28. 圖庫管理 | L_ImgDB.asp */
import React from 'react'; import { Typography, Card, Upload, Button, message } from 'antd'; import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
const { Title } = Typography;
export default function Page() {
  return (<div><Title level={4}>圖庫管理</Title><Card>
    {/* === [API] POST /api/images/upload === DB: images table === TODO: [替換] === */}
    <Upload listType="picture-card" beforeUpload={()=>{message.info('上傳功能 (待接後端)');return false;}}>
      <div><PictureOutlined /><div style={{marginTop:8}}>上傳圖片</div></div>
    </Upload></Card></div>);
}
