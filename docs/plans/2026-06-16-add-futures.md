# Add Futures Market Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add US Futures (Nasdaq, S&P 500, Dow) via Yahoo Finance and KOSPI 200 Futures (FUT) via Naver Finance API. Also suppress the Yahoo Finance survey notice.

**Architecture:**
1. Update `server/services/stockFetcher.ts` to suppress the `yahooSurvey` notice on `YahooFinance` initialization.
2. Update `server/services/stockFetcher.ts` to handle the `FUT` symbol by fetching from the `/api/index/FUT/basic` endpoint instead of `/api/stock/`.
3. Update `server/index.ts` to add `FUT` to `DOMESTIC_LIST` and `ES=F, NQ=F, YM=F` to `GLOBAL_LIST`.
4. Update `src/components/Editor.tsx` to ensure `FUT` and other futures are displayed with appropriate names if needed, though they will automatically be displayed if they are mapped correctly.

**Tech Stack:** Node.js, Express, React

---

### Task 1: Update API Fetcher Logic

**Files:**
- Modify: `server/services/stockFetcher.ts`

- [ ] **Step 1: Suppress Yahoo Finance Notice**

Initialize `YahooFinance` with the `suppressNotices` option:

```typescript
// Replace line: export const yahooFinance = new YahooFinance();
export const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});
```

- [ ] **Step 2: Handle `FUT` in Naver Fetcher**

Modify `fetchNaverStockBasic` to properly identify and fetch the `FUT` symbol.

```typescript
// Modify fetchNaverStockBasic start:
export async function fetchNaverStockBasic(symbol: string) {
  const cacheKey = `naver_${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ') || symbol === 'FUT';
  if (!isKorean) return fetchYahooStock(symbol);

  const codeOnly = symbol.replace('.KS', '').replace('.KQ', '');
  const apiUrl = symbol === 'FUT' 
    ? `https://m.stock.naver.com/api/index/${codeOnly}/basic`
    : `https://m.stock.naver.com/api/stock/${codeOnly}/basic`;
  
  try {
    const res = await fetch(apiUrl);
// ... rest of the function remains the same
```

- [ ] **Step 3: Commit**
```bash
git add server/services/stockFetcher.ts
git commit -m "feat: handle KOSPI futures via Naver API and suppress Yahoo notice"
```

### Task 2: Add Futures to Lists and UI

**Files:**
- Modify: `server/index.ts`
- Modify: `src/components/Editor.tsx`

- [ ] **Step 1: Add Futures to Server Lists**

Modify the lists at the top of `server/index.ts`:

```typescript
const DOMESTIC_LIST = ['005930.KS', '000660.KS', '005380.KS', '^KS11', '^KQ11', 'FUT', 'KRW=X'];
const GLOBAL_LIST = ['^IXIC', '^GSPC', '^DJI', 'NQ=F', 'ES=F', 'YM=F', 'QQQ', 'QQQM', 'SPY', 'TQQQ', 'SOXL', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'CL=F', 'ZN=F'];
```

Wait, `isKorean` check in `server/index.ts` also needs `FUT`:

```typescript
// Inside promises map in startCentralPolling:
const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ') || symbol === 'FUT';
```

- [ ] **Step 2: Add Display Names in UI**

Modify `DOMESTIC_LIST` and `GLOBAL_LIST` in `src/services/marketData.ts` to display proper names in the UI.

```typescript
// In src/services/marketData.ts
export const DOMESTIC_LIST = [
  { code: '005930.KS', name: '삼성전자' },
  { code: '000660.KS', name: 'SK하이닉스' },
  { code: '005380.KS', name: '현대차' },
  { code: '^KS11', name: 'KOSPI' },
  { code: '^KQ11', name: 'KOSDAQ' },
  { code: 'FUT', name: 'KOSPI_200_Futures' },
  { code: 'KRW=X', name: 'USD_KRW' }
];

export const GLOBAL_LIST = [
  { code: '^IXIC', name: 'NASDAQ' },
  { code: '^GSPC', name: 'S&P_500' },
  { code: '^DJI', name: 'DOW_JONES' },
  { code: 'NQ=F', name: 'NASDAQ_Futures' },
  { code: 'ES=F', name: 'S&P500_Futures' },
  { code: 'YM=F', name: 'DOW_Futures' },
  { code: 'QQQ', name: 'Invesco_QQQ' },
  { code: 'QQQM', name: 'Invesco_QQQM' },
  { code: 'SPY', name: 'SPDR_S&P_500' },
  { code: 'TQQQ', name: 'ProShares_UltraPro_QQQ' },
  { code: 'SOXL', name: 'Direxion_Daily_Semiconductor_Bull_3X' },
  { code: 'NVDA', name: 'NVIDIA' },
  { code: 'TSLA', name: 'Tesla' },
  { code: 'AAPL', name: 'Apple' },
  { code: 'BTC-USD', name: 'Bitcoin' },
  { code: 'CL=F', name: 'Crude_Oil' },
  { code: 'ZN=F', name: '10_Year_T_Note' }
];
```

- [ ] **Step 3: Commit**
```bash
git add server/index.ts src/services/marketData.ts
git commit -m "feat: add futures market data support to server and UI"
```
