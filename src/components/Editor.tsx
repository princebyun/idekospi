import { useStore } from '../store/useStore';

export function Editor() {
  const { tabs, activeTabId, setActiveTabId, closeTab, portfolio } = useStore();

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
                const profitRate = ((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100;
                const isProfit = profitRate >= 0;
                const commentColor = isProfit ? 'text-[#ff8f8f]' : 'text-[#8cb4ff]'; // 빨간색(수익), 파란색(손실)
                
                return (
                  <div key={stock.id} className="pl-4">
                    <span className="text-[#d4d4d4]">{'{'}</span><br/>
                    <span className="pl-4 text-[#9cdcfe]">name:</span> <span className="text-[#ce9178]">'{stock.name}'</span>,<br/>
                    <span className="pl-4 text-[#9cdcfe]">averagePrice:</span> <span className="text-[#b5cea8]">{stock.averagePrice.toLocaleString()}</span>,<br/>
                    <span className="pl-4 text-[#9cdcfe]">quantity:</span> <span className="text-[#b5cea8]">{stock.quantity}</span>,<br/>
                    <span className="pl-4 text-[#9cdcfe]">currentPrice:</span> <span className="text-[#b5cea8]">{stock.currentPrice.toLocaleString()}</span>, <span className={commentColor}>// {isProfit ? '+' : ''}{profitRate.toFixed(2)}%</span><br/>
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
              1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
            </div>
            <div className="text-[#d4d4d4] whitespace-pre">
              <span className="text-[#6a9955]">// 15분 지연 시세 데이터</span><br/>
              <span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">getMarketData</span><span className="text-[#d4d4d4]">() {'{'}</span><br/>
              <span className="pl-4 text-[#c586c0]">return</span> <span className="text-[#d4d4d4]">{'['}</span><br/>
              <div className="pl-8">
                <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">symbol:</span> <span className="text-[#ce9178]">'삼성전자'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">81000</span>, <span className="text-[#9cdcfe]">change:</span> <span className="text-[#ff8f8f]">'+1.5%'</span> <span className="text-[#d4d4d4]">{'}'}</span>,<br/>
                <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">symbol:</span> <span className="text-[#ce9178]">'SK하이닉스'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">175000</span>, <span className="text-[#9cdcfe]">change:</span> <span className="text-[#ff8f8f]">'+2.1%'</span> <span className="text-[#d4d4d4]">{'}'}</span>,<br/>
                <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">symbol:</span> <span className="text-[#ce9178]">'NAVER'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">195000</span>, <span className="text-[#9cdcfe]">change:</span> <span className="text-[#8cb4ff]">'-0.8%'</span> <span className="text-[#d4d4d4]">{'}'}</span>,<br/>
                <span className="text-[#d4d4d4]">{'{'}</span> <span className="text-[#9cdcfe]">symbol:</span> <span className="text-[#ce9178]">'현대차'</span>, <span className="text-[#9cdcfe]">price:</span> <span className="text-[#b5cea8]">250000</span>, <span className="text-[#9cdcfe]">change:</span> <span className="text-[#ff8f8f]">'+0.5%'</span> <span className="text-[#d4d4d4]">{'}'}</span>,<br/>
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
              <span className="pl-4 text-[#dcdcaa]">@Update</span><span className="text-[#d4d4d4]">(date = </span><span className="text-[#ce9178]">"2026-06-10"</span><span className="text-[#d4d4d4]">, version = </span><span className="text-[#ce9178]">"v1.0.0"</span><span className="text-[#d4d4d4]">)</span><br/>
              <span className="pl-4 text-[#569cd6]">public</span> <span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">initProject</span><span className="text-[#d4d4d4]">() {'{\n'}</span>
              <span className="pl-8 text-[#6a9955]">// 초기 위장 뷰 구현 완료</span><br/>
              <span className="pl-8 text-[#6a9955]">// 포트폴리오 로컬 스토리지(Zustand) 연동 완료</span><br/>
              <span className="pl-8 text-[#4ec9b0]">MarketService</span><span className="text-[#d4d4d4]">.</span><span className="text-[#dcdcaa]">start</span><span className="text-[#d4d4d4]">();\n</span>
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
