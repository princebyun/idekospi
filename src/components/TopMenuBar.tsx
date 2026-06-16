import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function TopMenuBar() {
  const { isMenuBarVisible, toggleMenuBar, togglePanicMode, openTab } = useStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  const executeAction = (action: string) => {
    setActiveMenu(null);
    switch(action) {
      case 'new_window':
        window.open(window.location.href, '_blank');
        break;
      case 'save':
        alert('All changes saved to workspace.');
        break;
      case 'panic':
        togglePanicMode();
        break;
      case 'fullscreen':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
          document.exitFullscreen();
        }
        break;
      case 'toggle_menu':
        toggleMenuBar();
        break;
      case 'terminal':
        const event = new KeyboardEvent('keydown', { key: 't', ctrlKey: true });
        window.dispatchEvent(event);
        break;
      case 'release_notes':
        openTab({ id: 'release_notes', title: 'ReleaseNotes.java', icon: 'M', color: '#e3c153', type: 'release_notes' });
        break;
      case 'about':
        alert('IDE-KOSPI v1.2.0\n개발자 주식 위장 터미널\n\nGitHub: https://github.com/princebyun/idekospi');
        break;
      default:
        break;
    }
  };

  const renderDropdown = (menu: string) => {
    if (activeMenu !== menu) return null;
    
    const items: Record<string, {label: string, action: string, shortcut?: string, divider?: boolean}[]> = {
      'File': [
        { label: 'New Window', action: 'new_window', shortcut: 'Ctrl+Shift+N' },
        { label: 'Save', action: 'save', shortcut: 'Ctrl+S' },
        { label: '---', action: '', divider: true },
        { label: 'Panic Mode (Hide)', action: 'panic', shortcut: 'Esc x2' }
      ],
      'View': [
        { label: 'Toggle Full Screen', action: 'fullscreen', shortcut: 'F11' },
        { label: 'Toggle Menu Bar', action: 'toggle_menu' },
        { label: '---', action: '', divider: true },
        { label: 'Focus Terminal', action: 'terminal', shortcut: 'Ctrl+T' }
      ],
      'Terminal': [
        { label: 'New Terminal', action: 'terminal', shortcut: 'Ctrl+Shift+`' }
      ],
      'Help': [
        { label: 'Release Notes', action: 'release_notes' },
        { label: '---', action: '', divider: true },
        { label: 'About IDE-KOSPI', action: 'about' }
      ]
    };

    const menuItems = items[menu] || [];
    if (menuItems.length === 0) return null;

    return (
      <div className="absolute top-full left-0 mt-0 w-60 bg-[#252526] border border-[#454545] rounded-md shadow-xl py-1 z-50">
        {menuItems.map((item, idx) => {
          if (item.divider) return <div key={idx} className="h-[1px] bg-[#454545] my-1 mx-2" />;
          return (
            <div 
              key={idx} 
              className="px-6 py-1.5 hover:bg-[#04395e] cursor-pointer flex justify-between items-center text-ide-text"
              onClick={() => executeAction(item.action)}
            >
              <span>{item.label}</span>
              {item.shortcut && <span className="text-ide-text-muted text-[11px]">{item.shortcut}</span>}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div 
      className={`bg-ide-sidebar border-b border-[#2d2d2d] flex items-center px-2 select-none z-50 shrink-0 transition-all ${isMenuBarVisible ? 'h-[30px]' : 'h-[16px]'}`}
      onDoubleClick={toggleMenuBar}
    >
      <div className="flex items-center space-x-1 h-full relative" ref={menuRef}>
        <div className="h-full flex items-center justify-center px-2 hover:bg-[#505050] cursor-pointer rounded-md mx-1 transition-colors">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-[18px] h-[18px]" alt="VSCode Icon" />
        </div>
        {isMenuBarVisible ? (
          <>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'File' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('File')}
              >File</div>
              {renderDropdown('File')}
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Edit' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Edit')}
              >Edit</div>
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Selection' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Selection')}
              >Selection</div>
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'View' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('View')}
              >View</div>
              {renderDropdown('View')}
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Go' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Go')}
              >Go</div>
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Run' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Run')}
              >Run</div>
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Terminal' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Terminal')}
              >Terminal</div>
              {renderDropdown('Terminal')}
            </div>
            <div className="relative h-full flex items-center">
              <div 
                className={`text-ide-text px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'Help' ? 'bg-[#505050]' : 'hover:bg-ide-hover'}`}
                onClick={() => handleMenuClick('Help')}
              >Help</div>
              {renderDropdown('Help')}
            </div>
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
