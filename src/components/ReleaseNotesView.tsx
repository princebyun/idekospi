export function ReleaseNotesView() {
  const renderLines = () => {
    return Array.from({ length: 30 }).map((_, i) => <div key={i}>{i + 1}</div>);
  };

  return (
    <div className="p-4 flex text-[14px]">
      <div className="text-ide-text-muted text-right pr-4 select-none w-12 shrink-0 border-r border-ide-border mr-4">
        {renderLines()}
      </div>
      <div className="text-ide-text whitespace-pre font-mono pb-20">
        <span className="text-code-comment pl-4">/** </span><br/>
        <span className="text-code-comment pl-4"> * IDE-KOSPI Release Notes & System Status </span><br/>
        <span className="text-code-comment pl-4"> * 완벽한 위장을 위한 시스템 업데이트 내역입니다. </span><br/>
        <span className="text-code-comment pl-4"> */</span><br/>
        <span className="text-code-keyword">package</span> <span className="text-ide-text">com.idekospi.system;</span><br/><br/>
        <span className="text-code-keyword">import</span> <span className="text-ide-text">java.util.List;</span><br/><br/>
        <span className="text-code-keyword2">public class</span> <span className="text-code-class">ReleaseNotes</span> <span className="text-ide-text"> {'{'}</span><br/><br/>
        
        <span className="text-code-function pl-8">@Update</span><span className="text-ide-text">(date = </span><span className="text-code-string">"2026-06-11"</span><span className="text-ide-text">, version = </span><span className="text-code-string">"v1.2.0"</span><span className="text-ide-text">)</span><br/>
        <span className="text-code-keyword pl-8">public void</span> <span className="text-code-function">updateTerminalStreaming</span><span className="text-ide-text">() {'{'}</span><br/>
        <span className="text-code-comment pl-12">// 터미널에서 관심 종목의 실시간 시세 로그 스트리밍이 활성화되었습니다.</span><br/>
        <span className="text-code-comment pl-12">// 이제 누가 터미널을 봐도 서버 로그가 올라가는 것처럼 보입니다!</span><br/>
        <span className="text-code-class pl-12">TerminalService</span><span className="text-ide-text">.</span><span className="text-code-function">enablePortfolioStream</span><span className="text-ide-text">(</span><span className="text-code-keyword">true</span><span className="text-ide-text">);</span><br/>
        <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

        <span className="text-code-function pl-8">@Update</span><span className="text-ide-text">(date = </span><span className="text-code-string">"2026-06-11"</span><span className="text-ide-text">, version = </span><span className="text-code-string">"v1.1.5"</span><span className="text-ide-text">)</span><br/>
        <span className="text-code-keyword pl-8">public void</span> <span className="text-code-function">fixSidebarLayout</span><span className="text-ide-text">() {'{'}</span><br/>
        <span className="text-code-comment pl-12">// 탐색기와 터미널 비율이 45:55로 조정되어 황금 비율을 달성했습니다.</span><br/>
        <span className="text-code-comment pl-12">// 전체 화면(F11) 전환 알림 배너가 추가되었습니다.</span><br/>
        <span className="text-code-class pl-12">SidebarLayout</span><span className="text-ide-text">.</span><span className="text-code-function">setRatio</span><span className="text-ide-text">(</span><span className="text-code-number">45</span><span className="text-ide-text">, </span><span className="text-code-number">55</span><span className="text-ide-text">);</span><br/>
        <span className="text-ide-text pl-8">{'}'}</span><br/><br/>

        <span className="text-ide-text">{'}'}</span>
      </div>
    </div>
  );
}
