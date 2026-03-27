'use client';
/** B2. OP 人員訂單作業 | L_order_op.asp — 同 B1 但 OP 視角 */
import React from 'react'; import { Tag } from 'antd'; import type { ColumnsType } from 'antd/es/table'; import PageShell from '@/components/page-shell/PageShell'; import { mockOrders } from '@/mock/all-modules'; import { ORDER_STATUS_COLOR } from '@/lib/constants'; import type { Order } from '@/types/orders';
const columns: ColumnsType<Order> = [
  { title: '訂單編號', dataIndex: 'ORD_NO', width: 180 },{ title: '產品', dataIndex: 'PROD_TP', width: 80 },{ title: '旅客', dataIndex: 'PAX_CD', width: 80 },
  { title: '團號', dataIndex: 'GRUP_CD', width: 130 },{ title: '出發日', dataIndex: 'DEP_DT', width: 110 },{ title: '金額', dataIndex: 'AMT', width: 110, render: (v: number) => `NT$ ${v?.toLocaleString()}` },
  { title: 'OP承辦', dataIndex: 'OP_EMP_CD', width: 80 },{ title: '狀態', dataIndex: 'ORD_STUS', width: 80, render: (v: string) => <Tag color={ORDER_STATUS_COLOR[v]}>{v}</Tag> },
];
export default function Page() { return <PageShell<Order> title="OP 人員訂單作業" columns={columns} dataSource={mockOrders as unknown as Order[]} rowKey="ORD_NO" searchPlaceholder="搜尋訂單..." />; }
