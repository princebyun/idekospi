import { X } from 'lucide-react';
import { MiniChart } from './MiniChart';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';
import { TradingViewWidget } from './TradingViewWidget';
import { SingleCodeView } from './SingleCodeView';
import { ReleaseNotesView } from './ReleaseNotesView';
import { TerminalHelpView } from './TerminalHelpView';
import { PolicyView } from './PolicyView';
import { IssuesView } from './IssuesView';
import { PortfolioDashboard } from './PortfolioDashboard';
import { getMarketStatusText, getMarketTag, formatPriceString } from '../utils/marketUtils';

export function Editor() {
  const { portfolio, tabs, activeTabId, prices, closeTab, setActiveTabId, timeframe, setTimeframe } = useStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const renderMarketMethod = (methodName: string, title: string, list: { code: string; name: string }[]) => {
    return (
      <div className="mb-8">
        <span className="text-code-comment pl-4">/** {title} 실시간 시세 */</span><br/>
        <span className="text-code-keyword pl-4">public async</span> <span className="text-code-function">{methodName}</span><span className="text-ide-text">() {'{'}</span><br/>
        {list.map(item => {
          const info = prices[item.code] || { price: 0, changeRate: 0 };
          
          let displayChangeRate = info.changeRate;
          if (timeframe === '15m' && info.changeRate15m !== undefined) {
            displayChangeRate = info.changeRate15m;
          } else if (timeframe === '30m' && info.changeRate30m !== undefined) {
            displayChangeRate = info.changeRate30m;
          }

          const isProfit = displayChangeRate > 0;
          const isLoss = displayChangeRate < 0;
          let changeColor = 'text-code-string';
          if (isProfit) changeColor = 'text-[#ff9d9d]';
          if (isLoss) changeColor = 'text-[#8cb4ff]';
          
          const exchangeRate = prices['KRW=X']?.price || 1400; // 환율 미수신 시 임시값
          
          const isDomestic = title.includes('국장') || DOMESTIC_LIST.some(i => i.code === item.code) || item.code.endsWith('.KS') || item.code.endsWith('.KQ');
          const isCrypto = title.includes('코인') || item.code.startsWith('KRW-');
          const isIndex = item.code.startsWith('^') || item.code.includes('=X');
          
          const { priceStr, isString } = formatPriceString(info.price, { isDomestic, isCrypto, isIndex, exchangeRate });

          const marketTag = getMarketTag(info.marketState);
          let changeStr = marketTag + ((isProfit ? '+' : '') + displayChangeRate.toFixed(2) + '%');
          const statusText = getMarketStatusText(title, item.code, info.marketState);
          
          // 김치프리미엄 계산 (코인)
          let kimchiPremiumStr = '';
          if (title.includes('코인') && item.code === 'KRW-BTC') {
            const btcKrw = prices['KRW-BTC']?.price;
            const btcUsd = prices['BTC-USD']?.price;
            const exchangeRate = prices['KRW=X']?.price || 1400;
            if (btcKrw && btcUsd) {
              const kp = ((btcKrw / exchangeRate) / btcUsd - 1) * 100;
              kimchiPremiumStr = ` // 김치프리미엄: ${kp > 0 ? '+' : ''}${kp.toFixed(2)}%`;
            }
          }
          
          // Color mapping based on Tailwind hexes used
          const chartColor = isProfit ? '#ff9d9d' : isLoss ? '#8cb4ff' : '#ce9178';
          
          return (
            <div key={item.code} className="transition-opacity duration-300 pl-8 pt-2 pb-3 hover:bg-[#2a2d2e] select-text">
              <span className="text-code-keyword">function</span> <span className="text-code-function">{item.name.replace(/ /g, '_')}</span><span className="text-ide-text">() {'{'} </span><br/>
              <div className="pl-8 py-1">
                <span className="text-code-variable">price</span><span className="text-ide-text">:</span> <span className={isString ? 'text-code-string' : 'text-code-number'}>{priceStr}</span><span className="text-ide-text">,</span><br/>
                <span className="text-code-variable">change</span><span className="text-ide-text">:</span> <span className={changeColor}>'{changeStr}'</span>
                <MiniChart symbol={item.code} color={chartColor} />
                <span className="text-ide-text">,</span><span className="text-code-comment">{kimchiPremiumStr}</span><br/>
                <span className="text-code-variable">status</span><span className="text-ide-text">:</span> <span className="text-code-string">{statusText}</span><br/><br/>
                <span className="text-code-keyword2">return</span><span className="text-ide-text">;</span>
              </div>
              <span className="text-ide-text">{'}'}</span><br/>
            </div>
          );
        })}
        {title.includes('코인') && (
          <div className="pl-8 pt-2 pb-3 hover:bg-[#2a2d2e] select-text">
            <span className="text-code-keyword">function</span> <span className="text-code-function">kimchi_premium</span><span className="text-ide-text">() {'{'} </span><br/>
            <div className="pl-8 py-1">
              <span className="text-code-variable">value</span><span className="text-ide-text">:</span> <span className="text-code-string">"{useStore.getState().kimchiPremium.toFixed(2)}%"</span><span className="text-ide-text">,</span><span className="text-code-comment ml-2">// 김치프리미엄</span><br/>
              <span className="text-code-keyword2">return</span><span className="text-ide-text">;</span>
            </div>
            <span className="text-ide-text">{'}'}</span><br/>
          </div>
        )}
        <span className="text-ide-text pl-4">{'}'}</span>
      </div>
    );
  };

  const renderAllMarkets = () => {
    const totalItems = portfolio.length + DOMESTIC_LIST.length + GLOBAL_LIST.length + CRYPTO_LIST.length;
    const totalLines = 15 + (totalItems * 10); // 1 item = ~10 lines

    return (
      <div className="flex text-[14px]">
        <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4">
          {Array.from({ length: totalLines }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="text-ide-text whitespace-pre font-mono pb-20">
          <span className="text-code-keyword2">export class</span> <span className="text-code-class">MarketDashboard</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
          
          {renderMarketMethod('getMyPortfolio', '내 관심 종목 (포트폴리오)', portfolio)}
          {renderMarketMethod('getDomesticMarket', '국내주식 (국장)', DOMESTIC_LIST)}
          {renderMarketMethod('getGlobalMarket', '해외주식 (미장)', GLOBAL_LIST)}
          {renderMarketMethod('getCryptoMarket', '가상화폐 (코인)', CRYPTO_LIST)}
          
          <span className="text-ide-text">{'}'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-ide-bg">
      {/* Timeframe Toggle (Mock Structure) */}
      <div className="flex px-4 py-2 bg-ide-sidebar border-b border-[#2d2d2d] space-x-4 items-center">
        <span className="text-ide-text-muted text-[13px]">Change Rate:</span>
        <select 
          className="bg-[#3c3c3c] text-ide-text border border-[#555] rounded px-2 py-0.5 text-xs focus:outline-none"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
        >
          <option value="1D">1D (일간)</option>
          <option value="15m">15m</option>
          <option value="30m">30m</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex bg-ide-sidebar overflow-x-auto custom-scrollbar select-none">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center h-[35px] px-3 cursor-pointer border-r border-[#2d2d2d] min-w-fit
              ${activeTabId === tab.id ? 'bg-ide-bg border-t border-t-ide-primary text-white' : 'bg-ide-tab-inactive text-ide-text-muted hover:bg-ide-hover'}`}
          >
            <span className="mr-2 text-[10px] font-bold" style={{ color: tab.color }}>
              {tab.icon}
            </span>
            <span className="text-sm mr-2">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className={`p-0.5 rounded-md hover:bg-ide-activity ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      <div className="h-[22px] bg-ide-bg flex items-center justify-between px-4 text-[13px] text-ide-text-muted select-none shadow-sm">
        <div className="flex items-center">
          <span>src</span>
          <span className="mx-1">›</span>
          <span>{activeTab?.type.startsWith('market') ? 'markets' : 'portfolio'}</span>
          <span className="mx-1">›</span>
          <span>{activeTab?.title}</span>
        </div>
        {/* Timeframe Toggle */}
        <div className="flex items-center space-x-1 text-[11px] bg-[#1e1e1e] rounded px-1 py-0.5 border border-ide-border">
          <button 
            onClick={() => setTimeframe('1D')} 
            className={`px-1.5 rounded-sm ${timeframe === '1D' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2d2d2d]'}`}
          >1D</button>
          <button 
            onClick={() => setTimeframe('15m')} 
            className={`px-1.5 rounded-sm ${timeframe === '15m' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2d2d2d]'}`}
            title="15분 단위 데이터 (추후 지원 예정)"
          >15m</button>
          <button 
            onClick={() => setTimeframe('30m')} 
            className={`px-1.5 rounded-sm ${timeframe === '30m' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2d2d2d]'}`}
            title="30분 단위 데이터 (추후 지원 예정)"
          >30m</button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-ide-bg relative">
        {activeTab?.type === 'portfolio_dashboard' && (
          <PortfolioDashboard />
        )}

        {activeTab?.type === 'markets_all' && (
          <div className="p-4">
            {renderAllMarkets()}
          </div>
        )}

        {activeTab?.type === 'code_single' && activeTab.code && (
          <SingleCodeView code={activeTab.code} title={activeTab.title} />
        )}

        {activeTab?.type === 'chart' && activeTab.code && (
          <div className="w-full h-full p-1 bg-ide-bg">
            <TradingViewWidget symbol={activeTab.code} />
          </div>
        )}

        {activeTab?.type === 'release_notes' && (
          <ReleaseNotesView />
        )}

        {activeTab?.type === 'terminal_help' && (
          <TerminalHelpView />
        )}

        {activeTab?.type === 'policy' && (
          <PolicyView />
        )}

        {activeTab?.type === 'issues_view' && (
          <IssuesView />
        )}

        {!activeTab && (
          <div className="flex items-center justify-center h-full text-ide-text-muted select-none flex-col">
            <div className="mb-4 text-center">
              <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-ide-border rounded flex items-center justify-center opacity-50">
                IDE-KOSPI
              </div>
              <p className="text-sm">종목을 선택하거나 <kbd className="bg-[#333] px-1 rounded mx-1">Ctrl+P</kbd>로 빠른 검색을 실행하세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
