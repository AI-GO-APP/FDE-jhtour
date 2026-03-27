'use client';
/** A12. 通路類別 | L_channel.asp | DB: channels */
import React from 'react'; import { Form, Input } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockChannels } from '@/mock/master-data'; import type { Channel } from '@/types';
const columns: ColumnsType<Channel> = [{ title: '代碼', dataIndex: 'CHANNEL_CD', width: 100 },{ title: '通路名稱', dataIndex: 'CHANNEL_NM', width: 200 }];
const formContent = (<>{/* === [API] POST/PUT /api/channels === DB: INSERT/UPDATE channels === */}<Form.Item name="CHANNEL_CD" label="代碼" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="CHANNEL_NM" label="通路名稱" rules={[{ required: true }]}><Input /></Form.Item></>);
export default function Page() { return <PageShell title="通路類別檔" columns={columns} dataSource={mockChannels as unknown as Channel[]} rowKey="CHANNEL_CD" formContent={formContent} />; }
