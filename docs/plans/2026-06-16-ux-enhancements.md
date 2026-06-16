# UX Enhancements Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the remaining UX issues and add Outlook mode.

### Task 1: Portfolio UX & D&D Fixes
**Files:**
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: Add `removeStock` to `Sidebar.tsx`**
Add an `x` or delete icon to portfolio items in the `Sidebar.tsx`.
It should appear on hover, and `onClick={(e) => { e.stopPropagation(); removeStock(item.id); }}` should be called.

- [ ] **Step 2: Fix D&D `onDragEnd` Bug**
In `Sidebar.tsx`, add an `onDragEnd` handler to the portfolio items:
```tsx
const handleDragEnd = () => {
  setDraggedIndex(null);
};
```
Add `onDragEnd={handleDragEnd}` to the draggable items.

- [ ] **Step 3: Commit**
```bash
git add src/components/Sidebar.tsx
git commit -m "fix: resolve drag and drop ghosting and add portfolio delete button"
```

### Task 2: Search Tab UX Enhancements
**Files:**
- Modify: `src/components/QuickOpen.tsx`

- [ ] **Step 1: Show "Added" indicator in QuickOpen**
If an item is already in the `portfolio`, show a `[Added]` badge or change the UI slightly.
Allow clicking it again to toggle it (remove it if it's already there). Or simply gray it out.

- [ ] **Step 2: Commit**
```bash
git add src/components/QuickOpen.tsx
git commit -m "feat: improve search UI with added indicator and toggle functionality"
```

### Task 3: Outlook Stealth Mode
**Files:**
- Modify: `src/store/useStore.ts`
- Modify: `src/App.tsx` (or main layout)
- Create/Modify: `src/components/OutlookMode.tsx`

- [ ] **Step 1: Add Outlook theme to Store**
Ensure `'outlook'` is part of the theme union in `useStore.ts` (`'vscode-dark' | 'intellij' | 'light' | 'outlook'`).

- [ ] **Step 2: Outlook UI component**
Create a highly convincing Outlook Web UI replica. When `theme === 'outlook'`, hide the main IDE-KOSPI interface and show `OutlookMode.tsx` instead. The Outlook mode should have a tiny hidden toggle (e.g., clicking on the Outlook logo) to revert back to `vscode-dark`. It should subtly display stock data in the "email list" or "inbox preview".

- [ ] **Step 3: Commit**
```bash
git add src/
git commit -m "feat: add outlook mail stealth mode"
```
