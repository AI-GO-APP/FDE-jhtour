/**
 * 通用頁面殼 — 統一所有列表頁的結構
 * 包含：標題 + 工具列 + FilterPanel + DataTable + CrudDrawer
 * 支援 RBAC readonly 模式
 * 支援 apiPath 自動串接真實 API (GET/POST/PATCH/DELETE)
 *
 * 效能優化：
 * - P1: Server-side 分頁（僅拉當前頁資料）
 * - P2: Server-side 搜尋（使用 AI GO search 參數）
 * - P3: CRUD 操作後只 refetch 當前頁（非全量）
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

  // P1: Server-side 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // P2: Server-side 搜尋狀態
  const [searchKeyword, setSearchKeyword] = useState('');

  // 判斷使用 API 還是靜態資料
  const isApiMode = !!apiPath;
  const rawData = isApiMode ? apiData : (externalData ?? []);

  // ===== UI 狀態 =====
  const [filteredData, setFilteredData] = useState<T[]>(rawData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingRecord, setEditingRecord] = useState<T | null>(null);

  // RBAC 權限檢查
  const pathname = usePathname();
  const { user } = useAuth();
  const permission = user ? getPermission(user.role, pathname) : 'readonly';
  const isReadonly = permission === 'readonly';

  // ===== P1+P2: Server-side 分頁 + 搜尋的 API 資料獲取 =====
  const fetchData = useCallback(async (page?: number, size?: number, search?: string) => {
    if (!apiPath) return;
    setLoading(true);

    const effectivePage = page ?? currentPage;
    const effectiveSize = size ?? pageSize;
    const effectiveSearch = search ?? searchKeyword;
    const offset = (effectivePage - 1) * effectiveSize;

    try {
      const params = new URLSearchParams({
        limit: String(effectiveSize),
        offset: String(offset),
        count: 'true',
      });
      // P2: Server-side search — 帶搜尋關鍵字到後端
      if (effectiveSearch) {
        params.set('search', effectiveSearch);
      }

      const res = await fetch(`${apiPath}?${params}`);
      if (!res.ok) {
        throw new Error(`API 錯誤 [${res.status}]`);
      }
      const json = await res.json();
      if (mountedRef.current) {
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
  }, [apiPath, currentPage, pageSize, searchKeyword]);

  // 初始載入
  useEffect(() => {
    mountedRef.current = true;
    if (isApiMode) {
      fetchData(1, pageSize, '');
    }
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiMode, apiPath]);

  // 當外部靜態資料變更時同步
  useEffect(() => {
    if (!isApiMode) {
      setFilteredData(externalData ?? []);
    }
  }, [isApiMode, externalData]);

  // ===== P1: 分頁變更 handler =====
  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    const newPage = pagination.current ?? 1;
    const newSize = pagination.pageSize ?? pageSize;
    setCurrentPage(newPage);
    setPageSize(newSize);

    if (isApiMode) {
      fetchData(newPage, newSize, searchKeyword);
    }
  }, [isApiMode, pageSize, searchKeyword, fetchData]);

  // ===== P3: CRUD 操作 — 成功後只 refetch 當前頁 =====
  const refreshCurrentPage = useCallback(() => {
    fetchData(currentPage, pageSize, searchKeyword);
  }, [fetchData, currentPage, pageSize, searchKeyword]);

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
      refreshCurrentPage(); // P3: 只刷新當前頁
    } catch (err) {
      message.error(`新增失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, refreshCurrentPage]);

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
      refreshCurrentPage(); // P3: 只刷新當前頁
    } catch (err) {
      message.error(`更新失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, editingRecord, rowKey, refreshCurrentPage]);

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
      refreshCurrentPage(); // P3: 只刷新當前頁
    } catch (err) {
      message.error(`刪除失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    }
  }, [apiPath, rowKey, refreshCurrentPage]);

  // ===== P2: Server-side 搜尋 =====
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(
    (values: Record<string, unknown>) => {
      const keyword = (values.keyword as string || '').trim();

      if (isApiMode) {
        // P2: Server-side 搜尋 — debounce 後發送到後端
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
          setSearchKeyword(keyword);
          setCurrentPage(1); // 搜尋時重置到第一頁
          fetchData(1, pageSize, keyword);
        }, 300);
      } else {
        // 靜態資料 fallback：前端 JS filter
        if (!keyword) {
          setFilteredData(rawData);
          return;
        }
        const filtered = rawData.filter((item) =>
          Object.values(item).some(
            (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(keyword.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    },
    [isApiMode, rawData, pageSize, fetchData]
  );

  const handleReset = useCallback(() => {
    if (isApiMode) {
      setSearchKeyword('');
      setCurrentPage(1);
      fetchData(1, pageSize, '');
    } else {
      setFilteredData(rawData);
    }
  }, [isApiMode, rawData, pageSize, fetchData]);

  // ===== 自動數字千分位格式化 =====
  /** 為沒有自訂 render 的欄位注入數字格式化 */
  const autoFormattedColumns: ColumnsType<T> = useMemo(() => {
    return columns.map((col) => {
      // 已有自訂 render 的欄位不覆蓋
      if ('render' in col && col.render) return col;
      // 沒有 dataIndex 的欄位（如操作欄）跳過
      if (!('dataIndex' in col) || !col.dataIndex) return col;

      return {
        ...col,
        render: (value: unknown) => {
          if (value === null || value === undefined || value === '') return '-';
          // typeof number → 整數加千分位逗號
          if (typeof value === 'number') {
            return Number.isInteger(value)
              ? value.toLocaleString('en-US')
              : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
          }
          // 純數字字串（非 UUID/編號）也格式化
          if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) && value.length <= 15) {
            const num = Number(value);
            if (!isNaN(num)) {
              return Number.isInteger(num)
                ? num.toLocaleString('en-US')
                : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            }
          }
          return String(value);
        },
      };
    });
  }, [columns]);

  // ===== 操作欄 =====
  const columnsWithAction: ColumnsType<T> = useMemo(() => {
    if (!formContent) return autoFormattedColumns;

    if (isReadonly) {
      return [
        ...autoFormattedColumns,
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
      ...autoFormattedColumns,
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
  }, [autoFormattedColumns, formContent, isReadonly, handleDelete]);

  // P1: Server-side 分頁設定 — 由 Table onChange 控制
  const pagination: TablePaginationConfig = {
    current: isApiMode ? currentPage : undefined,
    pageSize: isApiMode ? pageSize : DEFAULT_PAGE_SIZE,
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
              <Button icon={<ReloadOutlined />} onClick={() => refreshCurrentPage()} loading={loading} />
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
          onChange={handleTableChange}
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
