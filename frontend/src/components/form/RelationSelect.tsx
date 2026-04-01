'use client';

/**
 * RelationSelect — 關聯式資料選擇器
 *
 * 用於 FK 欄位（如 partner_id、currency 等），從 API 載入選項，
 * 支援遠端搜尋、顯示名稱但儲存 ID。
 *
 * 用法：
 *   <RelationSelect apiPath="/api/customers" labelField="name" />
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';

interface RelationSelectProps extends Omit<SelectProps, 'options' | 'onSearch' | 'filterOption'> {
  /** API 路徑，如 '/api/customers' */
  apiPath: string;
  /** 顯示用的欄位名，預設 'name' */
  labelField?: string;
  /** 值欄位名，預設 'id' */
  valueField?: string;
  /** 額外的固定選項（如手動加入的選項） */
  extraOptions?: { label: string; value: string }[];
}

export default function RelationSelect({
  apiPath,
  labelField = 'name',
  valueField = 'id',
  extraOptions = [],
  ...restProps
}: RelationSelectProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** 從 API 載入選項 */
  const fetchOptions = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) {
        params.set('search', search);
      }
      const res = await fetch(`${apiPath}?${params}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      const records: Record<string, unknown>[] = Array.isArray(json) ? json : (json.data ?? []);

      const opts = records.map((r) => ({
        label: String(r[labelField] ?? r['display_name'] ?? r['name'] ?? ''),
        value: String(r[valueField] ?? ''),
      }));
      setOptions([...extraOptions, ...opts]);
    } catch (err) {
      console.error('RelationSelect 載入失敗:', err);
      setOptions([...extraOptions]);
    } finally {
      setLoading(false);
    }
  }, [apiPath, labelField, valueField, extraOptions]);

  /** 首次 focus 時載入 */
  const handleFocus = useCallback(() => {
    if (!initialized) {
      setInitialized(true);
      fetchOptions();
    }
  }, [initialized, fetchOptions]);

  /** 遠端搜尋（debounce 300ms） */
  const handleSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOptions(value || undefined);
    }, 300);
  }, [fetchOptions]);

  // 如果有預設值，初始化時也載入選項
  useEffect(() => {
    if (restProps.value && !initialized) {
      setInitialized(true);
      fetchOptions();
    }
  }, [restProps.value, initialized, fetchOptions]);

  return (
    <Select
      showSearch
      filterOption={false}
      onFocus={handleFocus}
      onSearch={handleSearch}
      notFoundContent={loading ? <Spin size="small" /> : '查無資料'}
      loading={loading}
      options={options}
      allowClear
      placeholder="搜尋並選擇..."
      {...restProps}
    />
  );
}
