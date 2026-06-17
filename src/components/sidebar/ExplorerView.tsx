import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { FolderPlus, Pencil, Trash } from 'lucide-react';
import { StockItemNode } from './StockItemNode';

export function ExplorerView() {
  const { openTab, activeTabId, portfolio, groups, addGroup, updateStock, removeGroup, renameGroup } = useStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('stockId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToGroup = (e: React.DragEvent, groupId: string | undefined) => {
    e.preventDefault();
    const stockId = e.dataTransfer.getData('stockId');
    if (stockId) {
      updateStock(stockId, { groupId });
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleOpenTab = (id: string, title: string, icon: string, color: string, type: string, code?: string) => {
    openTab({ id, title, icon, color, type, code });
  };



  return (
    <div className="flex-1 overflow-y-auto font-mono text-[13px] custom-scrollbar">
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
      <div 
        className={`pl-11 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center ${activeTabId === 'markets' ? 'bg-[#37373d] text-white' : ''}`}
        onClick={() => handleOpenTab('markets', 'Markets.ts', 'TS', '#007acc', 'markets_all')}
      >
        <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center">TS</span>Markets.ts
      </div>

      {/* portfolio Folder Header */}
      <div 
        className="group py-0.5 px-1 pl-7 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center justify-between select-none mt-1"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropToGroup(e, undefined)}
      >
        <div className="flex items-center">
          <span className="mr-1 text-[10px]">▼</span> portfolio
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsCreatingGroup(true); }}
          className="opacity-0 group-hover:opacity-100 hover:text-white text-ide-text-muted px-1"
          title="새 폴더 만들기"
        >
          <FolderPlus size={13} />
        </button>
      </div>

      {/* Create Group Input */}
      {isCreatingGroup && (
        <div className="pl-11 pr-2 py-1 flex items-center">
          <input 
            autoFocus
            className="w-full bg-ide-border text-ide-text border border-ide-primary outline-none px-1 py-0.5 text-xs"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newGroupName.trim()) {
                addGroup(newGroupName.trim());
                setNewGroupName('');
                setIsCreatingGroup(false);
              }
              if (e.key === 'Escape') {
                setIsCreatingGroup(false);
                setNewGroupName('');
              }
            }}
            onBlur={() => {
              setIsCreatingGroup(false);
              setNewGroupName('');
            }}
          />
        </div>
      )}

      {/* Portfolio Dashboard */}
      <div 
        className={`pl-11 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center ${activeTabId === 'portfolio_dashboard' ? 'bg-[#37373d] text-white' : ''}`}
        onClick={() => handleOpenTab('portfolio_dashboard', 'Portfolio.dashboard', 'TS', '#007acc', 'portfolio_dashboard')}
      >
        <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center">TS</span>Portfolio.dashboard
      </div>

      {/* Groups */}
      {groups?.map(group => (
        <div key={group.id}>
          <div 
            className="group py-0.5 px-1 pl-11 pr-2 hover:bg-ide-hover cursor-pointer text-ide-text flex items-center justify-between select-none"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropToGroup(e, group.id)}
          >
            {editingGroupId === group.id ? (
              <input 
                autoFocus
                className="w-full bg-ide-border text-ide-text border border-ide-primary outline-none px-1 text-xs"
                value={editGroupName}
                onChange={e => setEditGroupName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && editGroupName.trim()) {
                    renameGroup(group.id, editGroupName.trim());
                    setEditingGroupId(null);
                  }
                  if (e.key === 'Escape') setEditingGroupId(null);
                }}
                onBlur={() => setEditingGroupId(null)}
              />
            ) : (
              <>
                <div className="flex items-center text-ide-text-muted">
                  <span className="mr-1 text-[10px]">▼</span> {group.name}
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); setEditGroupName(group.name); setEditingGroupId(group.id); }} className="hover:text-white text-ide-text-muted px-1" title="이름 변경"><Pencil size={11} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }} className="hover:text-[#ff9d9d] text-ide-text-muted px-1" title="폴더 삭제"><Trash size={11} /></button>
                </div>
              </>
            )}
          </div>
          {portfolio.filter(item => item.groupId === group.id).map(item => (
            <StockItemNode
              key={item.id}
              item={item}
              paddingLeft="3.5rem"
              isDragged={draggedId === item.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      ))}

      {/* Root Portfolio Items */}
      {portfolio.filter(item => !item.groupId).map(item => (
        <StockItemNode
          key={item.id}
          item={item}
          paddingLeft="2.75rem"
          isDragged={draggedId === item.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
      
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
