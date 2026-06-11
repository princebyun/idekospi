export function ReleaseNotesView() {
  const renderLines = () => {
    return Array.from({ length: 30 }).map((_, i) => <div key={i}>{i + 1}</div>);
  };

  return (
    <div className="p-4 flex text-[14px]">
      <div className="text-[#858585] text-right pr-4 select-none w-12 shrink-0 border-r border-[#404040] mr-4">
        {renderLines()}
      </div>
      <div className="text-[#d4d4d4] whitespace-pre font-mono pb-20">
        <span className="text-[#6a9955] pl-4">/** </span><br/>
        <span className="text-[#6a9955] pl-4"> * IDE-KOSPI Release Notes & System Status </span><br/>
        <span className="text-[#6a9955] pl-4"> * 완벽한 위장을 위한 시스템 업데이트 내역입니다. </span><br/>
        <span className="text-[#6a9955] pl-4"> */</span><br/>
        <span className="text-[#569cd6]">package</span> <span className="text-[#d4d4d4]">com.idekospi.system;</span><br/><br/>
        <span className="text-[#569cd6]">import</span> <span className="text-[#d4d4d4]">java.util.List;</span><br/><br/>
        <span className="text-[#c586c0]">public class</span> <span className="text-[#4ec9b0]">ReleaseNotes</span> <span className="text-[#d4d4d4]"> {'{'}</span><br/><br/>
        
        <span className="text-[#dcdcaa] pl-8">@Update</span><span className="text-[#d4d4d4]">(date = </span><span className="text-[#ce9178]">"2026-06-11"</span><span className="text-[#d4d4d4]">, version = </span><span className="text-[#ce9178]">"v1.2.0"</span><span className="text-[#d4d4d4]">)</span><br/>
        <span className="text-[#569cd6] pl-8">public void</span> <span className="text-[#dcdcaa]">updateTerminalStreaming</span><span className="text-[#d4d4d4]">() {'{'}</span><br/>
        <span className="text-[#6a9955] pl-12">// 터미널에서 관심 종목의 실시간 시세 로그 스트리밍이 활성화되었습니다.</span><br/>
        <span className="text-[#6a9955] pl-12">// 이제 누가 터미널을 봐도 서버 로그가 올라가는 것처럼 보입니다!</span><br/>
        <span className="text-[#4ec9b0] pl-12">TerminalService</span><span className="text-[#d4d4d4]">.</span><span className="text-[#dcdcaa]">enablePortfolioStream</span><span className="text-[#d4d4d4]">(</span><span className="text-[#569cd6]">true</span><span className="text-[#d4d4d4]">);</span><br/>
        <span className="text-[#d4d4d4] pl-8">{'}'}</span><br/><br/>

        <span className="text-[#dcdcaa] pl-8">@Update</span><span className="text-[#d4d4d4]">(date = </span><span className="text-[#ce9178]">"2026-06-11"</span><span className="text-[#d4d4d4]">, version = </span><span className="text-[#ce9178]">"v1.1.5"</span><span className="text-[#d4d4d4]">)</span><br/>
        <span className="text-[#569cd6] pl-8">public void</span> <span className="text-[#dcdcaa]">fixSidebarLayout</span><span className="text-[#d4d4d4]">() {'{'}</span><br/>
        <span className="text-[#6a9955] pl-12">// 탐색기와 터미널 비율이 45:55로 조정되어 황금 비율을 달성했습니다.</span><br/>
        <span className="text-[#6a9955] pl-12">// 전체 화면(F11) 전환 알림 배너가 추가되었습니다.</span><br/>
        <span className="text-[#4ec9b0] pl-12">SidebarLayout</span><span className="text-[#d4d4d4]">.</span><span className="text-[#dcdcaa]">setRatio</span><span className="text-[#d4d4d4]">(</span><span className="text-[#b5cea8]">45</span><span className="text-[#d4d4d4]">, </span><span className="text-[#b5cea8]">55</span><span className="text-[#d4d4d4]">);</span><br/>
        <span className="text-[#d4d4d4] pl-8">{'}'}</span><br/><br/>

        <span className="text-[#d4d4d4]">{'}'}</span>
      </div>
    </div>
  );
}
