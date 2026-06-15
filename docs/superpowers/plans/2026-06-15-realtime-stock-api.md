# Real-Time Stock API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the server to route Korean stock queries to the Naver Finance API for real-time data, while falling back to Yahoo Finance, and keep US stocks on Yahoo Finance.

**Architecture:** Create modular helper functions (`fetchNaverStockBasic`, `fetchYahooStock`) in `server/index.ts`. Use these functions in the `/api/stocks` and `/api/stock/details` endpoints. Implement a try-catch fallback mechanism inside the Naver fetcher.

**Tech Stack:** Node.js, Express, `node-fetch` (native), `yahoo-finance2`

---

### Task 1: Create API Fetch Helper Functions

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Write helper functions**

Modify `server/index.ts` to include the two helper functions below the `yahooFinance` initialization (around line 9):

```typescript
// Helper: Fetch from Yahoo
async function fetchYahooStock(symbol: string) {
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
    marketState,
    quote // 원본 quote 객체 유지 (상세 API에서 사용)
  };
}

// Helper: Fetch from Naver (with Yahoo Fallback)
async function fetchNaverStockBasic(symbol: string) {
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
    const changeRate = data.fluctuationsRatio || 0;
    
    // 한국장 시간(09:00~15:30) 기준 대략적인 상태 확인, 또는 기본값
    const marketState = 'REGULAR'; 

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
```

- [ ] **Step 2: Commit**

```bash
git add server/index.ts
git commit -m "feat: add fetchNaverStockBasic and fetchYahooStock helpers with fallback"
```

---

### Task 2: Refactor `/api/stocks` Endpoint

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Refactor the /api/stocks endpoint**

Locate `app.get('/api/stocks', ...)` and update the `promises` mapping to use the new helpers:

```typescript
app.get('/api/stocks', async (req, res) => {
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
```

- [ ] **Step 2: Test the endpoint**

Run: `curl "http://localhost:3001/api/stocks?symbols=005930.KS,AAPL"`
Expected: JSON array containing Samsung Electronics (005930.KS) and Apple (AAPL) with their prices and change rates.

- [ ] **Step 3: Commit**

```bash
git add server/index.ts
git commit -m "feat: refactor /api/stocks to use hybrid real-time fetching logic"
```

---

### Task 3: Refactor `/api/stock/details` Endpoint

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Refactor the /api/stock/details endpoint**

Locate `app.get('/api/stock/details', ...)` and update the initial fetch logic:

```typescript
app.get('/api/stock/details', async (req, res) => {
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
```

- [ ] **Step 2: Test the details endpoint**

Run: `curl "http://localhost:3001/api/stock/details?symbol=005930.KS"`
Expected: Detailed JSON response for Samsung Electronics including real-time `price`, calculated `returns`, and `investorTrend`.

- [ ] **Step 3: Commit**

```bash
git add server/index.ts
git commit -m "feat: refactor /api/stock/details to merge real-time Naver price with Yahoo historical returns"
```
