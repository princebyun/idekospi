export function SearchView() {
  return (
    <div className="flex-1 overflow-y-auto p-4 text-ide-text">
      <div className="mb-2 text-[11px] text-ide-text-muted uppercase">Search Market</div>
      <div className="text-[12px] mb-4 leading-relaxed">
        빠른 종목 검색은 단축키 <span className="text-ide-primary font-mono">Ctrl + P</span> 를 사용해 주세요. (전 세계 주식/코인 실시간 검색 지원)
      </div>
      <button 
        onClick={() => {
          const event = new KeyboardEvent('keydown', { key: 'p', ctrlKey: true });
          window.dispatchEvent(event);
        }}
        className="w-full bg-ide-border hover:bg-[#4d4d4d] text-white py-1.5 rounded text-[12px] transition-colors"
      >
        Open Global Search
      </button>
    </div>
  );
}
