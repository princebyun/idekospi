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
  type: 'portfolio' | 'market' | 'patchnotes';
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
        { id: '1', name: '삼성전자', code: '005930', averagePrice: 75000, quantity: 100 },
        { id: '2', name: '비트코인', code: 'KRW-BTC', averagePrice: 95000000, quantity: 0.1 },
      ],
      tabs: [
        { id: 'portfolio', title: 'Portfolio.js', icon: 'JS', color: '#e3c75b', type: 'portfolio' },
        { id: 'market', title: 'MarketService.ts', icon: 'TS', color: '#007acc', type: 'market' },
        { id: 'patchnotes', title: 'ReleaseNotes.java', icon: '{}', color: '#e36e5b', type: 'patchnotes' },
      ],
      activeTabId: 'portfolio',
      prices: {
        '005930': { price: 81000, changeRate: 1.5 },
        '000660': { price: 175000, changeRate: 2.1 },
        '035420': { price: 195000, changeRate: -0.8 },
        'AAPL': { price: 190, changeRate: 0.8 },
        'KRW-BTC': { price: 98000000, changeRate: 3.4 },
        'KRW-ETH': { price: 5000000, changeRate: 1.2 },
        'KRW-XRP': { price: 800, changeRate: -0.5 },
      },
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
      partialize: (state) => ({ portfolio: state.portfolio, tabs: state.tabs, activeTabId: state.activeTabId }), // Do not persist prices
    }
  )
);
