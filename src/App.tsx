import { useState, useEffect } from 'react';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { QuickOpen } from './components/QuickOpen';
import { startMarketStream } from './services/marketData';
import { ChatPanel } from './components/ChatPanel';
import { ResizeHandle } from './components/ResizeHandle';
import { useStore } from './store/useStore';
import { TopMenuBar } from './components/TopMenuBar';
import { FakeEditor, FakeSidebar, FakeTerminal, FakeStatusBar } from './components/FakeViews';

function App() {
  const { 
    isRightPanelOpen, setIsRightPanelOpen,
    sidebarWidth, setSidebarWidth,
    terminalHeight, setTerminalHeight,
    rightPanelWidth, setRightPanelWidth,
    theme, isPanicMode, togglePanicMode
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  useEffect(() => {
    startMarketStream();
    
    const checkFullscreen = () => {
      // 윈도우 창 높이와 실제 모니터 해상도 높이가 동일한지 확인 (오차 1px 허용)
      const isFull = Math.abs(window.innerHeight - window.screen.height) <= 1;
      setIsFullscreen(isFull);
      if (isFull) {
        setIsAlertDismissed(false); // 전체 화면 전환 시 닫힘 상태 초기화
      }
    };

    checkFullscreen();
    window.addEventListener('resize', checkFullscreen);
    
    // 1분(60초)마다 F11 상태 체크하여 다시 알림 띄우기
    const alertInterval = setInterval(() => {
      const isFull = Math.abs(window.innerHeight - window.screen.height) <= 1;
      if (!isFull) {
        setIsAlertDismissed(false);
      }
    }, 60000);

    let lastEscTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 두 번 연속 입력 감지 (보스 모드)
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscTime < 500) {
          useStore.getState().togglePanicMode();
          lastEscTime = 0; // 리셋
        } else {
          lastEscTime = now;
        }
      }

      // Ctrl + P (Mac: Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsQuickOpenOpen(true);
      }
      // Ctrl + B (Mac: Cmd + B)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      // Ctrl + \ (Mac: Cmd + \)
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      // Ctrl + L (Mac: Cmd + L) - Cursor AI 스타일 챗 오픈
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const currentOpen = useStore.getState().isRightPanelOpen;
        setIsRightPanelOpen(!currentOpen);
        if (!currentOpen) {
          // 채팅창 열면서 포커스 이동 (ChatPanel 내부에 구현 필요)
          setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
          }, 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkFullscreen);
      clearInterval(alertInterval);
    };
  }, [setIsSidebarOpen, setIsTerminalOpen, setIsRightPanelOpen]);

  // 테마가 변경될 때 HTML 최상위 태그에 클래스 적용
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  const handleTabClick = (tab: string) => {
    if (tab === 'chat') {
      setIsRightPanelOpen(!useStore.getState().isRightPanelOpen);
      return;
    }
    
    if (activeTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className={`flex flex-col h-screen w-screen bg-ide-bg text-ide-text overflow-hidden selection:bg-[#264f78] relative theme-${theme}`}>
      <TopMenuBar />
      <QuickOpen isOpen={isQuickOpenOpen} onClose={() => setIsQuickOpenOpen(false)} />
      
      {/* F11 전체화면 유도 배너 */}
      {!isFullscreen && !isAlertDismissed && (
        <div className="fixed bottom-10 right-10 z-50 bg-[#d7ba7d] text-[#1e1e1e] px-4 py-3 rounded-md font-bold text-[13px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center space-x-2 animate-bounce border border-[#a8905e]">
          <span className="text-[16px]">⚠️</span>
          <span>완벽한 위장 모드를 위해 키보드의 <kbd className="bg-ide-bg text-[#d7ba7d] px-1.5 py-0.5 rounded mx-1 font-mono text-[11px] shadow-sm">F11</kbd> 키를 눌러주세요!</span>
          <button 
            onClick={() => setIsAlertDismissed(true)} 
            className="ml-3 text-[#1e1e1e] hover:text-white hover:bg-black/20 p-1 rounded transition-colors"
            title="닫기 (1분 후 다시 알림)"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar (Fixed width 48px / w-12) */}
        <ActivityBar activeTab={activeTab} setActiveTab={handleTabClick} />
        
        {/* Sidebar Area */}
          {isSidebarOpen && (
            <>
              <div 
                style={{ width: `${sidebarWidth}px` }} 
                className="bg-ide-sidebar flex flex-col border-r border-ide-border shrink-0"
              >
                {isPanicMode ? <FakeSidebar /> : <Sidebar activeTab={activeTab} />}
              </div>
              <ResizeHandle 
                orientation="vertical" 
                onResize={setSidebarWidth} 
                minSize={150} 
                maxSize={800} 
              />
            </>
          )}
        
        {/* Main Editor & Terminal Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <div className="flex-1 flex flex-col relative z-0 min-h-[100px]">
            {isPanicMode ? <FakeEditor /> : <Editor />}
          </div>
          
          {isTerminalOpen && (
            <>
              <ResizeHandle 
                orientation="horizontal" 
                onResize={setTerminalHeight} 
                minSize={100} 
                maxSize={800} 
              />
              <div 
                style={{ height: `${terminalHeight}px` }} 
                className="bg-ide-bg flex flex-col z-0 shrink-0"
              >
                {isPanicMode ? <FakeTerminal /> : <Terminal />}
              </div>
            </>
          )}
          
        </div>

        {/* Right Panel (Chat) - 패닉 모드 시 채팅창 완전히 숨김 */}
        {isRightPanelOpen && !isPanicMode && (
          <>
            <ResizeHandle 
              orientation="right-vertical" 
              onResize={setRightPanelWidth} 
              minSize={250} 
              maxSize={800} 
            />
            <div 
              style={{ width: `${rightPanelWidth}px` }} 
              className="bg-ide-bg flex flex-col border-l border-ide-border shrink-0 z-10"
            >
              <ChatPanel />
            </div>
          </>
        )}
      </div>
      
      {isPanicMode ? <FakeStatusBar /> : <StatusBar />}
    </div>
  );
}

export default App;
