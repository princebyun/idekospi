import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StockItem {
  id: string;
  name: string;
  code: string;
  buyPrice?: number;
  amount?: number;
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

export interface PriceAlert {
  id: string;
  code: string;
  name: string;
  targetPrice: number;
  direction: 'UP' | 'DOWN';
}

interface IdeState {
  portfolio: StockItem[];
  alerts: PriceAlert[];
  tabs: Tab[];
  activeTabId: string;
  prices: MarketPrices;
  theme: 'vscode-dark' | 'intellij' | 'light';
  addStock: (stock: Omit<StockItem, 'id'>) => void;
  updateStock: (id: string, updates: Partial<StockItem>) => void;
  removeStock: (id: string) => void;
  addAlert: (alert: Omit<PriceAlert, 'id'>) => void;
  removeAlert: (id: string) => void;
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
  isPanicMode: boolean;
  togglePanicMode: () => void;
  
  // Phase 1 Features
  isMenuBarVisible: boolean;
  toggleMenuBar: () => void;
  timeframe: '1D' | '15m' | '30m';
  setTimeframe: (tf: '1D' | '15m' | '30m') => void;
  bottomPanelTab: 'terminal' | 'output';
  setBottomPanelTab: (tab: 'terminal' | 'output') => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
}

export const useStore = create<IdeState>()(
  persist(
    (set) => ({
      theme: 'vscode-dark',
      isPanicMode: false,
      portfolio: [
        { id: '1', name: '삼성전자', code: '005930.KS' },
        { id: '2', name: 'BTC', code: 'KRW-BTC' },
      ],
      alerts: [],
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
      addAlert: (alert) => set((state) => ({
        alerts: [...state.alerts, { ...alert, id: Date.now().toString() }]
      })),
      removeAlert: (id) => set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id)
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
      updatePrice: (code, price, changeRate, marketState) => set((state) => {
        // 가격 변동 시 알림 체크
        const newAlerts = [...state.alerts];
        let alertsChanged = false;
        
        for (let i = newAlerts.length - 1; i >= 0; i--) {
          const alert = newAlerts[i];
          if (alert.code === code) {
            let triggered = false;
            if (alert.direction === 'UP' && price >= alert.targetPrice) triggered = true;
            if (alert.direction === 'DOWN' && price <= alert.targetPrice) triggered = true;
            
            if (triggered) {
              if (typeof window !== 'undefined' && Notification.permission === 'granted') {
                new Notification('IDE-KOSPI 가격 알림', {
                  body: `${alert.name}이(가) 목표가 ${alert.targetPrice.toLocaleString()}원에 도달했습니다! (현재가: ${price.toLocaleString()})`,
                  icon: '/favicon.ico' // optional
                });
              } else if (typeof window !== 'undefined') {
                window.alert('IDE-KOSPI 가격 알림\n' + `${alert.name} 목표가 도달! (현재가: ${price.toLocaleString()})`);
              }
              newAlerts.splice(i, 1);
              alertsChanged = true;
            }
          }
        }

        return {
          prices: { ...state.prices, [code]: { price, changeRate, marketState } },
          ...(alertsChanged ? { alerts: newAlerts } : {})
        };
      }),
      sidebarWidth: 250,
      terminalHeight: 300,
      isRightPanelOpen: true, // 채팅창 기본 오픈
      rightPanelWidth: 350,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      setTerminalHeight: (height) => set({ terminalHeight: height }),
      setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
      setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
      setTheme: (theme) => set({ theme }),
      togglePanicMode: () => set((state) => ({ isPanicMode: !state.isPanicMode })),
      
      isMenuBarVisible: true,
      toggleMenuBar: () => set((state) => ({ isMenuBarVisible: !state.isMenuBarVisible })),
      timeframe: '1D',
      setTimeframe: (tf) => set({ timeframe: tf }),
      bottomPanelTab: 'terminal',
      setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
      selectedIssueId: null,
      setSelectedIssueId: (id) => set({ selectedIssueId: id }),
    }),
    {
      name: 'ide-kospi-storage-v6', // 캐시 무효화 및 새로운 기본값 적용
      partialize: (state) => ({ 
        theme: state.theme,
        portfolio: state.portfolio, 
        tabs: state.tabs, 
        activeTabId: state.activeTabId,
        sidebarWidth: state.sidebarWidth,
        terminalHeight: state.terminalHeight,
        isRightPanelOpen: state.isRightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        isMenuBarVisible: state.isMenuBarVisible,
        timeframe: state.timeframe
      }),
    }
  )
);
