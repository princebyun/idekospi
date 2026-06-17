import type { StateCreator } from 'zustand';
import type { StockItem, PriceAlert, PortfolioGroup, AlertHistory, IdeState } from '../useStore';

export interface PortfolioSlice {
  portfolio: StockItem[];
  groups: PortfolioGroup[];
  alerts: PriceAlert[];
  alertHistory: AlertHistory[];
  
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  reorderPortfolio: (fromIndex: number, toIndex: number) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  
  addGroup: (name: string) => void;
  removeGroup: (id: string) => void;
  renameGroup: (id: string, name: string) => void;
  
  addAlert: (alert: Omit<PriceAlert, 'id'>) => void;
  removeAlert: (id: string) => void;
  addAlertHistory: (history: Omit<AlertHistory, 'id' | 'timestamp'>) => void;
  clearAlertHistory: () => void;
}

export const createPortfolioSlice: StateCreator<IdeState, [], [], PortfolioSlice> = (set) => ({
  portfolio: [
    { id: '1', name: '삼성전자', code: '005930.KS' },
    { id: '2', name: 'BTC', code: 'KRW-BTC' },
  ],
  groups: [],
  alerts: [],
  alertHistory: [],
  addStock: (stock) => set((state) => ({ 
    portfolio: [...state.portfolio, { ...stock, id: Date.now().toString() }] 
  })),
  reorderPortfolio: (fromIndex, toIndex) => set((state) => {
    const newPortfolio = [...state.portfolio];
    const [movedItem] = newPortfolio.splice(fromIndex, 1);
    newPortfolio.splice(toIndex, 0, movedItem);
    return { portfolio: newPortfolio };
  }),
  updateStock: (id, updates) => set((state) => ({
    portfolio: state.portfolio.map((s) => s.id === id ? { ...s, ...updates } : s)
  })),
  removeStock: (id) => set((state) => ({
    portfolio: state.portfolio.filter((s) => s.id !== id)
  })),
  addGroup: (name) => set((state) => ({
    groups: [...state.groups, { id: Date.now().toString(), name }]
  })),
  removeGroup: (id) => set((state) => ({
    groups: state.groups.filter((g) => g.id !== id),
    portfolio: state.portfolio.map(s => s.groupId === id ? { ...s, groupId: undefined } : s)
  })),
  renameGroup: (id, name) => set((state) => ({
    groups: state.groups.map(g => g.id === id ? { ...g, name } : g)
  })),
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, { ...alert, id: Date.now().toString() }]
  })),
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id)
  })),
  addAlertHistory: (history) => set((state) => ({
    alertHistory: [{ ...history, id: Date.now().toString(), timestamp: Date.now() }, ...state.alertHistory].slice(0, 100)
  })),
  clearAlertHistory: () => set({ alertHistory: [] }),
});
