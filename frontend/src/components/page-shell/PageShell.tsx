/**
 * 通用頁面殼 — 統一所有列表頁的結構
 * 包含：標題 + 工具列 + FilterPanel + DataTable
 * 支援 RBAC readonly 模式
 */
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Typography, Button, Space, Table, Popconfirm, Tooltip, message, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, ExportOutlined, PrinterOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import FilterPanel from '@/components/filter-panel/FilterPanel';
import CrudDrawer from '@/components/crud-drawer/CrudDrawer';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { getPermission } from '@/lib/rbac';

const { Title } = Typography;

interface PageShellProps<T extends object> {
  /** 頁面標題 */
  title: string;
  /** 表格欄位定義 */
  columns: ColumnsType<T>;
  /** 資料源 (mock) */
  dataSource: T[];
  /** 資料列唯一鍵 */
  rowKey: string;
  /** 篩選面板進階搜尋欄位 */
  filterContent?: React.ReactNode;
  /** 新增/編輯表單內容 */
  formContent?: React.ReactNode;
  /** 快速搜尋 placeholder */
  searchPlaceholder?: string;
  /** 顯示匯出按鈕 */
  showExport?: boolean;
  /** 顯示列印按鈕 */
  showPrint?: boolean;
  /** 顯示新增按鈕 */
  showCreate?: boolean;
  /** 新增 Drawer 標題 */
  createTitle?: string;
}

export default function PageShell<T extends object>({
  title,
  columns,
  dataSource,
  rowKey,
  filterContent,
  formContent,
  searchPlaceholder,
  showExport = false,
  showPrint = false,
  showCreate = true,
  createTitle,
}: PageShellProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(dataSource);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  // RBAC 權限檢查
  const pathname = usePathname();
  const { user } = useAuth();
  const permission = user ? getPermission(user.role, pathname) : 'readonly';
  const isReadonly = permission === 'readonly';

  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      const keyword = (values.keyword as string || '').toLowerCase();
      if (!keyword) {
        setFilteredData(dataSource);
        return;
      }
      const filtered = dataSource.filter((item) =>
        Object.values(item).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(keyword)
        )
      );
      setFilteredData(filtered);
    },
    [dataSource]
  );

  const handleReset = useCallback(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  // 加入操作欄（根據權限決定按鈕顯示）
  const columnsWithAction: ColumnsType<T> = useMemo(() => {
    if (!formContent) return columns;

    if (isReadonly) {
      // 唯讀模式：只保留檢視按鈕
      return [
        ...columns,
        {
          title: '操作',
          key: 'action',
          width: 60,
          fixed: 'right' as const,
          render: () => (
            <Tooltip title="檢視">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setDrawerMode('view');
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
          ),
        },
      ];
    }

    return [
      ...columns,
      {
        title: '操作',
        key: 'action',
        width: 120,
        fixed: 'right' as const,
        render: () => (
          <Space size="small">
            <Tooltip title="檢視">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setDrawerMode('view');
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="編輯">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
            <Popconfirm title="確定刪除？" onConfirm={() => message.success('刪除成功 (Mock)')}>
              <Tooltip title="刪除">
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }, [columns, formContent, isReadonly]);

  const pagination: TablePaginationConfig = {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}~${range[1]} 筆 / 共 ${total} 筆`,
  };

  return (
    <div>
      <div className="table-toolbar">
        <Space align="center">
          <Title level={4} style={{ margin: 0 }}>{title}</Title>
          {isReadonly && (
            <Tag icon={<LockOutlined />} color="orange" style={{ marginLeft: 8 }}>唯讀</Tag>
          )}
        </Space>
        <Space>
          {showCreate && formContent && !isReadonly && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerMode('create');
                setDrawerOpen(true);
              }}
            >
              新增
            </Button>
          )}
          {showExport && (
            <Button icon={<ExportOutlined />} onClick={() => message.info('匯出功能 (待接後端)')}>
              匯出
            </Button>
          )}
          {showPrint && (
            <Button icon={<PrinterOutlined />} onClick={() => message.info('列印功能 (待接後端)')}>
              列印
            </Button>
          )}
        </Space>
      </div>

      <FilterPanel
        onSearch={handleSearch}
        onReset={handleReset}
        quickSearchPlaceholder={searchPlaceholder || `搜尋${title}...`}
      >
        {filterContent}
      </FilterPanel>

      <Table<T>
        columns={columnsWithAction}
        dataSource={filteredData}
        rowKey={rowKey}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
        size="middle"
        bordered
      />

      {formContent && (
        <CrudDrawer
          title={drawerMode === 'create' ? `新增${createTitle || title}` : drawerMode === 'edit' ? `編輯${createTitle || title}` : `檢視${createTitle || title}`}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSubmit={(values) => {
            console.log('Form submit:', values);
            message.success(`${drawerMode === 'create' ? '新增' : '更新'}成功 (Mock)`);
            setDrawerOpen(false);
          }}
          mode={drawerMode}
        >
          {formContent}
        </CrudDrawer>
      )}
    </div>
  );
}
