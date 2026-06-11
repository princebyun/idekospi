import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Tab } from '../store/useStore';

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { openTab, activeTabId, portfolio } = useStore();
  const [gitLogs, setGitLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchGitLogs = async () => {
      try {
        const backendUrl = `http://${window.location.hostname}:3001`;
        const res = await fetch(`${backendUrl}/api/git/log`);
        if (res.ok) {
          const data = await res.json();
          setGitLogs(data.logs || []);
        }
      } catch (err) {
        console.error('Failed to fetch git logs:', err);
      }
    };
    
    fetchGitLogs();
  }, []);

  const handleOpenTab = (id: string, title: string, icon: string, color: string, type: string, code?: string) => {
    openTab({ id, title, icon, color, type, code });
  };

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Main Content Area (Top 45%) */}
      <div className="flex-[45] flex flex-col min-h-0">
        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc] flex-shrink-0">
          {activeTab === 'explorer' ? '탐색기' : activeTab === 'search' ? 'Search' : 'Settings'}
        </div>
        
        {activeTab === 'explorer' && (
          <div className="flex-1 overflow-y-auto font-mono text-[13px]">
            {/* Root Folder */}
            <div className="py-0.5 px-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none font-bold">
              <span className="mr-1 text-[10px]">▼</span> idekospi
            </div>
            
            {/* Fake Folders */}
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px] text-[#858585]">▶</span> dist
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px] text-[#858585]">▶</span> node_modules
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px] text-[#858585]">▶</span> public
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px] text-[#858585]">▶</span> server
            </div>
            
            {/* src Folder */}
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px]">▼</span> src
            </div>
            
            {/* ReleaseNotes.java */}
            <div 
              className={`pl-7 py-0.5 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'releasenotes' ? 'bg-[#37373d] text-white' : ''}`}
              onClick={() => handleOpenTab('releasenotes', 'ReleaseNotes.java', 'J', '#b07219', 'release_notes')}
            >
              <span className="text-[#b07219] w-4 mr-1 text-xs font-bold text-center">J</span>ReleaseNotes.java
            </div>
            
            {/* markets Folder */}
            <div className="py-0.5 px-1 pl-7 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="mr-1 text-[10px]">▼</span> markets
            </div>
            
            {/* Markets.ts */}
            <div 
              className={`pl-11 py-0.5 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === 'markets' ? 'bg-[#37373d] text-white' : ''}`}
              onClick={() => handleOpenTab('markets', 'Markets.ts', 'TS', '#007acc', 'markets_all')}
            >
              <span className="text-[#007acc] w-4 mr-1 text-xs font-bold text-center">TS</span>Markets.ts
            </div>

            {/* portfolio Folder */}
            <div className="py-0.5 px-1 pl-7 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none mt-1">
              <span className="mr-1 text-[10px]">▼</span> portfolio
            </div>

            {/* Portfolio Items */}
            {portfolio.map((item) => {
              const isKrx = item.code.endsWith('.KS') || item.code.endsWith('.KQ') || item.code.startsWith('KRX:');
              
              if (isKrx) {
                return (
                  <div 
                    key={item.id}
                    className={`pl-11 py-0.5 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === `code_${item.code}` ? 'bg-[#37373d] text-white' : ''}`}
                    onClick={() => handleOpenTab(`code_${item.code}`, `${item.name}.ts`, 'TS', '#007acc', 'code_single', item.code)}
                  >
                    <span className="text-[#007acc] w-4 mr-1 text-xs font-bold text-center">TS</span>{item.name}.ts
                  </div>
                );
              }

              return (
                <div 
                  key={item.id}
                  className={`pl-11 py-0.5 hover:bg-[#37373d] cursor-pointer text-[#cccccc] select-none flex items-center ${activeTabId === `chart_${item.code}` ? 'bg-[#37373d] text-white' : ''}`}
                  onClick={() => handleOpenTab(`chart_${item.code}`, `${item.name}.chart`, '📈', '#ce9178', 'chart', item.code)}
                >
                  <span className="w-4 mr-1 text-[11px] text-center">📈</span>{item.name}.chart
                </div>
              );
            })}
            
            {/* config files */}
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none mt-2">
              <span className="text-[#69b057] w-4 mr-1 text-[11px] text-center font-bold">{}</span>.gitignore
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="text-[#f5c040] w-4 mr-1 text-xs text-center font-bold">JS</span>eslint.config.js
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="text-[#f5c040] w-4 mr-1 text-xs text-center font-bold">{}</span>package.json
            </div>
            <div className="py-0.5 px-1 pl-4 hover:bg-[#37373d] cursor-pointer text-[#cccccc] flex items-center select-none">
              <span className="text-[#007acc] w-4 mr-1 text-xs font-bold text-center">TS</span>tsconfig.json
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="flex-1 overflow-y-auto p-4 text-[#cccccc]">
            <div className="mb-2 text-[11px] text-[#858585] uppercase">Search Market</div>
            <div className="text-[12px] mb-4 leading-relaxed">
              빠른 종목 검색은 단축키 <span className="text-[#007acc] font-mono">Ctrl + P</span> 를 사용해 주세요. (전 세계 주식/코인 실시간 검색 지원)
            </div>
            <button 
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'p', ctrlKey: true });
                window.dispatchEvent(event);
              }}
              className="w-full bg-[#3c3c3c] hover:bg-[#4d4d4d] text-white py-1.5 rounded text-[12px] transition-colors"
            >
              Open Global Search
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 text-[#cccccc]">
            <div className="mb-6">
              <div className="mb-2 text-[11px] text-[#858585] uppercase">Theme</div>
              <select className="w-full bg-[#3c3c3c] border border-[#3c3c3c] rounded p-1 text-[12px] outline-none cursor-not-allowed opacity-50" disabled>
                <option>VSCode Dark (Default)</option>
                <option>IntelliJ Darcula (Soon)</option>
                <option>Light Theme (Soon)</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="mb-2 text-[11px] text-[#858585] uppercase">Legal Notice & Policy</div>
              <div className="text-[11px] text-[#858585] leading-relaxed bg-[#1e1e1e] p-2 rounded border border-[#2b2b2b]">
                본 서비스는 정보 제공 목적이며 실제 투자 권유를 의미하지 않습니다.<br/><br/>
                야후 파이낸스 API 특성상 한국 시장(국장) 데이터는 15~20분 지연될 수 있습니다.<br/><br/>
                서버에 개인정보를 평문으로 저장하지 않으며 브라우저 LocalStorage를 활용합니다.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Source Control Panel (Bottom 55%) - Always Visible except settings */}
      {activeTab !== 'settings' && activeTab !== 'git' && (
        <div className="flex-[55] border-t border-[#2b2b2b] flex flex-col min-h-0 overflow-hidden text-[#cccccc] text-[12px] shrink-0">
          <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#cccccc] flex-shrink-0 bg-[#252526] border-b border-[#2b2b2b]">
            소스 제어
          </div>
          {/* Commit Input Area */}
          <div className="p-3 shrink-0 border-b border-[#2b2b2b]">
            <div className="flex items-center justify-between mb-2 text-[11px] cursor-pointer hover:text-white">
              <div className="flex items-center">
                <span className="mr-1">▼</span> 변경 내용
              </div>
            </div>
            <textarea 
              className="w-full h-16 bg-[#3c3c3c] border border-[#3c3c3c] rounded p-1.5 text-[#cccccc] text-[12px] resize-none focus:outline-none focus:border-[#007acc]"
              placeholder='메시지(Ctrl+Enter(으)로 "main"에 커밋)'
              disabled
            />
            <div className="mt-2 flex">
              <button className="flex-1 bg-[#007acc] hover:bg-[#005f9e] text-white py-1 rounded text-[12px] flex items-center justify-center transition-colors disabled:opacity-50">
                ✓ 커밋
              </button>
            </div>
          </div>
          
          {/* Git Graph Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="sticky top-0 bg-[#252526] p-2 flex items-center justify-between text-[11px] border-b border-[#2b2b2b] shrink-0 z-10">
              <div className="flex items-center text-[#cccccc]">
                <span className="mr-1">▼</span> 그래프
              </div>
              <div className="text-[#858585]">자동 ⊙ ⎇ ⟲ ↺ ...</div>
            </div>
            
            <div className="p-2 space-y-1 relative">
              <div className="absolute left-[15px] top-4 bottom-0 w-[1px] bg-[#007acc]"></div>
              
              {gitLogs.length > 0 ? gitLogs.map((msg, idx) => (
                <div key={idx} className="flex items-center group cursor-pointer hover:bg-[#37373d] py-0.5 rounded px-1 relative z-10">
                  <div className={`w-[9px] h-[9px] rounded-full border-2 ${idx === 0 ? 'border-[#569cd6] bg-[#1e1e1e]' : 'border-[#007acc] bg-[#007acc]'} flex-shrink-0 z-10 ml-[2px] mr-2`} />
                  <div className="truncate text-[11.5px] text-[#cccccc] flex-1 mr-2" title={msg}>{msg}</div>
                  {idx === 0 && (
                    <div className="flex-shrink-0 flex items-center space-x-1">
                      <span className="text-[9px] border border-[#569cd6] text-[#569cd6] px-1 rounded-sm">◎ main</span>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-[11px] text-[#858585] pl-6 py-2">Loading git history...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 overflow-y-auto p-4 text-[#cccccc]">
          <div className="mb-6">
            <div className="mb-2 text-[11px] text-[#858585] uppercase">Theme</div>
            <select className="w-full bg-[#3c3c3c] border border-[#3c3c3c] rounded p-1 text-[12px] outline-none cursor-not-allowed opacity-50" disabled>
              <option>VSCode Dark (Default)</option>
              <option>IntelliJ Darcula (Soon)</option>
              <option>Light Theme (Soon)</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-[11px] text-[#858585] uppercase">Legal Notice & Policy</div>
            <div className="text-[11px] text-[#858585] leading-relaxed bg-[#1e1e1e] p-2 rounded border border-[#2b2b2b]">
              본 서비스는 정보 제공 목적이며 실제 투자 권유를 의미하지 않습니다.<br/><br/>
              야후 파이낸스 API 특성상 한국 시장(국장) 데이터는 15~20분 지연될 수 있습니다.<br/><br/>
              서버에 개인정보를 평문으로 저장하지 않으며 브라우저 LocalStorage를 활용합니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
