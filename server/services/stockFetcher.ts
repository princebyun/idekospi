import YahooFinance from 'yahoo-finance2';
import { getKoreanMarketState, getUSMarketState } from '../utils/marketState';

export interface StockFetchResult {
  symbol: string;
  code: string;
  price: number;
  changeRate: number;
  marketState: string;
  quote?: any;
  naverData?: any;
}

interface NaverBasicResponse {
  closePrice?: string;
  fluctuationsRatio?: string;
  [key: string]: any;
}

export const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical']
});

class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, { value: V; expiry: number }>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const item = this.cache.get(key)!;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: K, value: V, ttlMs: number) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first item in Map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { value, expiry: Date.now() + ttlMs });
  }
}

const cache = new LRUCache<string, any>(500);

function getCached(key: string) {
  return cache.get(key);
}

function setCache(key: string, data: any, ttlMs = 5000) {
  cache.set(key, data, ttlMs);
}

// Helper: Fetch from Yahoo
export async function fetchYahooStock(symbol: string): Promise<StockFetchResult> {
  const cacheKey = `yahoo_${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

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

  const result = {
    symbol,
    code: symbol.replace('.KS', '').replace('.KQ', ''),
    price: displayPrice,
    changeRate: displayChange,
    marketState: getUSMarketState(marketState),
    quote // 원본 quote 객체 유지 (상세 API에서 사용)
  };

  setCache(cacheKey, result);
  return result;
}

// Yahoo 심볼 → 네이버 인덱스 코드 매핑 (국내 지수)
const NAVER_INDEX_MAP: Record<string, string> = {
  '^KS11': 'KOSPI',
  '^KQ11': 'KOSDAQ',
};

// Helper: 한국 시장 종목/지수 판별
export function isKoreanSymbol(symbol: string): boolean {
  return symbol.endsWith('.KS') || symbol.endsWith('.KQ') || symbol === 'FUT' || symbol in NAVER_INDEX_MAP;
}

// Helper: Fetch from Naver (with Yahoo Fallback)
export async function fetchNaverStockBasic(symbol: string): Promise<StockFetchResult> {
  const cacheKey = `naver_${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!isKoreanSymbol(symbol)) return fetchYahooStock(symbol);

  // 네이버 API URL 결정
  let apiUrl: string;
  let codeOnly: string;
  const naverIndexCode = NAVER_INDEX_MAP[symbol];

  if (naverIndexCode) {
    // KOSPI/KOSDAQ 지수 → 네이버 인덱스 API
    codeOnly = symbol;
    apiUrl = `https://m.stock.naver.com/api/index/${naverIndexCode}/basic`;
  } else if (symbol === 'FUT') {
    // KOSPI200 선물
    codeOnly = 'FUT';
    apiUrl = `https://m.stock.naver.com/api/index/FUT/basic`;
  } else {
    // 일반 한국 주식 (.KS, .KQ)
    codeOnly = symbol.replace('.KS', '').replace('.KQ', '');
    apiUrl = `https://m.stock.naver.com/api/stock/${codeOnly}/basic`;
  }
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('Naver API response not ok');
    
    const data = await res.json() as NaverBasicResponse;
    
    // 네이버 데이터 파싱
    const priceStr = data.closePrice || '0';
    const price = parseFloat(priceStr.replace(/,/g, ''));
    const changeRate = parseFloat(data.fluctuationsRatio || '0');
    
    // 시간 기반으로 정확한 장 상태 판별
    const marketState = getKoreanMarketState();

    const result = {
      symbol,
      code: codeOnly,
      price,
      changeRate,
      marketState,
      naverData: data // 원본 데이터 (상세 API에서 사용)
    };

    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[Fallback] Naver API failed for ${symbol}, falling back to Yahoo:`, err);
    return fetchYahooStock(symbol); // 실패 시 야후로 폴백
  }
}
