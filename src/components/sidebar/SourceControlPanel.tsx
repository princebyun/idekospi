import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';

export function SourceControlPanel() {
  const [gitLogs, setGitLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchGitLogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/git/log`);
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

  return (
    <div className="flex-[55] border-t border-ide-border flex flex-col min-h-0 overflow-hidden text-ide-text text-[12px] shrink-0">
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ide-text flex-shrink-0 bg-ide-sidebar border-b border-ide-border">
        소스 제어
      </div>
      {/* Commit Input Area */}
      <div className="p-3 shrink-0 border-b border-ide-border">
        <div className="flex items-center justify-between mb-2 text-[11px] cursor-pointer hover:text-white">
          <div className="flex items-center">
            <span className="mr-1">▼</span> 변경 내용
          </div>
        </div>
        <textarea 
          className="w-full h-16 bg-ide-border border border-ide-border rounded p-1.5 text-ide-text text-[12px] resize-none focus:outline-none focus:border-ide-primary"
          placeholder='메시지(Ctrl+Enter(으)로 "main"에 커밋)'
          disabled
        />
        <div className="mt-2 flex">
          <button className="flex-1 bg-ide-primary hover:bg-[#005f9e] text-white py-1 rounded text-[12px] flex items-center justify-center transition-colors disabled:opacity-50">
            ✓ 커밋
          </button>
        </div>
      </div>
      
      {/* Git Graph Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
        <div className="sticky top-0 bg-ide-sidebar p-2 flex items-center justify-between text-[11px] border-b border-ide-border shrink-0 z-20">
          <div className="flex items-center text-ide-text">
            <span className="mr-1">▼</span> 그래프
          </div>
          <div className="text-ide-text-muted">자동 ⊙ ⎇ ⟲ ↺ ...</div>
        </div>
        
        <div className="p-2 space-y-1 relative">
          <div className="absolute left-[15px] top-4 bottom-0 w-[1px] bg-ide-primary"></div>
          
          {gitLogs.length > 0 ? gitLogs.map((msg, idx) => (
            <div key={idx} className="flex items-center group cursor-pointer hover:bg-ide-hover py-0.5 rounded px-1 relative z-10">
              <div className={`w-[9px] h-[9px] rounded-full border-2 ${idx === 0 ? 'border-code-keyword bg-ide-bg' : 'border-ide-primary bg-ide-primary'} flex-shrink-0 z-10 ml-[2px] mr-2`} />
              <div className="truncate text-[11.5px] text-ide-text flex-1 mr-2" title={msg}>{msg}</div>
              {idx === 0 && (
                <div className="flex-shrink-0 flex items-center space-x-1">
                  <span className="text-[9px] border border-code-keyword text-code-keyword px-1 rounded-sm">◎ main</span>
                </div>
              )}
            </div>
          )) : (
            <div className="text-[11px] text-ide-text-muted pl-6 py-2">Loading git history...</div>
          )}
        </div>
      </div>
    </div>
  );
}
