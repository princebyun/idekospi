import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StockItem {
  id: string;
  name: string;
  code: string;
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
    marketState?: string;
  }
}

interface IdeState {
  portfolio: StockItem[];
  tabs: Tab[];
  activeTabId: string;
  prices: MarketPrices;
  theme: 'vscode-dark' | 'intellij' | 'light';
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
  updatePrice: (code: string, price: number, changeRate: number, marketState?: string) => void;
  sidebarWidth: number;
  terminalHeight: number;
  isRightPanelOpen: boolean;
  rightPanelWidth: number;
  setSidebarWidth: (width: number) => void;
  setTerminalHeight: (height: number) => void;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setTheme: (theme: 'vscode-dark' | 'intellij' | 'light') => void;
}

export const useStore = create<IdeState>()(
  persist(
    (set) => ({
      theme: 'vscode-dark',
      portfolio: [
        { id: '1', name: '삼성전자', code: '005930.KS' },
        { id: '2', name: 'BTC', code: 'KRW-BTC' },
      ],
      tabs: [
        { id: 'markets', title: 'Markets.ts', icon: 'TS', color: '#007acc', type: 'markets_all' },
      ],
      activeTabId: 'markets',
      prices: {},
      addStock: (stock) => set((state) => ({ 
        portfolio: [...state.portfolio, { ...stock, id: Date.now().toString() }] 
      })),
      updateStock: (id, updates) => set((state) => ({
        portfolio: state.portfolio.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      removeStock: (id) => set((state) => ({
        portfolio: state.portfolio.filter((s) => s.id !== id)
      })),
      openTab: (tab) => set((state) => {
        if (!state.tabs.find((t) => t.id === tab.id)) {
          return { tabs: [...state.tabs, tab], activeTabId: tab.id };
        }
        return { activeTabId: tab.id };
      }),
      closeTab: (tabId) => set((state) => {
        const newTabs = state.tabs.filter((t) => t.id !== tabId);
        return { 
          tabs: newTabs,
          activeTabId: state.activeTabId === tabId 
            ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '') 
            : state.activeTabId
        };
      }),
      setActiveTabId: (tabId) => set({ activeTabId: tabId }),
      updatePrice: (code, price, changeRate, marketState) => set((state) => ({
        prices: { ...state.prices, [code]: { price, changeRate, marketState } }
      })),
      sidebarWidth: 250,
      terminalHeight: 300,
      isRightPanelOpen: true, // 채팅창 기본 오픈
      rightPanelWidth: 350,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      setTerminalHeight: (height) => set({ terminalHeight: height }),
      setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
      setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ide-kospi-storage-v5', // 캐시 무효화 및 새로운 기본값 적용
      partialize: (state) => ({ 
        theme: state.theme,
        portfolio: state.portfolio, 
        tabs: state.tabs, 
        activeTabId: state.activeTabId,
        sidebarWidth: state.sidebarWidth,
        terminalHeight: state.terminalHeight,
        isRightPanelOpen: state.isRightPanelOpen,
        rightPanelWidth: state.rightPanelWidth
      }),
    }
  )
);
