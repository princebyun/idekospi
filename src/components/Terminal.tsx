import { Terminal as TerminalIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TerminalInput } from './terminal/TerminalInput';
import { NewsOutputTab } from './terminal/NewsOutputTab';

export function Terminal() {
  const { bottomPanelTab, setBottomPanelTab } = useStore();

  return (
    <div className="h-full flex flex-col bg-ide-bg font-mono text-[13px] border-t border-ide-border">
      <div className="flex items-center h-[35px] text-[#e7e7e7] text-xs select-none bg-ide-sidebar border-b border-[#2d2d2d]">
        <div 
          className={`flex items-center h-full px-4 cursor-pointer border-b-2 transition-colors ${bottomPanelTab === 'terminal' ? 'border-[#4fc1ff] text-[#4fc1ff]' : 'border-transparent text-ide-text hover:text-white'}`}
          onClick={() => setBottomPanelTab('terminal')}
        >
          <TerminalIcon size={14} className="mr-2" />
          TERMINAL
        </div>
        <div 
          className={`flex items-center h-full px-4 cursor-pointer border-b-2 transition-colors ${bottomPanelTab === 'output' ? 'border-[#4fc1ff] text-[#4fc1ff]' : 'border-transparent text-ide-text hover:text-white'}`}
          onClick={() => setBottomPanelTab('output')}
        >
          OUTPUT
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
        {bottomPanelTab === 'terminal' ? (
          <TerminalInput />
        ) : (
          <NewsOutputTab />
        )}
      </div>
    </div>
  );
}
