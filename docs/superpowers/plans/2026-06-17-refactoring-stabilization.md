# Phase 4 Refactoring and Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor frontend state management, modularize large UI components, stabilize the Node.js backend proxy, and enforce strict TypeScript typings.

**Architecture:** 
- Frontend: Zustand selectors for fine-grained reactivity, React component composition for modularity.
- Backend: Global exception handlers and persistent file logging via a custom logger.
- Types: Concrete TypeScript interfaces replacing `any`.

**Tech Stack:** React, Zustand, Node.js, Express, TypeScript.

---

### Task 1: Frontend State Management Optimization

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/StatusBar.tsx`
- Modify: `src/components/ChatPanel.tsx`

- [ ] **Step 1: Refactor App.tsx to use selectors**
Modify `src/App.tsx` to prevent re-rendering when unrelated store values change.
```tsx
// Instead of: const { isRightPanelOpen, setIsRightPanelOpen, ... } = useStore();
const isRightPanelOpen = useStore(state => state.isRightPanelOpen);
const setIsRightPanelOpen = useStore(state => state.setIsRightPanelOpen);
// ... do this for all used state variables
```

- [ ] **Step 2: Refactor StatusBar.tsx and ChatPanel.tsx**
Apply the same selector pattern to these components.

- [ ] **Step 3: Verify build**
Run: `npm run build`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add src/App.tsx src/components/StatusBar.tsx src/components/ChatPanel.tsx
git commit -m "refactor: optimize zustand state selectors in core components"
```

### Task 2: UI Component Modularization (ExplorerView)

**Files:**
- Create: `src/components/sidebar/StockItemNode.tsx`
- Modify: `src/components/sidebar/ExplorerView.tsx`

- [ ] **Step 1: Create StockItemNode component**
Extract the `renderStockItem` logic from `ExplorerView.tsx` into a standalone component.
```tsx
import { useStore, StockItem } from '../../store/useStore';

interface Props {
  item: StockItem;
  paddingLeft: string;
  isDragged: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

export function StockItemNode({ item, paddingLeft, isDragged, onDragStart, onDragEnd }: Props) {
  const openTab = useStore(state => state.openTab);
  const activeTabId = useStore(state => state.activeTabId);
  const removeStock = useStore(state => state.removeStock);
  // ... implementation
}
```

- [ ] **Step 2: Refactor ExplorerView to use StockItemNode**
Replace `renderStockItem` usage with `<StockItemNode />`.

- [ ] **Step 3: Verify build**
Run: `npm run build`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/sidebar/StockItemNode.tsx src/components/sidebar/ExplorerView.tsx
git commit -m "refactor: modularize ExplorerView by extracting StockItemNode"
```

### Task 3: Backend Proxy Server Stabilization

**Files:**
- Create: `server/utils/logger.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Create logger utility**
```ts
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const logger = {
  error: (msg: string, err?: any) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ERROR: ${msg} ${err ? err.stack || err : ''}\n`;
    console.error(log);
    fs.appendFileSync(path.join(logDir, 'error.log'), log);
  },
  info: (msg: string) => {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] INFO: ${msg}\n`;
    console.log(log);
    fs.appendFileSync(path.join(logDir, 'server.log'), log);
  }
};
```

- [ ] **Step 2: Attach global exception handlers in index.ts**
```ts
import { logger } from './utils/logger';

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason);
});
```

- [ ] **Step 3: Verify compilation**
Run: `tsc -b`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add server/utils/logger.ts server/index.ts
git commit -m "fix: add backend file logger and global exception handlers"
```

### Task 4: Strict TypeScript Typing

**Files:**
- Modify: `server/services/stockFetcher.ts`

- [ ] **Step 1: Define explicit interfaces**
Replace `any` with interfaces for Upbit and Yahoo responses.
```ts
interface UpbitTicker {
  market: string;
  trade_price: number;
  signed_change_rate: number;
}
interface YahooResult {
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  marketState: string;
}
```

- [ ] **Step 2: Apply interfaces to fetch functions**
Update `fetchUpbitPrice` and `fetchYahooPrice` to use these interfaces instead of `any`.

- [ ] **Step 3: Verify compilation**
Run: `tsc -b`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add server/services/stockFetcher.ts
git commit -m "refactor: apply strict typescript interfaces to stock API responses"
```
