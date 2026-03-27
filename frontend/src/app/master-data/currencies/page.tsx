'use client';
/** A19. 幣別匯率 | L_curr.asp | DB: currencies */
import React from 'react'; import { Form, Input, InputNumber } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockCurrencies } from '@/mock/master-data'; import type { Currency } from '@/types';
const columns: ColumnsType<Currency> = [{ title: '幣別代碼', dataIndex: 'CURR_CD', width: 100 },{ title: '幣別名稱', dataIndex: 'CURR_NM', width: 120 },{ title: '匯率(兌TWD)', dataIndex: 'EXCH_RATE', width: 120 },{ title: '生效日', dataIndex: 'EFF_DT', width: 120 }];
const formContent = (<>{/* === [API] POST/PUT /api/currencies === DB: INSERT/UPDATE currencies === */}<Form.Item name="CURR_CD" label="幣別代碼" rules={[{ required: true }]}><Input maxLength={3} /></Form.Item><Form.Item name="CURR_NM" label="幣別名稱"><Input /></Form.Item><Form.Item name="EXCH_RATE" label="匯率"><InputNumber style={{width:'100%'}} step={0.01} /></Form.Item></>);
export default function Page() { return <PageShell title="幣別匯率管理" columns={columns} dataSource={mockCurrencies as unknown as Currency[]} rowKey="CURR_CD" formContent={formContent} />; }
