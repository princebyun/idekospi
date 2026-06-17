import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PortfolioSlice } from './slices/portfolioSlice';
import { createPortfolioSlice } from './slices/portfolioSlice';
import type { UiSlice } from './slices/uiSlice';
import { createUiSlice } from './slices/uiSlice';
import type { MarketSlice } from './slices/marketSlice';
import { createMarketSlice } from './slices/marketSlice';
import type { TradingSlice } from './slices/tradingSlice';
import { createTradingSlice } from './slices/tradingSlice';

export interface StockItem {
  id: string;
  name: string;
  code: string;
  groupId?: string;
  buyPrice?: number;
  amount?: number;
}

export interface PortfolioGroup {
  id: string;
  name: string;
}

export interface AlertHistory {
  id: string;
  timestamp: number;
  message: string;
  type: 'UP' | 'DOWN' | 'INFO';
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: string;
  code?: string;
}

export interface MarketPrices {
  [code: string]: {
    price: number;
    changeRate: number;
    changeRate15m?: number;
    changeRate30m?: number;
    marketState?: string;
  }
}

export interface PriceAlert {
  id: string;
  code: string;
  name: string;
  targetPrice: number;
  direction: 'UP' | 'DOWN';
}

export interface Holding {
  code: string;
  name: string;
  avgPrice: number;
  amount: number;
}

export type IdeState = PortfolioSlice & UiSlice & MarketSlice & TradingSlice;

export const useStore = create<IdeState>()(
  persist(
    (...a) => ({
      ...createPortfolioSlice(...a),
      ...createUiSlice(...a),
      ...createMarketSlice(...a),
      ...createTradingSlice(...a),
    }),
    {
      name: 'ide-kospi-storage-v8', // 캐시 무효화 및 새로운 기본값 적용
      partialize: (state) => ({ 
        theme: state.theme,
        portfolio: state.portfolio, 
        groups: state.groups,
        tabs: state.tabs, 
        activeTabId: state.activeTabId,
        sidebarWidth: state.sidebarWidth,
        terminalHeight: state.terminalHeight,
        isRightPanelOpen: state.isRightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        isMenuBarVisible: state.isMenuBarVisible,
        timeframe: state.timeframe,
        balance: state.balance,
        holdings: state.holdings,
        alertHistory: state.alertHistory
      }),
    }
  )
);
