'use client';

/**
 * 通用篩選面板元件
 * 用於所有列表頁的搜尋/篩選區域
 * 支援快速搜尋 + 進階搜尋的切換
 */
import React, { useState } from 'react';
import { Card, Input, Button, Space, Row, Col, Form } from 'antd';
import { SearchOutlined, ClearOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  /** 快速搜尋時觸發 */
  onSearch: (values: Record<string, unknown>) => void;
  /** 清除所有篩選 */
  onReset: () => void;
  /** 是否顯示快速搜尋輸入框 */
  showQuickSearch?: boolean;
  /** 快速搜尋欄位名稱 */
  quickSearchPlaceholder?: string;
  /** 進階搜尋表單項目 (children) */
  children?: React.ReactNode;
}

export default function FilterPanel({
  onSearch,
  onReset,
  showQuickSearch = true,
  quickSearchPlaceholder = '輸入關鍵字搜尋...',
  children,
}: FilterPanelProps) {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card className={styles.filterCard} size="small">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        {showQuickSearch && (
          <Row gutter={16} align="middle" className={styles.quickSearchRow}>
            <Col flex="auto">
              <Form.Item name="keyword" noStyle>
                <Input.Search
                  placeholder={quickSearchPlaceholder}
                  enterButton={<><SearchOutlined /> 搜尋</>}
                  onSearch={handleSearch}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>
            {children && (
              <Col>
                <Button
                  type="link"
                  onClick={() => setExpanded(!expanded)}
                  icon={expanded ? <UpOutlined /> : <DownOutlined />}
                >
                  {expanded ? '收合' : '進階搜尋'}
                </Button>
              </Col>
            )}
          </Row>
        )}

        {children && (expanded || !showQuickSearch) && (
          <div className={styles.advancedArea}>
            <Row gutter={[16, 0]}>{children}</Row>
            <Row justify="end" style={{ marginTop: 12 }}>
              <Space>
                <Button onClick={handleReset} icon={<ClearOutlined />}>
                  清除
                </Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜尋
                </Button>
              </Space>
            </Row>
          </div>
        )}
      </Form>
    </Card>
  );
}
