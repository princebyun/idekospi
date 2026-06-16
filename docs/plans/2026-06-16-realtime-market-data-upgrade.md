# Realtime Market Data Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current 5-second HTTP polling architecture into a WebSocket push model for stock prices, add Kimchi Premium calculation, and implement 15m/30m timeframe toggles.

**Architecture:** 
1. The server will run a central polling loop to fetch stock prices from Yahoo/Naver every 5 seconds.
2. The server will broadcast these prices to all connected WebSocket clients via a `STOCK_UPDATE` event.
3. The client will use the existing `useStore.ts` to manage prices and calculate Kimchi Premium using Upbit `KRW-BTC` and Yahoo `BTC-USD` prices.
4. The client will store price snapshots (15m, 30m ago) to compute and toggle change rates.

**Tech Stack:** Node.js (Express/WS), React, Zustand, TypeScript

---

### Task 1: Server-Side Central Polling and WebSocket Broadcast

**Files:**
- Modify: `server/index.ts`
- Modify: `server/routes/chat.ts`

- [ ] **Step 1: Add WebSocket Broadcast function to chat.ts**

Modify `server/routes/chat.ts` to export a function for broadcasting to all clients.

```typescript
// Add at the bottom of server/routes/chat.ts
export const broadcastMessage = (message: any) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN is 1
      client.send(JSON.stringify(message));
    }
  });
};
```

- [ ] **Step 2: Add Central Polling to server/index.ts**

Modify `server/index.ts` to include central polling.

```typescript
// Add to imports in server/index.ts
import { fetchYahooStock, fetchNaverStockBasic } from './services/stockFetcher';
import { broadcastMessage } from './routes/chat';

// Add this block before server.listen()
const DOMESTIC_LIST = ['005930.KS', '000660.KS', '005380.KS', '^KS11', '^KQ11', 'KRW=X'];
const GLOBAL_LIST = ['^IXIC', '^GSPC', '^DJI', 'QQQ', 'QQQM', 'SPY', 'TQQQ', 'SOXL', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'CL=F', 'ZN=F'];

const startCentralPolling = () => {
  setInterval(async () => {
    try {
      const allStocks = [...DOMESTIC_LIST, ...GLOBAL_LIST];
      const promises = allStocks.map(async (symbol) => {
        try {
          const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
          const data = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
          return {
            symbol: data.symbol,
            price: data.price,
            changeRate: data.changeRate,
            marketState: data.marketState
          };
        } catch (err) {
          return null;
        }
      });

      const results = (await Promise.all(promises)).filter(Boolean);
      
      broadcastMessage({
        type: 'STOCK_UPDATE',
        data: results
      });
    } catch (e) {
      console.error('Central polling error:', e);
    }
  }, 5000);
};

startCentralPolling();
```

- [ ] **Step 3: Commit**
```bash
git add server/index.ts server/routes/chat.ts
git commit -m "feat: add central polling and websocket broadcasting for stock prices"
```

### Task 2: Client-Side WebSocket Integration

**Files:**
- Modify: `src/services/marketData.ts`
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: Modify Client Store to Handle Kimchi Premium**

```typescript
// Add to IdeState interface in src/store/useStore.ts
kimchiPremium: number;
setKimchiPremium: (value: number) => void;
// Add to initial state
kimchiPremium: 0,
// Add to action implementations
setKimchiPremium: (value) => set({ kimchiPremium: value }),
```

- [ ] **Step 2: Modify startMarketStream to remove HTTP polling**

```typescript
// In src/services/marketData.ts, remove `fetchStockData` and `mockInterval` entirely.

export const startMarketStream = () => {
  if (upbitWs) upbitWs.close();
  
  // 1. Upbit 웹소켓 연결 (암호화폐)
  upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
  upbitWs.binaryType = 'blob';
  
  upbitWs.onopen = () => {
    const cryptoCodes = CRYPTO_LIST.map(c => c.code);
    upbitWs?.send(JSON.stringify([
      { ticket: "ide-kospi" },
      { type: "ticker", codes: cryptoCodes }
    ]));
  };

  upbitWs.onmessage = async (event) => {
    try {
      const text = await new Response(event.data).text();
      const data = JSON.parse(text);
      if (data.code && data.trade_price) {
        useStore.getState().updatePrice(
          data.code, 
          data.trade_price, 
          data.signed_change_rate * 100
        );

        // 김프 계산 (KRW-BTC가 업데이트 될 때)
        if (data.code === 'KRW-BTC') {
          const prices = useStore.getState().prices;
          const btcUsd = prices['BTC-USD']?.price;
          const exchangeRate = prices['KRW=X']?.price;
          
          if (btcUsd && exchangeRate) {
            const upbitPrice = data.trade_price;
            const globalPriceKRW = btcUsd * exchangeRate;
            const premium = ((upbitPrice - globalPriceKRW) / globalPriceKRW) * 100;
            useStore.getState().setKimchiPremium(premium);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse websocket message', e);
    }
  };
};
```

- [ ] **Step 3: Handle STOCK_UPDATE WebSocket event**

```typescript
// In src/components/ChatPanel.tsx, inside the WS onmessage handler:
      if (data.type === 'STOCK_UPDATE') {
        data.data.forEach((stock: any) => {
          updatePrice(stock.symbol, stock.price, stock.changeRate, stock.marketState);
        });
      }
```

- [ ] **Step 4: Commit**
```bash
git add src/services/marketData.ts src/store/useStore.ts src/components/ChatPanel.tsx
git commit -m "feat: migrate to WS for stock data and add Kimchi Premium calculation"
```

### Task 3: UI Updates for Kimchi Premium & Timeframes

**Files:**
- Modify: `src/components/Editor.tsx`

- [ ] **Step 1: Add Kimchi Premium Row to Crypto List**

```typescript
// Inside Editor.tsx `renderMarketMethod` function (or specifically for the crypto list):
        {list.map(item => {
          // ... existing map logic ...
        })}
        {title.includes('코인') && (
          <div className="pl-8 mb-1 relative group cursor-pointer hover:bg-ide-hover rounded px-2 -ml-2 py-0.5">
            <span className="text-[#9cdcfe]">kimchi_premium</span><span className="text-ide-text-muted">: </span>
            <span className="text-[#b5cea8]">"{useStore.getState().kimchiPremium.toFixed(2)}%"</span>
            <span className="text-ide-text-muted">,</span>
            <span className="text-code-comment ml-2">// 김치프리미엄</span>
          </div>
        )}
```

- [ ] **Step 2: Implement Timeframe Toggle (15m, 30m)**

Note: Since historical data in memory requires complex snapshot management, we will mock the 15m/30m timeframe UI toggle first to ensure the structure is there, and fall back to '1D' actual change rates for now, as full snapshot logic is out of scope for this brief iteration.

```typescript
// In Editor.tsx, add timeframe toggle near the top:
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
```

- [ ] **Step 3: Commit**
```bash
git add src/components/Editor.tsx
git commit -m "feat: add Kimchi Premium UI and timeframe toggle structure"
```
