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
        {activeTab?.type === 'portfolio' && renderMarketTable('내 관심 종목', portfolio)}

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
