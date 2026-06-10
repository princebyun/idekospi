import { useStore } from '../store/useStore';

export function Editor() {
  const { tabs, activeTabId, setActiveTabId, closeTab, portfolio, prices } = useStore();

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Editor Tabs */}
      <div className="flex bg-[#2d2d2d] text-[13px] overflow-x-auto flex-shrink-0 scrollbar-hide">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-4 py-2 cursor-pointer flex items-center min-w-[120px] select-none group border-t-2 ${
              activeTabId === tab.id 
                ? 'bg-[#1e1e1e] border-[#007acc] text-[#ffffff]' 
                : 'text-[#969696] hover:bg-[#1e1e1e] border-transparent'
            }`}
          >
            <span style={{ color: tab.color }} className="mr-2 text-xs font-bold">{tab.icon}</span>{tab.title}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`ml-auto rounded-md hover:bg-[#333333] px-1 text-xs ${activeTabId === tab.id ? 'text-[#858585] hover:text-white' : 'opacity-0 group-hover:opacity-100 text-[#858585] hover:text-white'}`}
            >✕</span>
          </div>
        ))}
      </div>
      
      {/* Breadcrumbs */}
      <div className="px-4 py-1.5 text-[12px] text-[#969696] border-b border-[#2b2b2b] flex items-center flex-shrink-0 shadow-sm select-none">
        IDE-KOSPI <span className="mx-2 text-[#6e6e6e]">&gt;</span> src <span className="mx-2 text-[#6e6e6e]">&gt;</span> {activeTab?.title || 'Welcome'}
      </div>
      
      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[14px] leading-relaxed">
        {activeTab?.type === 'portfolio' && (
          <div className="flex">
            <div className="text-[#858585] text-right pr-4 select-none w-10 shrink-0">
              {Array.from({ length: Math.max(10, portfolio.length * 7 + 4) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="text-[#d4d4d4] whitespace-pre">
              <span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">myPortfolio</span> <span className="text-[#d4d4d4]"> = {'['}</span>
              {portfolio.map((stock) => {
                const marketInfo = prices[stock.code] || { price: stock.averagePrice, changeRate: 0 };
                const currentPrice = marketInfo.price;
                const profitRate = stock.averagePrice > 0 ? ((currentPrice - stock.averagePrice) / stock.averagePrice) * 100 : 0;
                const isProfit = profitRate >= 0;
                const commentColor = isProfit ? 'text-[#ff8f8f]' : 'text-[#8cb4ff]'; // 빨간색(수익), 파란색(손실)
                
                return (
                  <div key={stock.id} className="pl-4">
                    <span className="text-[#d4d4d4]">{'{'}</span><br/>
                    <span className="pl-4 text-[#9cdcfe]">code:</span> <span className="text-[#ce9178]">'{stock.code}'</span>, <span className="text-[#6a9955]">// {stock.name}</span><br/>
                    <span className="pl-4 text-[#9cdcfe]">averagePrice:</span> <span className="text-[#b5cea8]">{stock.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>,<br/>
                    <span className="pl-4 text-[#9cdcfe]">quantity:</span> <span className="text-[#b5cea8]">{stock.quantity}</span>,<br/>
                    <span className="pl-4 text-[#9cdcfe]">currentPrice:</span> <span className="text-[#b5cea8]">{currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>, <span className={commentColor}>// {isProfit ? '+' : ''}{profitRate.toFixed(2)}%</span><br/>
                    <span className="text-[#d4d4d4]">{'}'}</span>,
                  </div>
                );
              })}
              <span className="text-[#d4d4d4]">];</span>
            </div>
          </div>
        )}

        {activeTab?.type === 'market' && (
          <div className="flex">
            <div className="text-[#858585] text-right pr-4 select-none w-10 shrink-0">
              {Array.from({ length: Math.max(10, Object.keys(prices).length + 6) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="text-[#d4d4d4] whitespace-pre">
              <span className="text-[#6a9955]">// 실시간 시세 (Upbit WebSocket + 주식 Mock)</span><br/>
              <span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">getMarketData</span><span className="text-[#d4d4d4]">() {'{'}</span><br/>
              <span className="pl-4 text-[#c586c0]">return</span> <span className="text-[#d4d4d4]">{'['}</span><br/>
              <div className="pl-8">
                {Object.entries(prices).map(([code, info]) => {
                  const isProfit = info.changeRate >= 0;
                  const changeColor = isProfit ? 'text-[#ff8f8f]' : 'text-[#8cb4ff]';
                  return (
                    <div key={code} className="transition-opacity duration-300">
                      <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">code:</span> <span className="text-[#ce9178]">'{code.padEnd(10, ' ')}'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">{info.price.toLocaleString(undefined, { maximumFractionDigits: 2 }).padStart(10, ' ')}</span>, <span className="text-[#9cdcfe]">change:</span> <span className={changeColor}>'{isProfit ? '+' : ''}{info.changeRate.toFixed(2)}%'</span> <span className="text-[#d4d4d4]">{'}'}</span>,
                    </div>
                  );
                })}
              </div>
              <span className="pl-4 text-[#d4d4d4]">];</span><br/>
              <span className="text-[#d4d4d4]">{'}'}</span>
            </div>
          </div>
        )}

        {activeTab?.type === 'patchnotes' && (
          <div className="flex">
            <div className="text-[#858585] text-right pr-4 select-none w-10 shrink-0">
              1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
            </div>
            <div className="text-[#d4d4d4] whitespace-pre">
              <span className="text-[#569cd6]">public</span> <span className="text-[#569cd6]">class</span> <span className="text-[#4ec9b0]">ReleaseNotes</span> <span className="text-[#d4d4d4]">{'{\n'}</span>
              <span className="pl-4 text-[#dcdcaa]">@Update</span><span className="text-[#d4d4d4]">(date = </span><span className="text-[#ce9178]">"2026-06-10"</span><span className="text-[#d4d4d4]">, version = </span><span className="text-[#ce9178]">"v1.1.0"</span><span className="text-[#d4d4d4]">)</span><br/>
              <span className="pl-4 text-[#569cd6]">public</span> <span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">liveMarketStream</span><span className="text-[#d4d4d4]">() {'{\n'}</span>
              <span className="pl-8 text-[#6a9955]">// 업비트 웹소켓을 이용한 코인 실시간 시세 연동</span><br/>
              <span className="pl-8 text-[#6a9955]">// 상태창 및 에디터에 가격 실시간 깜빡임 적용</span><br/>
              <span className="pl-8 text-[#4ec9b0]">WebSocketService</span><span className="text-[#d4d4d4]">.</span><span className="text-[#dcdcaa]">connect</span><span className="text-[#d4d4d4]">();\n</span>
              <span className="pl-4 text-[#d4d4d4]">{'}\n'}</span>
              <span className="text-[#d4d4d4]">{'}'}</span>
            </div>
          </div>
        )}
        
        {!activeTab && (
          <div className="flex items-center justify-center h-full text-[#858585] text-4xl font-bold opacity-10 select-none">
            IDE-KOSPI
          </div>
        )}
      </div>
    </div>
  );
}
