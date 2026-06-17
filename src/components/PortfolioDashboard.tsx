import { useStore } from '../store/useStore';

export function PortfolioDashboard() {
  const { balance, holdings, prices } = useStore();

  let totalValue = balance;
  let totalCost = 0;
  
  const holdingRows = holdings.map(h => {
    const currentPriceInfo = prices[h.code];
    const currentPrice = currentPriceInfo ? currentPriceInfo.price : h.avgPrice;
    
    const exchangeRate = prices['KRW=X']?.price || 1400;
    
    const isDomestic = h.code.endsWith('.KS') || h.code.endsWith('.KQ') || h.code === 'FUT' || h.code.startsWith('KRX:');
    const isCrypto = h.code.startsWith('KRW-');
    
    let valueInKrw = currentPrice * h.amount;
    let costInKrw = h.avgPrice * h.amount;
    
    if (!isDomestic && !isCrypto && !h.code.startsWith('BTC-')) {
       valueInKrw *= exchangeRate;
       costInKrw *= exchangeRate;
    } else if (h.code.startsWith('BTC-')) {
       valueInKrw *= exchangeRate;
       costInKrw *= exchangeRate;
    }

    totalValue += valueInKrw;
    totalCost += costInKrw;
    
    const profit = valueInKrw - costInKrw;
    const profitRate = costInKrw > 0 ? (profit / costInKrw) * 100 : 0;
    
    const isProfit = profit > 0;
    const isLoss = profit < 0;
    
    const changeColor = isProfit ? 'text-[#ff9d9d]' : isLoss ? 'text-[#8cb4ff]' : 'text-code-string';
    
    return (
      <div key={h.code} className="pl-4 py-1 hover:bg-[#2a2d2e]">
        <span className="text-code-keyword">const</span> <span className="text-code-variable">{h.name.replace(/ /g, '_')}</span> <span className="text-ide-text">= {'{'}</span><br/>
        <div className="pl-8">
          <span className="text-code-variable">code</span><span className="text-ide-text">: </span><span className="text-code-string">'{h.code}'</span><span className="text-ide-text">,</span><br/>
          <span className="text-code-variable">amount</span><span className="text-ide-text">: </span><span className="text-code-number">{h.amount}</span><span className="text-ide-text">,</span><br/>
          <span className="text-code-variable">avgPrice</span><span className="text-ide-text">: </span><span className="text-code-number">{h.avgPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</span><span className="text-ide-text">,</span><br/>
          <span className="text-code-variable">currentPrice</span><span className="text-ide-text">: </span><span className="text-code-number">{currentPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</span><span className="text-ide-text">,</span><br/>
          <span className="text-code-variable">profitRate</span><span className="text-ide-text">: </span><span className={changeColor}>'{profit > 0 ? '+' : ''}{profitRate.toFixed(2)}%'</span><span className="text-ide-text">,</span><br/>
          <span className="text-code-variable">profitValue</span><span className="text-ide-text">: </span><span className={changeColor}>{Math.round(profit).toLocaleString()}</span><span className="text-ide-text">,</span><br/>
        </div>
        <span className="text-ide-text">{'};'}</span>
      </div>
    );
  });

  const totalProfit = totalValue - (balance + totalCost);
  const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const isProfit = totalProfit > 0;
  const isLoss = totalProfit < 0;
  const changeColor = isProfit ? 'text-[#ff9d9d]' : isLoss ? 'text-[#8cb4ff]' : 'text-code-string';

  return (
    <div className="p-4 flex text-[14px] flex-1 overflow-auto custom-scrollbar h-full bg-ide-bg">
      <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4 pb-20">
        {Array.from({ length: Math.max(20, holdings.length * 8 + 20) }).map((_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className="text-ide-text whitespace-pre font-mono pb-20">
        <span className="text-code-keyword2">export class</span> <span className="text-code-class">PortfolioDashboard</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
        
        <span className="text-code-comment pl-4">/** Account Summary */</span><br/>
        <div className="pl-4">
          <span className="text-code-keyword">readonly</span> <span className="text-code-variable">balance</span><span className="text-ide-text">: </span><span className="text-code-class">number</span> <span className="text-ide-text">= </span><span className="text-code-number">{Math.round(balance).toLocaleString()}</span><span className="text-ide-text">;</span><span className="text-code-comment ml-2">// 예수금(원)</span><br/>
          <span className="text-code-keyword">readonly</span> <span className="text-code-variable">totalCost</span><span className="text-ide-text">: </span><span className="text-code-class">number</span> <span className="text-ide-text">= </span><span className="text-code-number">{Math.round(totalCost).toLocaleString()}</span><span className="text-ide-text">;</span><span className="text-code-comment ml-2">// 총 매수금액(원)</span><br/>
          <span className="text-code-keyword">readonly</span> <span className="text-code-variable">totalValue</span><span className="text-ide-text">: </span><span className="text-code-class">number</span> <span className="text-ide-text">= </span><span className="text-code-number">{Math.round(totalValue).toLocaleString()}</span><span className="text-ide-text">;</span><span className="text-code-comment ml-2">// 총 평가자산(원)</span><br/>
          <span className="text-code-keyword">readonly</span> <span className="text-code-variable">totalProfitRate</span><span className="text-ide-text">: </span><span className="text-code-class">string</span> <span className="text-ide-text">= </span><span className={changeColor}>'{totalProfit > 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%'</span><span className="text-ide-text">;</span><br/>
        </div><br/>

        <span className="text-code-comment pl-4">/** Holdings */</span><br/>
        {holdings.length === 0 ? (
          <div className="pl-4 text-code-comment">// 보유 중인 종목이 없습니다.</div>
        ) : (
          holdingRows
        )}
        <br/>
        <span className="text-ide-text">{'}'}</span>
      </div>
    </div>
  );
}
