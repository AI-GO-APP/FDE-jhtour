'use client';
/** B3. 信用卡刷卡查詢 | L_cardquery.asp | DB: credit_card_transactions */
import React from 'react'; import { Tag } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockCardTxns } from '@/mock/all-modules'; import type { CreditCardTransaction } from '@/types/orders';
const columns: ColumnsType<CreditCardTransaction> = [
  { title: 'ID', dataIndex: 'CARD_TXN_ID', width: 60 },{ title: '訂單', dataIndex: 'ORD_NO', width: 180 },{ title: '卡號', dataIndex: 'CARD_NO', width: 180 },
  { title: '持卡人', dataIndex: 'CARD_HOLDER', width: 100 },{ title: '授權碼', dataIndex: 'AUTH_CD', width: 120 },{ title: '授權日', dataIndex: 'AUTH_DT', width: 110 },
  { title: '金額', dataIndex: 'AUTH_AMT', width: 110, render: (v: number) => `NT$ ${v?.toLocaleString()}` },
  { title: '狀態', dataIndex: 'AUTH_STUS', width: 80, render: (v: string) => <Tag color={v==='成功'?'green':v==='失敗'?'red':'orange'}>{v}</Tag> },
];
export default function Page() { return <PageShell<CreditCardTransaction> title="信用卡刷卡查詢" columns={columns} dataSource={mockCardTxns as unknown as CreditCardTransaction[]} rowKey="CARD_TXN_ID" searchPlaceholder="搜尋卡號、持卡人、授權碼..." showCreate={false} />; }
