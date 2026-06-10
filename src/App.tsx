import { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { startMarketStream } from './services/marketData';

function App() {
  const [activeTab, setActiveTab] = useState('explorer');

  useEffect(() => {
    startMarketStream();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden selection:bg-[#264f78]">
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={18} minSize={10} maxSize={30} className="bg-[#252526] flex flex-col border-r border-[#2b2b2b]">
            <Sidebar activeTab={activeTab} />
          </Panel>
          
          <PanelResizeHandle className="w-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors z-10" />
          
          <Panel className="flex flex-col min-w-[300px]">
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} className="bg-[#1e1e1e] flex flex-col relative z-0">
                <Editor />
              </Panel>
              
              <PanelResizeHandle className="h-[1px] bg-[#2b2b2b] hover:bg-[#007acc] active:bg-[#007acc] transition-colors z-10" />
              
              <Panel defaultSize={30} minSize={15} className="bg-[#1e1e1e] flex flex-col z-0">
                <Terminal />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
