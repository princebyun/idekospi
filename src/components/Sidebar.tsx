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
            <span className="mr-1 text-[10px]">▼</span> MARKETS
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'domestic' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('domestic', 'DomesticMarket.ts', 'TS', '#007acc', 'market_domestic')}
          >
            <span className="text-[#007acc] w-4 mr-2 text-xs font-bold text-center">TS</span>DomesticMarket.ts
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'global' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('global', 'GlobalMarket.ts', 'TS', '#007acc', 'market_global')}
          >
            <span className="text-[#007acc] w-4 mr-2 text-xs font-bold text-center">TS</span>GlobalMarket.ts
          </div>

          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'crypto' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('crypto', 'CryptoMarket.ts', 'TS', '#007acc', 'market_crypto')}
          >
            <span className="text-[#007acc] w-4 mr-2 text-xs font-bold text-center">TS</span>CryptoMarket.ts
          </div>

          <div className="py-1 px-2 mt-4 hover:bg-[#37373d] cursor-pointer font-bold text-[#cccccc] flex items-center select-none text-[13px]">
            <span className="mr-1 text-[10px]">▼</span> USER
          </div>
          
          <div 
            className={`pl-6 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'portfolio' ? 'bg-[#37373d]' : ''}`}
            onClick={() => handleOpenTab('portfolio', 'Portfolio.js', 'JS', '#e3c75b', 'portfolio')}
          >
            <span className="text-[#e3c75b] w-4 mr-2 text-xs font-bold text-center">JS</span>Portfolio.js
          </div>
          
        </div>
      )}
    </div>
  );
}
