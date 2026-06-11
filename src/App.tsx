import { useState, useEffect } from 'react';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { QuickOpen } from './components/QuickOpen';
import { startMarketStream } from './services/marketData';
import { ChatPanel } from './components/ChatPanel';
import { ResizeHandle } from './components/ResizeHandle';
import { useStore } from './store/useStore';
import { TopMenuBar } from './components/TopMenuBar';

function App() {
  const { 
    isRightPanelOpen, setIsRightPanelOpen,
    sidebarWidth, setSidebarWidth,
    terminalHeight, setTerminalHeight,
    rightPanelWidth, setRightPanelWidth
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState(false);

  useEffect(() => {
    startMarketStream();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + P (Mac: Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsQuickOpenOpen(true);
      }
      // Ctrl + B (Mac: Cmd + B)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      // Ctrl + \ (Mac: Cmd + \)
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      // Ctrl + L (Mac: Cmd + L) - Cursor AI 스타일 챗 오픈
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const currentOpen = useStore.getState().isRightPanelOpen;
        setIsRightPanelOpen(!currentOpen);
        if (!currentOpen) {
          // 채팅창 열면서 포커스 이동 (ChatPanel 내부에 구현 필요)
          setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
          }, 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSidebarOpen, setIsTerminalOpen, setIsRightPanelOpen]);

  const handleTabClick = (tab: string) => {
    if (tab === 'chat') {
      setIsRightPanelOpen(!useStore.getState().isRightPanelOpen);
      return;
    }
    
    if (activeTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden selection:bg-[#264f78]">
      <TopMenuBar />
      <QuickOpen isOpen={isQuickOpenOpen} onClose={() => setIsQuickOpenOpen(false)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar (Fixed width 48px / w-12) */}
        <ActivityBar activeTab={activeTab} setActiveTab={handleTabClick} />
        
        {/* Sidebar Area */}
        {isSidebarOpen && (
          <>
            <div 
              style={{ width: `${sidebarWidth}px` }} 
              className="bg-[#252526] flex flex-col border-r border-[#2b2b2b] shrink-0"
            >
              <Sidebar activeTab={activeTab} />
            </div>
            <ResizeHandle 
              orientation="vertical" 
              onResize={setSidebarWidth} 
              minSize={150} 
              maxSize={800} 
            />
          </>
        )}
        
        {/* Main Editor & Terminal Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <div className="flex-1 flex flex-col relative z-0 min-h-[100px]">
            <Editor />
          </div>
          
          {isTerminalOpen && (
            <>
              <ResizeHandle 
                orientation="horizontal" 
                onResize={setTerminalHeight} 
                minSize={100} 
                maxSize={800} 
              />
              <div 
                style={{ height: `${terminalHeight}px` }} 
                className="bg-[#1e1e1e] flex flex-col z-0 shrink-0"
              >
                <Terminal />
              </div>
            </>
          )}
          
        </div>

        {/* Right Panel (Chat) */}
        {isRightPanelOpen && (
          <>
            <ResizeHandle 
              orientation="right-vertical" 
              onResize={setRightPanelWidth} 
              minSize={250} 
              maxSize={800} 
            />
            <div 
              style={{ width: `${rightPanelWidth}px` }} 
              className="bg-[#1e1e1e] flex flex-col border-l border-[#2b2b2b] shrink-0 z-10"
            >
              <ChatPanel />
            </div>
          </>
        )}
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
