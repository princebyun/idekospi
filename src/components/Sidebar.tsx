import { useStore } from '../store/useStore';

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { openTab, activeTabId } = useStore();

  const handleOpenTab = (id: string, title: string, icon: string, color: string, type: 'portfolio' | 'market' | 'patchnotes') => {
    openTab({ id, title, icon, color, type });
  };

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc] flex-shrink-0">
        {activeTab === 'explorer' ? 'Explorer' : activeTab === 'search' ? 'Search' : 'Settings'}
      </div>
      
      {activeTab === 'explorer' && (
        <div className="flex-1 overflow-y-auto">
          <div className="py-1 px-2 hover:bg-[#37373d] cursor-pointer font-bold text-[#cccccc] flex items-center select-none text-[13px]">
            <span className="mr-1 text-[10px]">▼</span> IDE-KOSPI
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none ${activeTabId === 'market' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('market', 'MarketService.ts', 'TS', '#007acc', 'market')}
          >
            <span className="text-[#007acc] mr-2 text-xs font-bold">TS</span>MarketService.ts
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none ${activeTabId === 'portfolio' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('portfolio', 'Portfolio.js', 'JS', '#e3c75b', 'portfolio')}
          >
            <span className="text-[#e3c75b] mr-2 text-xs font-bold">JS</span>Portfolio.js
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none ${activeTabId === 'patchnotes' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('patchnotes', 'ReleaseNotes.java', '{}', '#e36e5b', 'patchnotes')}
          >
            <span className="text-[#e36e5b] mr-2 text-xs font-bold">{`{}`}</span>ReleaseNotes.java
          </div>
        </div>
      )}
    </div>
  );
}
