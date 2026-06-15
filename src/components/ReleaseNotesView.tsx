import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

interface Release {
  hash: string;
  date: string;
  message: string;
}

export function ReleaseNotesView() {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/git/releases`);
        if (res.ok) {
          const data = await res.json();
          setReleases(data.releases || []);
        }
      } catch (e) {
        console.error('Failed to fetch releases', e);
      }
    };
    fetchReleases();
  }, []);

  const renderLines = () => {
    // 넉넉하게 100줄 렌더링
    return Array.from({ length: Math.max(30, releases.length * 7 + 10) }).map((_, i) => <div key={i}>{i + 1}</div>);
  };

  return (
    <div className="p-4 flex text-[14px]">
      <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4">
        {renderLines()}
      </div>
      <div className="text-ide-text whitespace-pre font-mono pb-20">
        <span className="text-code-comment pl-4">/** </span><br/>
        <span className="text-code-comment pl-4"> * IDE-KOSPI Release Notes & System Status </span><br/>
        <span className="text-code-comment pl-4"> * 완벽한 위장을 위한 시스템 업데이트 내역입니다. (Git 동기화) </span><br/>
        <span className="text-code-comment pl-4"> */</span><br/>
        <span className="text-code-keyword">package</span> <span className="text-ide-text">com.idekospi.system;</span><br/><br/>
        <span className="text-code-keyword">import</span> <span className="text-ide-text">java.util.List;</span><br/><br/>
        <span className="text-code-keyword2">public class</span> <span className="text-code-class">ReleaseNotes</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
        
        {releases.map((r) => {
          // 커밋 메시지에서 첫 번째 : 전까지를 함수명으로 쓰거나 hash를 씁니다
          const msgParts = r.message.split(':');
          const type = msgParts.length > 1 ? msgParts[0].replace(/[^a-zA-Z]/g, '') : 'update';
          const functionName = `${type}_${r.hash}`;

          return (
            <div key={r.hash} className="mb-6 hover:bg-[#2a2d2e] transition-colors py-1">
              <span className="text-code-function pl-8">@Update</span><span className="text-ide-text">(date = </span><span className="text-code-string">"{r.date}"</span><span className="text-ide-text">, version = </span><span className="text-code-string">"{r.hash}"</span><span className="text-ide-text">)</span><br/>
              <span className="text-code-keyword pl-8">public void</span> <span className="text-code-function">{functionName}</span><span className="text-ide-text">() {'{'}</span><br/>
              <span className="text-code-comment pl-12">// {r.message}</span><br/>
              <span className="text-code-class pl-12">SystemUpdater</span><span className="text-ide-text">.</span><span className="text-code-function">applyPatch</span><span className="text-ide-text">(</span><span className="text-code-string">"{r.hash}"</span><span className="text-ide-text">);</span><br/>
              <span className="text-ide-text pl-8">{'}'}</span><br/>
            </div>
          );
        })}

        {releases.length === 0 && (
          <div className="pl-8 text-ide-text-muted mb-6">릴리즈 노트를 불러오는 중입니다...</div>
        )}

        <span className="text-ide-text">{'}'}</span>
      </div>
    </div>
  );
}
