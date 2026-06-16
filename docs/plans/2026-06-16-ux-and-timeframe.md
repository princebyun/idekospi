# IDE-KOSPI UX and Timeframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement drag-and-drop reordering for the portfolio in the sidebar, and implement 15m/30m timeframe change rate calculations based on server memory snapshots.

**Architecture:** 
1. The `Sidebar.tsx` will use HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) to allow reordering of portfolio items. The `useStore` will expose a `reorderPortfolio(fromIndex, toIndex)` action.
2. The server (`server/index.ts`) will maintain a `priceHistory` Map tracking prices over the last 30+ minutes. It will calculate `changeRate15m` and `changeRate30m` and broadcast them in `STOCK_UPDATE`.
3. The client `useStore` and `Editor.tsx` will consume these new change rates based on the selected `timeframe`.

**Tech Stack:** React, Zustand, TypeScript, Node.js

---

### Task 1: Portfolio Drag and Drop Reordering

**Files:**
- Modify: `src/store/useStore.ts`
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Add `reorderPortfolio` to store**

Modify `src/store/useStore.ts` to add the reorder action:

```typescript
// Add to IdeState interface:
reorderPortfolio: (fromIndex: number, toIndex: number) => void;

// Add to implementation inside `persist(set => ({ ... }))`:
reorderPortfolio: (fromIndex, toIndex) => set((state) => {
  const newPortfolio = [...state.portfolio];
  const [movedItem] = newPortfolio.splice(fromIndex, 1);
  newPortfolio.splice(toIndex, 0, movedItem);
  return { portfolio: newPortfolio };
}),
```

- [ ] **Step 2: Add Drag Events to Sidebar**

Modify `src/components/Sidebar.tsx`. Add `reorderPortfolio` to the `useStore` destructured variables. Implement local state for `draggedIndex`.

```tsx
// Inside Sidebar component:
const { openTab, activeTabId, portfolio, theme, setTheme, setSelectedIssueId, addStock, reorderPortfolio } = useStore();
const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

const handleDragStart = (e: React.DragEvent, index: number) => {
  setDraggedIndex(index);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const handleDrop = (e: React.DragEvent, dropIndex: number) => {
  e.preventDefault();
  if (draggedIndex !== null && draggedIndex !== dropIndex) {
    reorderPortfolio(draggedIndex, dropIndex);
  }
  setDraggedIndex(null);
};

// In the portfolio map:
{portfolio.map((item, index) => {
  // Add these props to the wrapping <div> for each item:
  /*
    draggable
    onDragStart={(e) => handleDragStart(e, index)}
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, index)}
  */
```

- [ ] **Step 3: Commit**
```bash
git add src/store/useStore.ts src/components/Sidebar.tsx
git commit -m "feat: implement drag and drop reordering for portfolio"
```

### Task 2: Server-Side Timeframe Snapshots

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Implement price history buffer**

Modify `server/index.ts` to store history and calculate 15m/30m change rates.

```typescript
// Inside server/index.ts, above startCentralPolling:

interface PriceSnapshot {
  timestamp: number;
  price: number;
}
const priceHistory = new Map<string, PriceSnapshot[]>();

const updateHistoryAndCalculateRates = (symbol: string, currentPrice: number, dailyChangeRate: number) => {
  const now = Date.now();
  let history = priceHistory.get(symbol) || [];
  
  // Add current price
  history.push({ timestamp: now, price: currentPrice });
  
  // Remove data older than 35 minutes to save memory
  history = history.filter(s => now - s.timestamp <= 35 * 60 * 1000);
  priceHistory.set(symbol, history);
  
  // Find closest snapshot to 15m and 30m ago
  const getOldPrice = (minutesAgo: number) => {
    const targetTime = now - minutesAgo * 60 * 1000;
    // Find the snapshot closest to the target time
    let closest = history[0];
    let minDiff = Infinity;
    for (const snap of history) {
      const diff = Math.abs(snap.timestamp - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = snap;
      }
    }
    // If the closest snapshot is too recent (e.g. within 1 minute of now when we asked for 15m), 
    // it means we don't have enough history. Fall back to current price or daily change.
    // Actually, if we don't have history, change rate is 0.
    if (now - closest.timestamp < (minutesAgo / 2) * 60 * 1000) return currentPrice;
    return closest.price;
  };

  const price15m = getOldPrice(15);
  const price30m = getOldPrice(30);

  const changeRate15m = price15m ? ((currentPrice - price15m) / price15m) * 100 : 0;
  const changeRate30m = price30m ? ((currentPrice - price30m) / price30m) * 100 : 0;

  return { changeRate15m, changeRate30m };
};
```

- [ ] **Step 2: Use calculations in broadcast**

Modify the `promises` map function in `startCentralPolling` inside `server/index.ts`:

```typescript
// Inside promises map:
          const data = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
          const { changeRate15m, changeRate30m } = updateHistoryAndCalculateRates(symbol, data.price, data.changeRate);
          return {
            symbol: data.symbol,
            price: data.price,
            changeRate: data.changeRate, // 1D
            changeRate15m,
            changeRate30m,
            marketState: data.marketState
          };
```

- [ ] **Step 3: Commit**
```bash
git add server/index.ts
git commit -m "feat: server side history buffer for 15m and 30m change rates"
```

### Task 3: Client-Side Timeframe Display

**Files:**
- Modify: `src/store/useStore.ts`
- Modify: `src/components/Editor.tsx`

- [ ] **Step 1: Update Store Interface**

Modify `MarketPrices` in `useStore.ts` to include `changeRate15m` and `changeRate30m`.
Modify `updatePrice` signature to accept them.

```typescript
export interface MarketPrices {
  [code: string]: {
    price: number;
    changeRate: number; // 1D
    changeRate15m?: number;
    changeRate30m?: number;
    marketState?: string;
  }
}
// updatePrice: (code: string, price: number, changeRate: number, marketState?: string, changeRate15m?: number, changeRate30m?: number) => void;
```
Ensure `ChatPanel.tsx` and `marketData.ts` passes the extra parameters to `updatePrice` correctly (they might need minor TS fixes).

- [ ] **Step 2: Use Timeframe in Editor**

In `src/components/Editor.tsx` `renderMarketMethod`:
```typescript
          // Determine which change rate to use based on timeframe
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
          
          // ... 
          let changeStr = marketTag + ((isProfit ? '+' : '') + displayChangeRate.toFixed(2) + '%');
```

- [ ] **Step 3: Commit**
```bash
git add src/store/useStore.ts src/components/Editor.tsx src/components/ChatPanel.tsx src/services/marketData.ts
git commit -m "feat: apply timeframe selection to UI"
```
