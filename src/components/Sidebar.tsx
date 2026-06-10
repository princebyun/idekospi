import { useStore } from '../store/useStore';
import type { Tab } from '../store/useStore';

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { openTab, activeTabId } = useStore();

  const handleOpenTab = (id: string, title: string, icon: string, color: string, type: Tab['type']) => {
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
            <span className="mr-1 text-[10px]">▼</span> SRC
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'markets' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('markets', 'Markets.ts', 'TS', '#007acc', 'markets_all')}
          >
            <span className="text-[#007acc] w-4 mr-2 text-xs font-bold text-center">TS</span>Markets.ts
          </div>
          
        </div>
      )}
    </div>
  );
}
