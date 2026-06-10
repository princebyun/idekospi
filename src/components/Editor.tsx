import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';

export function Editor() {
  const { portfolio, tabs, activeTabId, prices, closeTab, setActiveTabId } = useStore();
  
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const renderMarketTable = (title: string, list: { code: string; name: string }[]) => (
    <div className="flex">
      <div className="text-[#858585] text-right pr-4 select-none w-12 shrink-0 border-r border-[#404040] mr-4">
        {Array.from({ length: list.length + 6 }).map((_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className="text-[#d4d4d4] whitespace-pre font-mono">
        <span className="text-[#6a9955]">// {title} 실시간 데이터</span><br/>
        <span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">marketData</span> <span className="text-[#d4d4d4]"> = {'['}</span><br/>
        <div className="pl-4">
          {list.map(item => {
            const info = prices[item.code] || { price: 0, changeRate: 0 };
            const isProfit = info.changeRate > 0;
            const isLoss = info.changeRate < 0;
            let changeColor = 'text-[#ce9178]'; // default string color
            if (isProfit) changeColor = 'text-[#ff9d9d]'; // red
            if (isLoss) changeColor = 'text-[#8cb4ff]'; // blue
            
            const priceStr = info.price.toLocaleString(undefined, { maximumFractionDigits: 2 }).padStart(12, ' ');
            const changeStr = ((isProfit ? '+' : '') + info.changeRate.toFixed(2) + '%').padStart(8, ' ');
            
            return (
              <div key={item.code} className="transition-opacity duration-300">
                <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">name:</span> <span className="text-[#ce9178]">'{item.name.padEnd(12, ' ')}'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">{priceStr}</span>, <span className="text-[#9cdcfe]">change:</span> <span className={changeColor}>'{changeStr}'</span> <span className="text-[#d4d4d4]">{'}'}</span>,
              </div>
            );
          })}
        </div>
        <span className="text-[#d4d4d4]">];</span><br/>
      </div>
    </div>
  );

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
        {activeTab?.type === 'portfolio' && (
          <div className="flex">
            {/* Line numbers */}
            <div className="text-[#858585] text-right pr-4 select-none w-12 shrink-0 border-r border-[#404040] mr-4">
              {Array.from({ length: Math.max(10, portfolio.length + 6) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            
            {/* Code content */}
            <div className="text-[#d4d4d4] font-mono whitespace-pre">
              <div className="text-[#6a9955] mb-2">/**<br/> * 내 주식 포트폴리오<br/> * 터미널에서 buy/rm 명령어로 수정 가능합니다.<br/> */</div>
              <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">myPortfolio</span> <span className="text-[#d4d4d4]"> = {'['}</span><br/>
              <div className="pl-4">
                {portfolio.map((stock) => {
                  const info = prices[stock.code];
                  const currentPrice = info ? info.price : stock.averagePrice;
                  const profitRate = ((currentPrice - stock.averagePrice) / stock.averagePrice) * 100;
                  const isProfit = profitRate > 0;
                  const isLoss = profitRate < 0;
                  
                  let commentColor = 'text-[#6a9955]';
                  if (isProfit) commentColor = 'text-[#ff9d9d]';
                  if (isLoss) commentColor = 'text-[#8cb4ff]';

                  return (
                    <div key={stock.id} className="hover:bg-[#2a2d2e] -ml-4 pl-4 py-0.5">
                      <span className="text-[#d4d4d4]">{'{'}</span>
                      <span className="text-[#9cdcfe]"> name</span>: <span className="text-[#ce9178]">'{stock.name}'</span>, 
                      <span className="text-[#9cdcfe]"> code</span>: <span className="text-[#ce9178]">'{stock.code}'</span>, 
                      <span className="text-[#9cdcfe]"> averagePrice</span>: <span className="text-[#b5cea8]">{stock.averagePrice.toLocaleString()}</span>, 
                      <span className="text-[#9cdcfe]"> quantity</span>: <span className="text-[#b5cea8]">{stock.quantity}</span>,
                      <span className="text-[#d4d4d4]">{'}'}</span>, 
                      <span className={`${commentColor} ml-4`}>// {isProfit ? '+' : ''}{profitRate.toFixed(2)}% ({currentPrice.toLocaleString()})</span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[#d4d4d4]">];</span><br/><br/>
              <span className="text-[#c586c0]">export default</span> <span className="text-[#4fc1ff]">myPortfolio</span><span className="text-[#d4d4d4]">;</span>
            </div>
          </div>
        )}

        {activeTab?.type === 'market_domestic' && renderMarketTable('국내주식 (국장)', DOMESTIC_LIST)}
        {activeTab?.type === 'market_global' && renderMarketTable('해외주식 (미장)', GLOBAL_LIST)}
        {activeTab?.type === 'market_crypto' && renderMarketTable('가상화폐 (코인)', CRYPTO_LIST)}

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
