import { Info, Bell, CheckCheck, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';

export function StatusBar() {
  const prices = useStore(state => state.prices);
  
  const [tickerIndex, setTickerIndex] = useState(0);

  // 표시할 지수/대표종목 그룹
  const tickerGroups = [
    [
      { label: 'KOSPI', code: '^KS11', isCurrency: false },
      { label: 'KOSDAQ', code: '^KQ11', isCurrency: false }
    ],
    [
      { label: 'NASDAQ', code: '^IXIC', isCurrency: false },
      { label: 'S&P500', code: '^GSPC', isCurrency: false }
    ],
    [
      { label: 'USD/KRW', code: 'KRW=X', isCurrency: true },
      { label: 'BTC', code: 'KRW-BTC', isCurrency: false }
    ]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerGroups.length);
    }, 4000); // 4초마다 롤링
    return () => clearInterval(interval);
  }, [tickerGroups.length]);

  const currentGroup = tickerGroups[tickerIndex];

  return (
    <div className="h-[22px] bg-ide-primary text-white text-[11px] flex items-center justify-between px-2 select-none flex-shrink-0 cursor-default">
      <div className="flex items-center space-x-3">
        {/* 경고 아이콘 */}
        <div className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors cursor-help" title="Crypto is real-time">
          <AlertTriangle size={13} className="text-[#ffcc00]" />
          <span>현재 IDEKOSPI에 나오는 주식정보는 15분 지연된 서버에서 가져옵니다.</span>
        </div>
        
        {/* 지수 롤링 표시 */}
        <div className="flex items-center space-x-4 bg-[#1f8ad2] px-3 rounded h-[18px] min-w-[250px] transition-all duration-500 overflow-hidden relative">
          {currentGroup.map((item, idx) => {
            const data = prices[item.code];
            if (!data) return <span key={item.code} className="w-1/2 flex items-center justify-center text-ide-text animate-pulse">Loading {item.label}...</span>;
            
            const isUp = data.changeRate >= 0;
            const colorClass = isUp ? "text-[#ff9d9d]" : "text-[#8cb4ff]";
            const prefix = isUp ? '+' : '';
            const marketTag = data.marketState === 'PRE' ? '[PRE] ' : (data.marketState === 'POST' || data.marketState === 'CLOSED' ? '[AFT] ' : '');
            
            return (
              <span key={item.code} className="w-1/2 flex items-center justify-start space-x-1 animate-fade-in">
                <span className="font-semibold">{item.label}</span>
                <span>
                  {item.isCurrency ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : data.price.toLocaleString()}
                </span>
                <span className={colorClass}>
                  ({marketTag}{prefix}{data.changeRate.toFixed(2)}%)
                </span>
              </span>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors" title="This software is for demonstration only. Not for real trading.">
          <span className="text-ide-text">Not for Trading</span>
        </div>
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
