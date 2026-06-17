import { useStore } from '../../store/useStore';
import type { StockItem } from '../../store/useStore';

interface Props {
  item: StockItem;
  paddingLeft: string;
  isDragged: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

export function StockItemNode({ item, paddingLeft, isDragged, onDragStart, onDragEnd }: Props) {
  const openTab = useStore(state => state.openTab);
  const activeTabId = useStore(state => state.activeTabId);
  const removeStock = useStore(state => state.removeStock);

  const isKrx = item.code.endsWith('.KS') || item.code.endsWith('.KQ') || item.code.startsWith('KRX:') || item.code === 'FUT';
  
  const handleOpenTab = () => {
    openTab({
      id: isKrx ? `code_${item.code}` : `chart_${item.code}`,
      title: isKrx ? `${item.name}.ts` : `${item.name}.chart`,
      icon: isKrx ? 'TS' : '📊',
      color: isKrx ? '#007acc' : '#ce9178',
      type: isKrx ? 'code_single' : 'chart',
      code: item.code
    });
  };

  const isActive = activeTabId === (isKrx ? `code_${item.code}` : `chart_${item.code}`);

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      className={`group pr-2 py-0.5 hover:bg-ide-hover cursor-pointer text-ide-text select-none flex items-center justify-between ${isActive ? 'bg-[#37373d] text-white' : ''} ${isDragged ? 'opacity-50' : ''}`}
      style={{ paddingLeft }}
      onClick={handleOpenTab}
    >
      <div className="flex items-center truncate">
        {isKrx ? (
          <span className="text-ide-primary w-4 mr-1 text-xs font-bold text-center flex-shrink-0">TS</span>
        ) : (
          <span className="w-4 mr-1 text-[11px] text-center flex-shrink-0">📊</span>
        )}
        <span className="truncate">{item.name}{isKrx ? '.ts' : '.chart'}</span>
      </div>
      <button 
        className="opacity-0 group-hover:opacity-100 hover:text-white text-ide-text-muted px-1"
        onClick={(e) => { e.stopPropagation(); removeStock(item.id); }}
        title="Remove from Portfolio"
      >×</button>
    </div>
  );
}
