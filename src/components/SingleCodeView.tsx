import { useEffect, useState } from 'react';
import { getMarketTag } from '../utils/marketUtils';
import { API_BASE_URL } from '../config/api';

interface StockDetails {
  symbol: string;
  price: number;
  changeRate: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  returns: {
    '1D': number;
    '1W': number;
    '1M': number;
    '3M': number;
    '1Y': number;
    '5Y': number;
  };
  investorTrend?: {
    individual: string;
    foreigner: string;
    institution: string;
  };
  marketState?: string;
}

export function SingleCodeView({ code, title }: { code: string, title: string }) {
  const [details, setDetails] = useState<StockDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/stock/details?symbol=${code}`);
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } catch (e) {
        console.error('Failed to fetch details', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [code]);

  const renderLines = () => {
    return Array.from({ length: 45 }).map((_, i) => <div key={i}>{i + 1}</div>);
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + '조';
    if (num >= 100000000) return (num / 100000000).toFixed(2) + '억';
    if (num >= 10000) return (num / 10000).toFixed(2) + '만';
    return num.toLocaleString();
  };

  const renderReturn = (label: string, value: number) => {
    const isProfit = value > 0;
    const isLoss = value < 0;
    let changeColor = 'text-code-string'; // orange/string color
    if (isProfit) changeColor = 'text-[#ff9d9d]';
    if (isLoss) changeColor = 'text-[#8cb4ff]';
    const prefix = isProfit ? '+' : '';
    
    return (
      <div className="pl-8 py-0.5">
        <span className="text-code-variable">"{label}"</span><span className="text-ide-text">:</span> <span className={changeColor}>'{prefix}{value.toFixed(2)}%'</span><span className="text-ide-text">,</span>
      </div>
    );
  };

  return (
    <div className="p-4 flex text-[14px]">
      <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4">
        {renderLines()}
      </div>
      <div className="text-ide-text whitespace-pre font-mono pb-20">
        <span className="text-code-comment pl-4">/** </span><br/>
        <span className="text-code-comment pl-4"> * 단일 종목 실시간 상세 분석 모듈 </span><br/>
        <span className="text-code-comment pl-4"> * 종목명: {title} ({code}) </span><br/>
        <span className="text-code-comment pl-4"> */</span><br/>
        <span className="text-code-keyword2">export class</span> <span className="text-code-class">{title.replace(/[^a-zA-Z0-9]/g, '')}Analytics</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
        
        {loading ? (
          <div className="pl-8 text-ide-text-muted">데이터를 불러오는 중입니다...</div>
        ) : details ? (
          <>
            <span className="text-code-keyword pl-8">public</span> <span className="text-code-variable">marketData</span> <span className="text-ide-text">= {'{'}</span><br/>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">현재가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.price.toLocaleString()}</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">등락률</span><span className="text-ide-text">:</span> <span className={details.changeRate > 0 ? 'text-[#ff9d9d]' : details.changeRate < 0 ? 'text-[#8cb4ff]' : 'text-code-string'}>
                '{getMarketTag(details.marketState)}{details.changeRate > 0 ? '+' : ''}{details.changeRate.toFixed(2)}%'
              </span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">시가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.open?.toLocaleString() || 'N/A'}</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">고가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.high?.toLocaleString() || 'N/A'}</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">저가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.low?.toLocaleString() || 'N/A'}</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">거래량</span><span className="text-ide-text">:</span> <span className="text-code-string">'{formatNumber(details.volume)}'</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">시가총액</span><span className="text-ide-text">:</span> <span className="text-code-string">'{formatNumber(details.marketCap)}'</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">연중_최고가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.fiftyTwoWeekHigh?.toLocaleString() || 'N/A'}</span><span className="text-ide-text">,</span>
            </div>
            <div className="pl-12 py-0.5">
              <span className="text-code-variable">연중_최저가</span><span className="text-ide-text">:</span> <span className="text-code-number">{details.fiftyTwoWeekLow?.toLocaleString() || 'N/A'}</span><span className="text-ide-text">,</span>
            </div>
            <span className="text-ide-text pl-8">{'}'};</span><br/><br/>

            <span className="text-code-comment pl-8">/** 기간별 수익률 퍼포먼스 (백테스팅 데이터) */</span><br/>
            <span className="text-code-keyword pl-8">public</span> <span className="text-code-variable">performanceReturns</span> <span className="text-ide-text">= {'{'}</span><br/>
            {renderReturn('1Day (오늘)', details.returns['1D'])}
            {renderReturn('1Week (최근 1주)', details.returns['1W'])}
            {renderReturn('1Month (최근 1달)', details.returns['1M'])}
            {renderReturn('3Month (최근 3달)', details.returns['3M'])}
            {renderReturn('1Year (최근 1년)', details.returns['1Y'])}
            {renderReturn('5Year (최근 5년)', details.returns['5Y'])}
            <span className="text-ide-text pl-8">{'}'};</span><br/><br/>
            
            {details.investorTrend && (
              <>
                <span className="text-code-comment pl-8">/** 투자자별 당일 순매수 동향 (단위: 주) */</span><br/>
                <span className="text-code-keyword pl-8">public</span> <span className="text-code-variable">investorTrend</span> <span className="text-ide-text">= {'{'}</span><br/>
                <div className="pl-12 py-0.5">
                  <span className="text-code-variable">개인</span><span className="text-ide-text">:</span> <span className={details.investorTrend.individual.startsWith('+') || !details.investorTrend.individual.startsWith('-') ? 'text-[#ff9d9d]' : 'text-[#8cb4ff]'}>'{details.investorTrend.individual}'</span><span className="text-ide-text">,</span>
                </div>
                <div className="pl-12 py-0.5">
                  <span className="text-code-variable">외국인</span><span className="text-ide-text">:</span> <span className={details.investorTrend.foreigner.startsWith('+') || !details.investorTrend.foreigner.startsWith('-') ? 'text-[#ff9d9d]' : 'text-[#8cb4ff]'}>'{details.investorTrend.foreigner}'</span><span className="text-ide-text">,</span>
                </div>
                <div className="pl-12 py-0.5">
                  <span className="text-code-variable">기관</span><span className="text-ide-text">:</span> <span className={details.investorTrend.institution.startsWith('+') || !details.investorTrend.institution.startsWith('-') ? 'text-[#ff9d9d]' : 'text-[#8cb4ff]'}>'{details.investorTrend.institution}'</span><span className="text-ide-text">,</span>
                </div>
                <span className="text-ide-text pl-8">{'}'};</span><br/><br/>
              </>
            )}

            <span className="text-code-keyword pl-8">public async</span> <span className="text-code-function">getSummary</span><span className="text-ide-text">() {'{'}</span><br/>
            <span className="text-code-keyword2 pl-12">return</span> <span className="text-code-string">'데이터 분석 및 수급 동향 확인 완료. 위장 렌더링 정상 가동 중.'</span><span className="text-ide-text">;</span><br/>
            <span className="text-ide-text pl-8">{'}'}</span><br/>
          </>
        ) : (
          <div className="pl-8 text-[#f14c4c]">데이터를 가져오는데 실패했습니다.</div>
        )}
        
        <br/>
        <span className="text-ide-text">{'}'}</span>
      </div>
    </div>
  );
}
