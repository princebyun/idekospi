import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StockItem {
  id: string;
  name: string;
  averagePrice: number;
  quantity: number;
  currentPrice: number;
}

export interface Tab {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: 'portfolio' | 'market' | 'patchnotes';
}

interface IdeState {
  portfolio: StockItem[];
  tabs: Tab[];
  activeTabId: string;
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
}

export const useStore = create<IdeState>()(
  persist(
    (set) => ({
      portfolio: [
        { id: '1', name: '삼성전자', averagePrice: 75000, quantity: 100, currentPrice: 81000 },
        { id: '2', name: 'SK하이닉스', averagePrice: 150000, quantity: 50, currentPrice: 175000 },
      ],
      tabs: [
        { id: 'portfolio', title: 'Portfolio.js', icon: 'JS', color: '#e3c75b', type: 'portfolio' },
        { id: 'market', title: 'MarketService.ts', icon: 'TS', color: '#007acc', type: 'market' },
        { id: 'patchnotes', title: 'ReleaseNotes.java', icon: '{}', color: '#e36e5b', type: 'patchnotes' },
      ],
      activeTabId: 'portfolio',
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
    }),
    {
      name: 'ide-kospi-storage',
    }
  )
);
