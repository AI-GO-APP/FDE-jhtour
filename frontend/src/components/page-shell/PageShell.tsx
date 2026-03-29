/**
 * 通用頁面殼 — 統一所有列表頁的結構
 * 包含：標題 + 工具列 + FilterPanel + DataTable + CrudDrawer
 * 支援 RBAC readonly 模式
 * 支援 apiPath 自動串接真實 API (GET/POST/PATCH/DELETE)
 */
'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Typography, Button, Space, Table, Popconfirm, Tooltip, message, Tag, Spin } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, ExportOutlined, PrinterOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined, ReloadOutlined } from '@ant-design/icons';
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
  /** API 路徑（如 '/api/customers'），提供後自動串接 CRUD */
  apiPath?: string;
  /** 靜態資料源（向下相容，僅在未提供 apiPath 時使用） */
  dataSource?: T[];
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
  apiPath,
  dataSource: externalData,
  rowKey,
  filterContent,
  formContent,
  searchPlaceholder,
  showExport = false,
  showPrint = false,
  showCreate = true,
  createTitle,
}: PageShellProps<T>) {
  // ===== API 資料狀態 =====
  const [apiData, setApiData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const mountedRef = useRef(true);

  // 判斷使用 API 還是靜態資料
  const isApiMode = !!apiPath;
  const rawData = isApiMode ? apiData : (externalData ?? []);

  // ===== 搜尋/篩選 =====
  const [filteredData, setFilteredData] = useState<T[]>(rawData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingRecord, setEditingRecord] = useState<T | null>(null);

  // RBAC 權限檢查
  const pathname = usePathname();
  const { user } = useAuth();
  const permission = user ? getPermission(user.role, pathname) : 'readonly';
  const isReadonly = permission === 'readonly';

  // ===== API 資料獲取 =====
  const fetchData = useCallback(async () => {
    if (!apiPath) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiPath}?limit=200&count=true`);
      if (!res.ok) {
        throw new Error(`API 錯誤 [${res.status}]`);
      }
      const json = await res.json();
      if (mountedRef.current) {
        // 相容兩種回應格式：{ data: [...] } 或直接 [...]
        const records = Array.isArray(json) ? json : (json.data ?? []);
        setApiData(records);
        setFilteredData(records);
        setTotalCount(json.pagination?.total ?? records.length);
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error('載入資料失敗:', err);
        setApiData([]);
        setFilteredData([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiPath]);

  useEffect(() => {
    mountedRef.current = true;
    if (isApiMode) {
      fetchData();
    }
    return () => { mountedRef.current = false; };
  }, [isApiMode, fetchData]);

  // 當外部靜態資料變更時同步
  useEffect(() => {
    if (!isApiMode) {
      setFilteredData(externalData ?? []);
    }
  }, [isApiMode, externalData]);

  // ===== CRUD 操作 =====
  const handleCreate = useCallback(async (values: Record<string, unknown>) => {
    if (!apiPath) {
      message.success('新增成功 (離線模式)');
      return;
    }
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`新增失敗 [${res.status}]`);
      message.success('新增成功');
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      message.error(`新增失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, fetchData]);

  const handleUpdate = useCallback(async (values: Record<string, unknown>) => {
    if (!apiPath || !editingRecord) {
      message.success('更新成功 (離線模式)');
      return;
    }
    const id = (editingRecord as Record<string, unknown>)[rowKey];
    try {
      const res = await fetch(`${apiPath}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`更新失敗 [${res.status}]`);
      message.success('更新成功');
      setDrawerOpen(false);
      setEditingRecord(null);
      fetchData();
    } catch (err) {
      message.error(`更新失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, editingRecord, rowKey, fetchData]);

  const handleDelete = useCallback(async (record: T) => {
    if (!apiPath) {
      message.success('刪除成功 (離線模式)');
      return;
    }
    const id = (record as Record<string, unknown>)[rowKey];
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`刪除失敗 [${res.status}]`);
      message.success('刪除成功');
      fetchData();
    } catch (err) {
      message.error(`刪除失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, rowKey, fetchData]);

  // ===== 搜尋 =====
  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      const keyword = (values.keyword as string || '').toLowerCase();
      if (!keyword) {
        setFilteredData(rawData);
        return;
      }
      const filtered = rawData.filter((item) =>
        Object.values(item).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(keyword)
        )
      );
      setFilteredData(filtered);
    },
    [rawData]
  );

  const handleReset = useCallback(() => {
    setFilteredData(rawData);
  }, [rawData]);

  // ===== 操作欄 =====
  const columnsWithAction: ColumnsType<T> = useMemo(() => {
    if (!formContent) return columns;

    if (isReadonly) {
      return [
        ...columns,
        {
          title: '操作',
          key: 'action',
          width: 60,
          fixed: 'right' as const,
          render: (_: unknown, record: T) => (
            <Tooltip title="檢視">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setEditingRecord(record);
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
        render: (_: unknown, record: T) => (
          <Space size="small">
            <Tooltip title="檢視">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setEditingRecord(record);
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
                  setEditingRecord(record);
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
            <Popconfirm title="確定刪除？" onConfirm={() => handleDelete(record)}>
              <Tooltip title="刪除">
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }, [columns, formContent, isReadonly, handleDelete]);

  const pagination: TablePaginationConfig = {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}~${range[1]} 筆 / 共 ${total} 筆`,
    total: isApiMode ? totalCount : undefined,
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
          {isApiMode && (
            <Tooltip title="重新載入">
              <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
            </Tooltip>
          )}
          {showCreate && formContent && !isReadonly && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
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

      <Spin spinning={loading}>
        <Table<T>
          columns={columnsWithAction}
          dataSource={filteredData}
          rowKey={rowKey}
          pagination={pagination}
          scroll={{ x: 'max-content' }}
          size="middle"
          bordered
        />
      </Spin>

      {formContent && (
        <CrudDrawer
          title={drawerMode === 'create' ? `新增${createTitle || title}` : drawerMode === 'edit' ? `編輯${createTitle || title}` : `檢視${createTitle || title}`}
          open={drawerOpen}
          onClose={() => { setDrawerOpen(false); setEditingRecord(null); }}
          onSubmit={(values) => {
            if (drawerMode === 'create') {
              handleCreate(values);
            } else if (drawerMode === 'edit') {
              handleUpdate(values);
            }
          }}
          mode={drawerMode}
          initialValues={editingRecord as Record<string, unknown> | undefined}
        >
          {formContent}
        </CrudDrawer>
      )}
    </div>
  );
}
