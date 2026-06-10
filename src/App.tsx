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
              {/* 사이드바 가로 크기 조절 핸들 (Hit Area 확대) */}
              <PanelResizeHandle className="w-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors relative z-20 cursor-col-resize group">
                <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
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
                  {/* 터미널 세로 크기 조절 핸들 (Hit Area 확대) */}
                  <PanelResizeHandle className="h-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors relative z-20 cursor-row-resize group">
                    <div className="absolute inset-x-0 -top-1.5 -bottom-1.5" />
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
