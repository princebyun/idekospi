import type { StateCreator } from 'zustand';
import type { Holding, IdeState } from '../useStore';

export interface TradingSlice {
  balance: number;
  holdings: Holding[];
  
  buyStock: (code: string, name: string, price: number, amount: number) => { success: boolean, message: string };
  sellStock: (code: string, price: number, amount: number) => { success: boolean, message: string };
}

export const createTradingSlice: StateCreator<IdeState, [], [], TradingSlice> = (set) => ({
  balance: 50000000,
  holdings: [],
  
  buyStock: (code, name, price, amount) => {
    let result = { success: false, message: '' };
    set((state) => {
      const totalCost = price * amount;
      if (state.balance < totalCost) {
        result = { success: false, message: '잔고가 부족합니다.' };
        return state;
      }
      
      const existing = state.holdings.find(h => h.code === code);
      let newHoldings;
      if (existing) {
        const newAmount = existing.amount + amount;
        const newAvgPrice = ((existing.avgPrice * existing.amount) + totalCost) / newAmount;
        newHoldings = state.holdings.map(h => h.code === code ? { ...h, amount: newAmount, avgPrice: newAvgPrice } : h);
      } else {
        newHoldings = [...state.holdings, { code, name, avgPrice: price, amount }];
      }
      
      result = { success: true, message: `${name} ${amount}주를 매수했습니다.` };
      return { balance: state.balance - totalCost, holdings: newHoldings };
    });
    return result;
  },
  
  sellStock: (code, price, amount) => {
    let result = { success: false, message: '' };
    set((state) => {
      const existing = state.holdings.find(h => h.code === code);
      if (!existing || existing.amount < amount) {
        result = { success: false, message: '보유 수량이 부족합니다.' };
        return state;
      }
      
      const totalRevenue = price * amount;
      const newAmount = existing.amount - amount;
      let newHoldings;
      if (newAmount === 0) {
        newHoldings = state.holdings.filter(h => h.code !== code);
      } else {
        newHoldings = state.holdings.map(h => h.code === code ? { ...h, amount: newAmount } : h);
      }
      
      result = { success: true, message: `${existing.name} ${amount}주를 매도했습니다.` };
      return { balance: state.balance + totalRevenue, holdings: newHoldings };
    });
    return result;
  },
});
