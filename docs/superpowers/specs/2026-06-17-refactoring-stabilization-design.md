# IDE-KOSPI Refactoring & Stabilization Design (Phase 4)

## 1. Overview
As Phase 1 through 3 introduced significant functional expansions (UI themes, Dashboards, WebSockets, Rate Limiting), the codebase has accumulated technical debt. This design outlines a comprehensive four-step refactoring phase aimed at improving React rendering performance, code readability, backend stability, and TypeScript type safety.

## 2. Refactoring Scope

### 2.1 Frontend State Management Optimization
**Problem**: Components destructured multiple unused variables from `useStore()`, causing unnecessary re-renders whenever any state in the store changed.
**Solution**: 
- Refactor all `useStore` hooks in components to use explicit selectors.
- Example: `const activeTabId = useStore(state => state.activeTabId);`
- Target Components: `App.tsx`, `Sidebar.tsx`, `ExplorerView.tsx`, `Terminal.tsx`, `StatusBar.tsx`, `ChatPanel.tsx`.

### 2.2 UI Component Modularization
**Problem**: Core UI files have grown too large, mixing layout, business logic, and complex rendering maps.
**Solution**:
- **ExplorerView**: Extract `FolderItem`, `StockItemNode`, and `SystemFileNode` into separate files within `src/components/sidebar/`.
- **Terminal**: Extract `TerminalOutputList` and `TerminalTabNav` to keep `Terminal.tsx` focused on layout coordination.

### 2.3 Backend Proxy Server Stabilization
**Problem**: The proxy server lacks persistent logging and robust crash recovery, relying heavily on standard output.
**Solution**:
- Implement persistent file-based logging (e.g., using `fs` or a minimal logger utility) recording timestamped errors in `server/logs/`.
- Attach `process.on('uncaughtException')` and `process.on('unhandledRejection')` to gracefully log fatal errors instead of silently dying.

### 2.4 Strict TypeScript Typing
**Problem**: There are leftover `any` types in components and backend API handlers, defeating the purpose of TypeScript.
**Solution**:
- Replace `any` in `renderStockItem(item: any, ...)` inside `ExplorerView.tsx` with `StockItem`.
- Ensure Upbit and Yahoo API responses in `stockFetcher.ts` are typed using specific interfaces instead of implicit `any`.

## 3. Implementation Constraints
- Maintain 100% feature parity with the current application. No existing functionality should break or change visually.
- Each of the 4 steps must be isolated and verified via `npm run build` before moving to the next.
