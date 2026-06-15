import { Router } from 'express';
import { fetchYahooStock, fetchNaverStockBasic, yahooFinance } from '../services/stockFetcher';

const router = Router();

router.get('/api/stocks', async (req, res) => {
  try {
    const symbolsParam = req.query.symbols as string;
    const symbols = symbolsParam ? symbolsParam.split(',') : ['005930.KS', '000660.KS', '035420.KS', 'AAPL'];
    
    const promises = symbols.map(async (symbol) => {
      try {
        const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
        const data = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
        
        return {
          symbol: data.symbol,
          code: data.code,
          price: data.price,
          changeRate: data.changeRate,
          marketState: data.marketState
        };
      } catch (err) {
        console.error(`Failed to fetch ${symbol}:`, err);
        return null;
      }
    });

    const results = (await Promise.all(promises)).filter(Boolean);
    res.json(results);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

router.get('/api/stock/details', async (req, res) => {
  try {
    const symbol = req.query.symbol as string;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
    
    // 1. 현재 가격 데이터 가져오기 (Naver 또는 Yahoo)
    const currentData = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
    const currentPrice = currentData.price;
    const displayChange = currentData.changeRate;
    const marketState = currentData.marketState;

    // 2. 야후 파이낸스에서 과거 데이터(History) 가져오기 (수익률 계산용)
    const now = new Date();
    const period1 = new Date();
    period1.setFullYear(now.getFullYear() - 5);
    
    let history: any[] = [];
    try {
      history = await yahooFinance.historical(symbol, { period1, period2: now, interval: '1d' });
    } catch (e) {
      console.error('Failed to fetch history for', symbol);
    }
    
    const getReturnRate = (daysAgo: number) => {
      if (history.length === 0 || currentPrice === 0) return 0;
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - daysAgo);
      
      let closest = history[0];
      let minDiff = Infinity;
      
      for (const h of history) {
        const diff = Math.abs(h.date.getTime() - targetDate.getTime());
        if (diff < minDiff && h.date.getTime() <= targetDate.getTime()) {
          minDiff = diff;
          closest = h;
        }
      }
      
      if (!closest || !closest.close) return 0;
      return ((currentPrice - closest.close) / closest.close) * 100;
    };

    // 3. 네이버 수급 데이터 가져오기 (한국 주식만)
    let investorTrend = null;
    if (isKorean) {
      const codeOnly = currentData.code;
      try {
        const naverRes = await fetch(`https://m.stock.naver.com/api/stock/${codeOnly}/integration`);
        if (naverRes.ok) {
          const naverData = await naverRes.json();
          if (naverData.dealTrendInfos && naverData.dealTrendInfos.length > 0) {
            const todayTrend = naverData.dealTrendInfos[0];
            investorTrend = {
              individual: todayTrend.individualPureBuyQuant,
              foreigner: todayTrend.foreignerPureBuyQuant,
              institution: todayTrend.organPureBuyQuant,
            };
          }
        }
      } catch (err) {
        console.error('Failed to fetch naver trend', err);
      }
    }

    // 4. 상세 메타데이터 조합
    let open = 0, high = 0, low = 0, volume = 0, marketCap = 0, fiftyTwoWeekHigh = 0, fiftyTwoWeekLow = 0;
    
    if (isKorean && currentData.naverData) {
      const nd = currentData.naverData;
      open = parseFloat((nd.openPrice || '0').replace(/,/g, ''));
      high = parseFloat((nd.highPrice || '0').replace(/,/g, ''));
      low = parseFloat((nd.lowPrice || '0').replace(/,/g, ''));
      volume = nd.accumulatedTradingVolume || 0;
      marketCap = nd.marketSum ? nd.marketSum * 100000000 : 0; // 억원 단위 변환
    } else if (currentData.quote) {
      const q = currentData.quote;
      open = q.regularMarketOpen || 0;
      high = q.regularMarketDayHigh || 0;
      low = q.regularMarketDayLow || 0;
      volume = q.regularMarketVolume || 0;
      marketCap = q.marketCap || 0;
      fiftyTwoWeekHigh = q.fiftyTwoWeekHigh || 0;
      fiftyTwoWeekLow = q.fiftyTwoWeekLow || 0;
    }

    res.json({
      symbol,
      price: currentPrice,
      changeRate: displayChange,
      marketState: marketState,
      open,
      high,
      low,
      volume,
      marketCap,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      returns: {
        '1D': displayChange,
        '1W': getReturnRate(7),
        '1M': getReturnRate(30),
        '3M': getReturnRate(90),
        '1Y': getReturnRate(365),
        '5Y': getReturnRate(365 * 5),
      },
      investorTrend
    });
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});

router.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    
    const result = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 15
    });
    
    const formatted = result.quotes.map((q: any) => ({
      code: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      type: q.quoteType,
      exchange: q.exchDisp
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/api/chart', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') return res.status(400).json({ error: 'Symbol required' });

  try {
    const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
    let querySymbol = isKorean ? symbol : symbol.toUpperCase();
    
    // Upbit 심볼(KRW-BTC)을 Yahoo 심볼(BTC-KRW)로 변환
    if (querySymbol.startsWith('KRW-')) {
      querySymbol = querySymbol.replace('KRW-', '') + '-KRW';
    }
    
    // 최근 7일 데이터 (sparkline 용)
    const result = await yahooFinance.chart(querySymbol, {
      period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      interval: '1d'
    });
    
    if (result && result.quotes && result.quotes.length > 0) {
      const prices = result.quotes.map((q: any) => q.close).filter((p: any) => p !== null);
      res.json({ prices });
    } else {
      res.json({ prices: [] });
    }
  } catch (e) {
    console.error('Chart fetch error:', e);
    res.status(500).json({ error: 'Chart fetch failed' });
  }
});

export default router;
