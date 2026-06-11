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

function App() {
  const { 
    isTerminalOpen, setIsTerminalOpen, 
    isSidebarOpen, setIsSidebarOpen,
    sidebarWidth, setSidebarWidth,
    terminalHeight, setTerminalHeight
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('explorer');
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
        setIsSidebarOpen(!useStore.getState().isSidebarOpen);
      }
      // Ctrl + \ (Mac: Cmd + \)
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setIsTerminalOpen(!useStore.getState().isTerminalOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSidebarOpen, setIsTerminalOpen]);

  const handleTabClick = (tab: string) => {
    if (activeTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden selection:bg-[#264f78]">
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
              {activeTab === 'chat' ? <ChatPanel /> : <Sidebar activeTab={activeTab} />}
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
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
