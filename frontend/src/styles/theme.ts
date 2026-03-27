/**
 * Ant Design 5 主題配置
 * 旅遊 ERP 專用設計風格
 */
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    // 品牌色系 — 旅遊業海洋藍
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // 圓角
    borderRadius: 6,

    // 字型
    fontFamily: "'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,

    // 間距
    marginXS: 8,
    marginSM: 12,
    marginMD: 16,
    marginLG: 24,

    // 陰影
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
      headerHeight: 56,
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
      darkItemSelectedBg: '#1677ff',
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#e6f4ff',
      headerSortActiveBg: '#f0f0f0',
    },
    Card: {
      paddingLG: 20,
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(22, 119, 255, 0.1)',
    },
  },
};

export default theme;
