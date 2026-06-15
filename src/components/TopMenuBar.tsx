import { useStore } from '../store/useStore';

export function TopMenuBar() {
  const { isMenuBarVisible, toggleMenuBar } = useStore();
  
  return (
    <div 
      className={`bg-ide-sidebar border-b border-[#2d2d2d] flex items-center px-2 select-none z-50 shrink-0 transition-all ${isMenuBarVisible ? 'h-[30px]' : 'h-[16px]'}`}
      onDoubleClick={toggleMenuBar}
    >
      <div className="flex items-center space-x-1 h-full">
        <div className="h-full flex items-center justify-center px-2 hover:bg-[#505050] cursor-pointer rounded-md mx-1 transition-colors">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-[18px] h-[18px]" alt="VSCode Icon" />
        </div>
        {isMenuBarVisible ? (
          <>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">File</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Edit</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Selection</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">View</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Go</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Run</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Terminal</div>
            <div className="text-ide-text hover:bg-ide-hover px-2 py-1 rounded cursor-pointer transition-colors">Help</div>
          </>
        ) : (
          <div className="text-ide-text-muted hover:text-white px-2 cursor-pointer transition-colors" title="메뉴 펼치기" onClick={toggleMenuBar}>
            ≡
          </div>
        )}
      </div>
      
      <div className={`absolute left-1/2 -translate-x-1/2 text-ide-text-muted font-medium pointer-events-none ${isMenuBarVisible ? 'text-[12px]' : 'text-[10px]'}`}>
        IDE-KOSPI - 개발자 주식 위장 터미널
      </div>

      <div className="flex-1 flex justify-end items-center space-x-2 px-2 h-full">
        {/* Fake Window Controls */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-ide-border hover:bg-[#505050] border border-[#555] flex items-center justify-center cursor-pointer">
            <div className="w-1.5 h-[1px] bg-[#858585]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-ide-border hover:bg-[#505050] border border-[#555] flex items-center justify-center cursor-pointer">
            <div className="w-1.5 h-1.5 border border-[#858585]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-ide-border hover:bg-[#e81123] border border-[#555] group flex items-center justify-center cursor-pointer transition-colors">
            <svg width="8" height="8" viewBox="0 0 16 16" className="text-ide-text-muted group-hover:text-white" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.707L8 8.707z"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
