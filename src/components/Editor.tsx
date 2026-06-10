import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';

export function Editor() {
  const { portfolio, tabs, activeTabId, prices, closeTab, setActiveTabId } = useStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  
  const getMarketStatus = (title: string) => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = hour * 100 + minute;
    
    if (title.includes('국장')) {
      if (time >= 900 && time < 1530) return "'현재 국장이 열려있습니다.'";
      return "'국장이 마감되었습니다.'";
    }
    if (title.includes('미장')) {
      if (time >= 2230 || time < 600) return "'현재 미장이 열려있습니다.'";
      return "'현재 미장 개장 전(또는 마감)입니다.'";
    }
    if (title.includes('코인')) {
      return "'24시간 거래 중입니다.'";
    }
    return "'보유 종목 모니터링 중...'";
  };

  const renderMarketMethod = (methodName: string, title: string, list: { code: string; name: string }[]) => {
    const statusText = getMarketStatus(title);

    return (
      <div className="mb-8">
        <span className="text-[#6a9955] pl-4">/** {title} 실시간 시세 */</span><br/>
        <span className="text-[#569cd6] pl-4">public async</span> <span className="text-[#dcdcaa]">{methodName}</span><span className="text-[#d4d4d4]">() {'{'}</span><br/>
        {list.map(item => {
          const info = prices[item.code] || { price: 0, changeRate: 0 };
          const isProfit = info.changeRate > 0;
          const isLoss = info.changeRate < 0;
          let changeColor = 'text-[#ce9178]';
          if (isProfit) changeColor = 'text-[#ff9d9d]';
          if (isLoss) changeColor = 'text-[#8cb4ff]';
          
          const priceStr = info.price.toLocaleString(undefined, { maximumFractionDigits: 2 });
          const changeStr = ((isProfit ? '+' : '') + info.changeRate.toFixed(2) + '%');
          
          return (
            <div key={item.code} className="transition-opacity duration-300 pl-8 pt-2 pb-3 hover:bg-[#2a2d2e] select-text">
              <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">{item.name.replace(/ /g, '_')}</span><span className="text-[#d4d4d4]">() {'{'} </span><br/>
              <div className="pl-8 py-1">
                <span className="text-[#9cdcfe]">price</span><span className="text-[#d4d4d4]">:</span> <span className="text-[#b5cea8]">{priceStr}</span><span className="text-[#d4d4d4]">,</span><br/>
                <span className="text-[#9cdcfe]">change</span><span className="text-[#d4d4d4]">:</span> <span className={changeColor}>'{changeStr}'</span><span className="text-[#d4d4d4]">,</span><br/>
                <span className="text-[#9cdcfe]">status</span><span className="text-[#d4d4d4]">:</span> <span className="text-[#ce9178]">{statusText}</span><br/><br/>
                <span className="text-[#c586c0]">return</span><span className="text-[#d4d4d4]">;</span>
              </div>
              <span className="text-[#d4d4d4]">{'}'}</span><br/>
            </div>
          );
        })}
        <span className="text-[#d4d4d4] pl-4">{'}'}</span>
      </div>
    );
  };

  const renderAllMarkets = () => {
    const totalItems = portfolio.length + DOMESTIC_LIST.length + GLOBAL_LIST.length + CRYPTO_LIST.length;
    const totalLines = 15 + (totalItems * 10); // 1 item = ~10 lines

    return (
      <div className="flex">
        <div className="text-[#858585] text-right pr-4 select-none w-12 shrink-0 border-r border-[#404040] mr-4">
          {Array.from({ length: totalLines }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="text-[#d4d4d4] whitespace-pre font-mono pb-20">
          <span className="text-[#c586c0]">export class</span> <span className="text-[#4ec9b0]">MarketDashboard</span> <span className="text-[#d4d4d4]"> {'{'}</span><br/><br/>
          
          {renderMarketMethod('getMyPortfolio', '내 관심 종목 (포트폴리오)', portfolio)}
          {renderMarketMethod('getDomesticMarket', '국내주식 (국장)', DOMESTIC_LIST)}
          {renderMarketMethod('getGlobalMarket', '해외주식 (미장)', GLOBAL_LIST)}
          {renderMarketMethod('getCryptoMarket', '가상화폐 (코인)', CRYPTO_LIST)}
          
          <span className="text-[#d4d4d4]">{'}'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tabs */}
      <div className="flex bg-[#252526] overflow-x-auto custom-scrollbar select-none">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center h-[35px] px-3 cursor-pointer border-r border-[#2d2d2d] min-w-fit
              ${activeTabId === tab.id ? 'bg-[#1e1e1e] border-t border-t-[#007acc] text-white' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2b2b2b]'}`}
          >
            <span className="mr-2 text-[10px] font-bold" style={{ color: tab.color }}>
              {tab.icon}
            </span>
            <span className="text-sm mr-2">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className={`p-0.5 rounded-md hover:bg-[#333333] ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      <div className="h-[22px] bg-[#1e1e1e] flex items-center px-4 text-[13px] text-[#969696] select-none shadow-sm">
        <span>src</span>
        <span className="mx-1">›</span>
        <span>{activeTab?.type.startsWith('market') ? 'markets' : 'portfolio'}</span>
        <span className="mx-1">›</span>
        <span>{activeTab?.title}</span>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#1e1e1e]">
        {activeTab?.type === 'markets_all' && renderAllMarkets()}

        {!activeTab && (
          <div className="h-full flex items-center justify-center text-[#858585] select-none">
            <div className="text-center">
              <div className="text-4xl mb-4">IDE-KOSPI</div>
              <div>Select a file from the explorer to view</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
