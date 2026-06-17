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
    // 기존 가격 캐시를 사용하여 Alert 체크 및 MarketPrices 업데이트
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
      prices: { 
        ...state.prices, 
        [code]: { price, changeRate, marketState, changeRate15m, changeRate30m } 
      },
      ...(alertsChanged ? { alerts: newAlerts } : {})
    };
  }),
  setOnlineUsers: (count) => set({ onlineUsers: count }),
  setKimchiPremium: (value) => set({ kimchiPremium: value }),
});
