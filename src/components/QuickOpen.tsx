import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';

interface QuickOpenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickOpen({ isOpen, onClose }: QuickOpenProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addStock, portfolio } = useStore();

  const predefinedItems = [...DOMESTIC_LIST, ...GLOBAL_LIST, ...CRYPTO_LIST];

  useEffect(() => {
    if (!query) {
      setSearchResults(predefinedItems.slice(0, 10));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      
      const localMatches = predefinedItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.code.toLowerCase().includes(query.toLowerCase())
      );
      
      try {
        const backendUrl = `http://${window.location.hostname}:3001`;
        const res = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(query)}`);
        
        let combined = [...localMatches];
        
        if (res.ok) {
          const data = await res.json();
          const existingCodes = new Set(localMatches.map(i => i.code));
          
          data.forEach((apiItem: any) => {
            if (!existingCodes.has(apiItem.code)) {
              combined.push(apiItem);
              existingCodes.add(apiItem.code);
            }
          });
        }
        setSearchResults(combined.slice(0, 15));
      } catch (err) {
        console.error(err);
        setSearchResults(localMatches.slice(0, 15));
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const allItems = searchResults.map(item => ({
    ...item,
    inPortfolio: portfolio.some(p => p.code === item.code)
  }));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: typeof allItems[0]) => {
    if (!item.inPortfolio) {
      addStock({ name: item.name, code: item.code });
    }
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[600px] bg-[#252526] border border-[#454545] rounded-md shadow-2xl z-50 flex flex-col font-mono">
        <div className="p-2 border-b border-[#454545]">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-1.5 outline-none border border-transparent focus:border-[#007acc]"
            placeholder="Type a stock name or code to add to portfolio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto py-1 custom-scrollbar relative">
          {isSearching && (
            <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
              <div className="w-full h-full bg-[#007acc] animate-pulse"></div>
            </div>
          )}
          {allItems.length === 0 && !isSearching ? (
            <div className="px-4 py-2 text-[#858585] text-sm">No matching results</div>
          ) : (
            allItems.map((item, idx) => (
              <div
                key={item.code}
                className={`px-4 py-1.5 flex items-center justify-between cursor-pointer text-[13px]
                  ${idx === selectedIndex ? 'bg-[#04395e] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="flex items-center">
                  <span className="text-[#007acc] w-6 mr-2">TS</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[#858585]">{item.code}</span>
                  {item.inPortfolio && <span className="text-[#6a9955] text-[11px]">In Portfolio</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
