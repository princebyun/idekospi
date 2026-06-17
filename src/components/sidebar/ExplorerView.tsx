import { useState } from 'react';
import { useStore } from '../../store/useStore';

export function ExplorerView() {
  const { openTab, activeTabId, portfolio, reorderPortfolio, removeStock } = useStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderPortfolio(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleOpenTab = (id: string, title: string, icon: string, color: string, type: string, code?: string) => {
    openTab({ id, title, icon, color, type, code });
  };

  return (
    <div className="flex-1 overflow-y-auto font-mono text-[13px]">
      {/* Root Folder */}
      <div className="py-0.5 px-1 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none font-bold">
        <span className="mr-1 text-[10px]">▼</span> idekospi
      </div>
      
      {/* Fake Folders */}
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px] text-ide-text-muted">▶</span> dist
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px] text-ide-text-muted">▶</span> node_modules
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px] text-ide-text-muted">▶</span> public
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px] text-ide-text-muted">▶</span> server
      </div>
      
      {/* src Folder */}
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px]">▼</span> src
      </div>
      
      {/* ReleaseNotes.java */}
      <div 
        className={`pl-7 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center ${activeTabId === 'releasenotes' ? 'bg-[#37373d] text-white' : ''}`}
        onClick={() => handleOpenTab('releasenotes', 'ReleaseNotes.java', 'J', '#b07219', 'release_notes')}
      >
        <span className="text-[#b07219] w-4 mr-1 text-xs font-bold text-center">J</span>ReleaseNotes.java
      </div>
      
      {/* markets Folder */}
      <div className="py-0.5 px-1 pl-7 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="mr-1 text-[10px]">▼</span> markets
      </div>
      
      {/* Markets.ts */}
      <div 
        className={`pl-11 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center ${activeTabId === 'markets' ? 'bg-[#37373d] text-white' : ''}`}
        onClick={() => handleOpenTab('markets', 'Markets.ts', 'TS', '#007acc', 'markets_all')}
      >
        <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center">TS</span>Markets.ts
      </div>

      {/* portfolio Folder */}
      <div className="py-0.5 px-1 pl-7 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none mt-1">
        <span className="mr-1 text-[10px]">▼</span> portfolio
      </div>

      <div 
        className={`pl-11 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center ${activeTabId === 'portfolio_dashboard' ? 'bg-[#37373d] text-white' : ''}`}
        onClick={() => handleOpenTab('portfolio_dashboard', 'Portfolio.dashboard', 'TS', '#007acc', 'portfolio_dashboard')}
      >
        <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center">TS</span>Portfolio.dashboard
      </div>

      {/* Portfolio Items */}
      {portfolio.map((item, index) => {
        const isKrx = item.code.endsWith('.KS') || item.code.endsWith('.KQ') || item.code.startsWith('KRX:') || item.code === 'FUT';
        
        if (isKrx) {
          return (
            <div 
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group pl-11 pr-2 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center justify-between ${activeTabId === `code_${item.code}` ? 'bg-[#37373d] text-white' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
              onClick={() => handleOpenTab(`code_${item.code}`, `${item.name}.ts`, 'TS', '#007acc', 'code_single', item.code)}
            >
              <div className="flex items-center truncate">
                <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center flex-shrink-0">TS</span>
                <span className="truncate">{item.name}.ts</span>
              </div>
              <button 
                className="opacity-0 group-hover:opacity-100 hover:text-white text-ide-text-muted px-1"
                onClick={(e) => { e.stopPropagation(); removeStock(item.id); }}
                title="Remove from Portfolio"
              >×</button>
            </div>
          );
        }

        return (
          <div 
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group pl-11 pr-2 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center justify-between ${activeTabId === `chart_${item.code}` ? 'bg-[#37373d] text-white' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
            onClick={() => handleOpenTab(`chart_${item.code}`, `${item.name}.chart`, '📊', '#ce9178', 'chart', item.code)}
          >
            <div className="flex items-center truncate">
              <span className="w-4 mr-1 text-[11px] text-center flex-shrink-0">📊</span>
              <span className="truncate">{item.name}.chart</span>
            </div>
            <button 
              className="opacity-0 group-hover:opacity-100 hover:text-white text-ide-text-muted px-1"
              onClick={(e) => { e.stopPropagation(); removeStock(item.id); }}
              title="Remove from Portfolio"
            >×</button>
          </div>
        );
      })}
      
      {/* config files */}
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none mt-2">
        <span className="text-[#69b057] w-4 mr-1 text-[11px] text-center font-bold">{}</span>.gitignore
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="text-[#f5c040] w-4 mr-1 text-xs text-center font-bold">JS</span>eslint.config.js
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="text-[#f5c040] w-4 mr-1 text-xs text-center font-bold">{}</span>package.json
      </div>
      <div className="py-0.5 px-1 pl-4 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center select-none">
        <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center">TS</span>tsconfig.json
      </div>
    </div>
  );
}
