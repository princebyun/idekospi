import { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { QuickOpen } from './components/QuickOpen';
import { startMarketStream } from './services/marketData';

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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden selection:bg-[#264f78]">
      <QuickOpen isOpen={isQuickOpenOpen} onClose={() => setIsQuickOpenOpen(false)} />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <PanelGroup orientation="horizontal" className="flex-1">
          {isSidebarOpen && (
            <>
              <Panel defaultSize={18} minSize={10} maxSize={30} className="bg-[#252526] flex flex-col border-r border-[#2b2b2b]">
                <Sidebar activeTab={activeTab} />
              </Panel>
              <PanelResizeHandle className="w-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors z-10" />
            </>
          )}
          
          <Panel className="flex flex-col min-w-[300px]">
            <PanelGroup orientation="vertical">
              <Panel defaultSize={isTerminalOpen ? 70 : 100} minSize={20} className="bg-[#1e1e1e] flex flex-col relative z-0">
                <Editor />
              </Panel>
              
              {isTerminalOpen && (
                <>
                  <PanelResizeHandle className="h-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors z-10" />
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
