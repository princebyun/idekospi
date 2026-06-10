import { Info, Bell, CheckCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export function StatusBar() {
  const prices = useStore(state => state.prices);
  
  const btc = prices['KRW-BTC'];
  const ss = prices['005930'];
  const aapl = prices['AAPL'];

  return (
    <div className="h-[22px] bg-[#007acc] text-white text-[11px] flex items-center justify-between px-2 select-none flex-shrink-0 cursor-default">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors" title="Crypto: Upbit WS / Stocks: Yahoo Finance API (Live)">
          <Info size={13} />
          <span>Real-time Stream Connected (Live)</span>
        </div>
        <div className="flex items-center space-x-3 bg-[#1f8ad2] px-2 rounded h-full py-0.5">
          {ss && <span>삼성전자: {ss.price.toLocaleString()} <span className={ss.changeRate >= 0 ? "text-[#ff9d9d]" : "text-[#8cb4ff]"}>({ss.changeRate >= 0 ? '+' : ''}{ss.changeRate.toFixed(2)}%)</span></span>}
          {aapl && <span>AAPL: ${aapl.price.toLocaleString()} <span className={aapl.changeRate >= 0 ? "text-[#ff9d9d]" : "text-[#8cb4ff]"}>({aapl.changeRate >= 0 ? '+' : ''}{aapl.changeRate.toFixed(2)}%)</span></span>}
          {btc && <span>BTC: {btc.price.toLocaleString()} <span className={btc.changeRate >= 0 ? "text-[#ff9d9d]" : "text-[#8cb4ff]"}>({btc.changeRate >= 0 ? '+' : ''}{btc.changeRate.toFixed(2)}%)</span></span>}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center space-x-1 transition-colors">
          <CheckCheck size={13} />
          <span>Prettier</span>
        </div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">UTF-8</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">TypeScript React</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center transition-colors">
          <Bell size={13} />
        </div>
      </div>
    </div>
  );
}
