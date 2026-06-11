import { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { QuickOpen } from './components/QuickOpen';
import { startMarketStream } from './services/marketData';
import { ChatPanel } from './components/ChatPanel';

function App() {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <ActivityBar activeTab={activeTab} setActiveTab={handleTabClick} />
        
        <PanelGroup orientation="horizontal" className="flex-1">
          {isSidebarOpen && (
            <>
              <Panel defaultSize={18} minSize={10} maxSize={30} className="bg-[#252526] flex flex-col border-r border-[#2b2b2b]">
                {activeTab === 'chat' ? <ChatPanel /> : <Sidebar activeTab={activeTab} />}
              </Panel>
              {/* 사이드바 가로 크기 조절 핸들 (Negative Margin Trick) */}
              <PanelResizeHandle className="w-[11px] -mx-[5px] z-50 flex justify-center bg-transparent cursor-col-resize group outline-none">
                <div className="w-[1px] h-full bg-[#2b2b2b] group-hover:bg-[#007acc] group-active:bg-[#007acc] transition-colors" />
              </PanelResizeHandle>
            </>
          )}
          
          <Panel className="flex flex-col min-w-[300px]">
            <PanelGroup orientation="vertical">
              <Panel defaultSize={isTerminalOpen ? 70 : 100} minSize={20} className="bg-[#1e1e1e] flex flex-col relative z-0">
                <Editor />
              </Panel>
              
              {isTerminalOpen && (
                <>
                  {/* 터미널 세로 크기 조절 핸들 (Negative Margin Trick) */}
                  <PanelResizeHandle className="h-[11px] -my-[5px] z-50 flex flex-col justify-center bg-transparent cursor-row-resize group outline-none">
                    <div className="h-[1px] w-full bg-[#2b2b2b] group-hover:bg-[#007acc] group-active:bg-[#007acc] transition-colors" />
                  </PanelResizeHandle>
                  <Panel defaultSize={30} minSize={15} className="bg-[#1e1e1e] flex flex-col z-0">
                    <Terminal />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
