import type { StateCreator } from 'zustand';
import type { StockItem, PriceAlert, IdeState } from '../useStore';

export interface PortfolioSlice {
  portfolio: StockItem[];
  alerts: PriceAlert[];
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  reorderPortfolio: (fromIndex: number, toIndex: number) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  addAlert: (alert: Omit<PriceAlert, 'id'>) => void;
  removeAlert: (id: string) => void;
}

export const createPortfolioSlice: StateCreator<IdeState, [], [], PortfolioSlice> = (set) => ({
  portfolio: [
    { id: '1', name: '삼성전자', code: '005930.KS' },
    { id: '2', name: 'BTC', code: 'KRW-BTC' },
  ],
  alerts: [],
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
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, { ...alert, id: Date.now().toString() }]
  })),
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id)
  })),
});
