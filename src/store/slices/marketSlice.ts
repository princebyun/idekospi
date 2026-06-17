import type { StateCreator } from 'zustand';
import type { MarketPrices, IdeState } from '../useStore';

export interface MarketSlice {
  prices: MarketPrices;
  timeframe: '1D' | '15m' | '30m';
  onlineUsers: number;
  kimchiPremium: number;
  
  setTimeframe: (tf: '1D' | '15m' | '30m') => void;
  updatePrice: (code: string, price: number, changeRate: number, marketState?: string, changeRate15m?: number, changeRate30m?: number) => void;
  setOnlineUsers: (count: number) => void;
  setKimchiPremium: (value: number) => void;
}

export const createMarketSlice: StateCreator<IdeState, [], [], MarketSlice> = (set) => ({
  prices: {},
  timeframe: '1D',
  onlineUsers: 1,
  kimchiPremium: 0,
  
  setTimeframe: (tf) => set({ timeframe: tf }),
  updatePrice: (code, price, changeRate, marketState, changeRate15m, changeRate30m) => set((state) => {
    const newAlerts = [...state.alerts];
    const newHistories = [];
    let alertsChanged = false;
    
    for (let i = newAlerts.length - 1; i >= 0; i--) {
      const alert = newAlerts[i];
      if (alert.code === code) {
        let triggered = false;
        if (alert.direction === 'UP' && price >= alert.targetPrice) triggered = true;
        if (alert.direction === 'DOWN' && price <= alert.targetPrice) triggered = true;
        
        if (triggered) {
          const message = `${alert.name}이(가) 목표가 ${alert.targetPrice.toLocaleString()}원에 도달했습니다! (현재가: ${price.toLocaleString()})`;
          
          if (typeof window !== 'undefined' && Notification.permission === 'granted') {
            new Notification('IDE-KOSPI 가격 알림', {
              body: message,
              icon: '/favicon.ico' // optional
            });
          } else if (typeof window !== 'undefined') {
            window.alert(`IDE-KOSPI 가격 알림\n${message}`);
          }
          
          newHistories.push({
            id: Date.now().toString() + Math.random().toString(),
            timestamp: Date.now(),
            message,
            type: alert.direction
          });
          
          newAlerts.splice(i, 1);
          alertsChanged = true;
        }
      }
    }

    const stateUpdates: any = {
      prices: { 
        ...state.prices, 
        [code]: { price, changeRate, marketState, changeRate15m, changeRate30m } 
      }
    };
    
    if (alertsChanged) {
      stateUpdates.alerts = newAlerts;
      stateUpdates.alertHistory = [...newHistories, ...state.alertHistory].slice(0, 100);
    }
    
    return stateUpdates;
  }),
  setOnlineUsers: (count) => set({ onlineUsers: count }),
  setKimchiPremium: (value) => set({ kimchiPremium: value }),
});
