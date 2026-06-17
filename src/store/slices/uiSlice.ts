import type { StateCreator } from 'zustand';
import type { Tab, IdeState } from '../useStore';

export interface UiSlice {
  tabs: Tab[];
  activeTabId: string;
  theme: 'vscode-dark' | 'intellij' | 'light' | 'outlook' | 'monokai' | 'github-dark';
  sidebarWidth: number;
  terminalHeight: number;
  isRightPanelOpen: boolean;
  rightPanelWidth: number;
  isPanicMode: boolean;
  isMenuBarVisible: boolean;
  bottomPanelTab: 'terminal' | 'output';
  selectedIssueId: string | null;
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
  setSidebarWidth: (width: number) => void;
  setTerminalHeight: (height: number) => void;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setTheme: (theme: 'vscode-dark' | 'intellij' | 'light' | 'outlook' | 'monokai' | 'github-dark') => void;
  togglePanicMode: () => void;
  toggleMenuBar: () => void;
  setBottomPanelTab: (tab: 'terminal' | 'output') => void;
  setSelectedIssueId: (id: string | null) => void;
  setWsStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
}

export const createUiSlice: StateCreator<IdeState, [], [], UiSlice> = (set) => ({
  theme: 'vscode-dark',
  isPanicMode: false,
  tabs: [
    { id: 'markets', title: 'Markets.ts', icon: 'TS', color: '#007acc', type: 'markets_all' },
  ],
  activeTabId: 'markets',
  sidebarWidth: 250,
  terminalHeight: 300,
  isRightPanelOpen: true, // 채팅창 기본 오픈
  rightPanelWidth: 350,
  isMenuBarVisible: true,
  bottomPanelTab: 'terminal',
  selectedIssueId: null,
  wsStatus: 'disconnected',

  openTab: (tab) => set((state) => {
    if (!state.tabs.find((t) => t.id === tab.id)) {
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }
    return { activeTabId: tab.id };
  }),
  closeTab: (tabId) => set((state) => {
    const newTabs = state.tabs.filter((t) => t.id !== tabId);
    return { 
      tabs: newTabs,
      activeTabId: state.activeTabId === tabId 
        ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '') 
        : state.activeTabId
    };
  }),
  setActiveTabId: (tabId) => set({ activeTabId: tabId }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setTerminalHeight: (height) => set({ terminalHeight: height }),
  setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setTheme: (theme) => set({ theme }),
  togglePanicMode: () => set((state) => ({ isPanicMode: !state.isPanicMode })),
  toggleMenuBar: () => set((state) => ({ isMenuBarVisible: !state.isMenuBarVisible })),
  setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
  setSelectedIssueId: (id) => set({ selectedIssueId: id }),
  setWsStatus: (status) => set({ wsStatus: status }),
});
