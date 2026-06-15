import YahooFinance from 'yahoo-finance2';
import { getKoreanMarketState, getUSMarketState } from '../utils/marketState';

export const yahooFinance = new YahooFinance();

// Helper: Fetch from Yahoo
export async function fetchYahooStock(symbol: string) {
  const quote = await yahooFinance.quote(symbol);
  let displayPrice = quote.regularMarketPrice || 0;
  let displayChange = quote.regularMarketChangePercent || 0;
  const marketState = quote.marketState || 'REGULAR';
  
  if (marketState === 'PRE' && quote.preMarketPrice) {
    displayPrice = quote.preMarketPrice;
    displayChange = quote.preMarketChangePercent || 0;
  } else if ((marketState === 'POST' || marketState === 'CLOSED') && quote.postMarketPrice) {
    displayPrice = quote.postMarketPrice;
    displayChange = quote.postMarketChangePercent || 0;
  }

  return {
    symbol,
    code: symbol.replace('.KS', '').replace('.KQ', ''),
    price: displayPrice,
    changeRate: displayChange,
    marketState: getUSMarketState(marketState),
    quote // 원본 quote 객체 유지 (상세 API에서 사용)
  };
}

// Helper: Fetch from Naver (with Yahoo Fallback)
export async function fetchNaverStockBasic(symbol: string) {
  const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
  if (!isKorean) return fetchYahooStock(symbol);

  const codeOnly = symbol.replace('.KS', '').replace('.KQ', '');
  
  try {
    const res = await fetch(`https://m.stock.naver.com/api/stock/${codeOnly}/basic`);
    if (!res.ok) throw new Error('Naver API response not ok');
    
    const data = await res.json();
    
    // 네이버 데이터 파싱
    const priceStr = data.closePrice || '0';
    const price = parseFloat(priceStr.replace(/,/g, ''));
    const changeRate = parseFloat(data.fluctuationsRatio || '0');
    
    // 시간 기반으로 정확한 장 상태 판별
    const marketState = getKoreanMarketState();

    return {
      symbol,
      code: codeOnly,
      price,
      changeRate,
      marketState,
      naverData: data // 원본 데이터 (상세 API에서 사용)
    };
  } catch (err) {
    console.warn(`[Fallback] Naver API failed for ${symbol}, falling back to Yahoo:`, err);
    return fetchYahooStock(symbol); // 실패 시 야후로 폴백
  }
}
