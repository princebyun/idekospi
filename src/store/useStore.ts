import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StockItem {
  id: string;
  name: string;
  code: string;
  averagePrice: number;
  quantity: number;
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: 'portfolio' | 'market_domestic' | 'market_global' | 'market_crypto' | 'patchnotes';
}

export interface MarketPrices {
  [code: string]: {
    price: number;
    changeRate: number;
  }
}

interface IdeState {
  portfolio: StockItem[];
  tabs: Tab[];
  activeTabId: string;
  prices: MarketPrices;
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
  updatePrice: (code: string, price: number, changeRate: number) => void;
}

export const useStore = create<IdeState>()(
  persist(
    (set) => ({
      portfolio: [
        { id: '1', name: '삼성전자', code: '005930.KS', averagePrice: 75000, quantity: 100 },
        { id: '2', name: 'BTC', code: 'KRW-BTC', averagePrice: 95000000, quantity: 0.1 },
      ],
      tabs: [
        { id: 'domestic', title: 'DomesticMarket.ts', icon: 'TS', color: '#007acc', type: 'market_domestic' },
        { id: 'global', title: 'GlobalMarket.ts', icon: 'TS', color: '#007acc', type: 'market_global' },
        { id: 'crypto', title: 'CryptoMarket.ts', icon: 'TS', color: '#007acc', type: 'market_crypto' },
        { id: 'portfolio', title: 'Portfolio.js', icon: 'JS', color: '#e3c75b', type: 'portfolio' },
      ],
      activeTabId: 'domestic',
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
      updatePrice: (code, price, changeRate) => set((state) => ({
        prices: { ...state.prices, [code]: { price, changeRate } }
      }))
    }),
    {
      name: 'ide-kospi-storage',
      partialize: (state) => ({ portfolio: state.portfolio, tabs: state.tabs, activeTabId: state.activeTabId }),
    }
  )
);
