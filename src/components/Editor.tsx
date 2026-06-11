import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';
import { TradingViewWidget } from './TradingViewWidget';
import { SingleCodeView } from './SingleCodeView';
import { ReleaseNotesView } from './ReleaseNotesView';

export function Editor() {
  const { portfolio, tabs, activeTabId, prices, closeTab, setActiveTabId } = useStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const getMarketStatus = (title: string, code: string, apiMarketState?: string) => {
    if (title.includes('코인') || code.startsWith('KRW-')) {
      return "'24시간 거래 중입니다.'";
    }

    if (apiMarketState) {
      if (apiMarketState === 'PRE' || apiMarketState === 'PREPRE') return "'현재 프리마켓 진행 중입니다.'";
      if (apiMarketState === 'REGULAR') return "'현재 정규장이 열려있습니다.'";
      if (apiMarketState === 'POST' || apiMarketState === 'POSTPOST') return "'현재 애프터마켓 진행 중입니다.'";
      if (apiMarketState === 'CLOSED') return "'시장이 마감되었습니다.'";
    }

    // fallback
    const isDomestic = title.includes('국장') || DOMESTIC_LIST.some(i => i.code === code) || code.endsWith('.KS') || code.endsWith('.KQ');
    if (isDomestic) return "'장 상태 모니터링 중...'";

    return "'장 상태 모니터링 중...'";
  };

  const renderMarketMethod = (methodName: string, title: string, list: { code: string; name: string }[]) => {
    return (
      <div className="mb-8">
        <span className="text-code-comment pl-4">/** {title} 실시간 시세 */</span><br/>
        <span className="text-code-keyword pl-4">public async</span> <span className="text-code-function">{methodName}</span><span className="text-ide-text">() {'{'}</span><br/>
        {list.map(item => {
          const info = prices[item.code] || { price: 0, changeRate: 0 };
          const isProfit = info.changeRate > 0;
          const isLoss = info.changeRate < 0;
          let changeColor = 'text-code-string';
          if (isProfit) changeColor = 'text-[#ff9d9d]';
          if (isLoss) changeColor = 'text-[#8cb4ff]';
          
          const exchangeRate = prices['KRW=X']?.price || 1400; // 환율 미수신 시 임시값
          
          const isDomestic = title.includes('국장') || DOMESTIC_LIST.some(i => i.code === item.code) || item.code.endsWith('.KS') || item.code.endsWith('.KQ');
          const isCrypto = title.includes('코인') || item.code.startsWith('KRW-');
          const isIndex = item.code.startsWith('^') || item.code.includes('=X');
          
          let priceStr = '';
          let isString = false;
          
          if (isIndex) {
            priceStr = info.price.toLocaleString(undefined, { maximumFractionDigits: 2 });
          } else if (isDomestic || isCrypto) {
            const krwStr = `₩${info.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
            const usdPrice = info.price / exchangeRate;
            priceStr = `'${krwStr} ($${usdPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })})'`;
            isString = true;
          } else {
            const usdStr = `$${info.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
            const krwPrice = info.price * exchangeRate;
            priceStr = `'${usdStr} (₩${krwPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })})'`;
            isString = true;
          }

          const changeStr = ((isProfit ? '+' : '') + info.changeRate.toFixed(2) + '%');
          const statusText = getMarketStatus(title, item.code, info.marketState);
          
          return (
            <div key={item.code} className="transition-opacity duration-300 pl-8 pt-2 pb-3 hover:bg-[#2a2d2e] select-text">
              <span className="text-code-keyword">function</span> <span className="text-code-function">{item.name.replace(/ /g, '_')}</span><span className="text-ide-text">() {'{'} </span><br/>
              <div className="pl-8 py-1">
                <span className="text-code-variable">price</span><span className="text-ide-text">:</span> <span className={isString ? 'text-code-string' : 'text-code-number'}>{priceStr}</span><span className="text-ide-text">,</span><br/>
                <span className="text-code-variable">change</span><span className="text-ide-text">:</span> <span className={changeColor}>'{changeStr}'</span><span className="text-ide-text">,</span><br/>
                <span className="text-code-variable">status</span><span className="text-ide-text">:</span> <span className="text-code-string">{statusText}</span><br/><br/>
                <span className="text-code-keyword2">return</span><span className="text-ide-text">;</span>
              </div>
              <span className="text-ide-text">{'}'}</span><br/>
            </div>
          );
        })}
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
      <div className="h-[22px] bg-ide-bg flex items-center px-4 text-[13px] text-ide-text-muted select-none shadow-sm">
        <span>src</span>
        <span className="mx-1">›</span>
        <span>{activeTab?.type.startsWith('market') ? 'markets' : 'portfolio'}</span>
        <span className="mx-1">›</span>
        <span>{activeTab?.title}</span>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-ide-bg relative">
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
