

export function TerminalHelpView() {
  return (
    <div className="p-6 h-full overflow-y-auto text-ide-text custom-scrollbar bg-ide-bg font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ide-primary mb-2 flex items-center">
            <svg width="24" height="24" viewBox="0 0 16 16" className="mr-2" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.5 2A1.5 1.5 0 001 3.5v9A1.5 1.5 0 002.5 14h11a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0013.5 2h-11zM2 3.5A.5.5 0 012.5 3h11a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-9zm4.646 2.146l3.5 3.5a.5.5 0 010 .708l-3.5 3.5-.708-.708L9.293 8.5 5.938 5.146l.708-.708z"></path>
            </svg>
            Terminal Commands Reference
          </h1>
          <p className="text-ide-text-muted">IDE-KOSPI 터미널 명령어 가이드입니다.</p>
        </div>

        <div className="bg-[#1e1e1e] border border-ide-border rounded-md overflow-hidden">
          <div className="px-4 py-2 bg-[#2d2d2d] border-b border-ide-border text-xs font-semibold text-gray-300">
            Available Commands
          </div>
          <div className="p-4 space-y-4">
            
            {/* 포트폴리오 관리 */}
            <div>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1">1. 포트폴리오(관심종목) 관리</h3>
              <div className="space-y-3">
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">add</span>
                    <span className="text-[#9cdcfe]">[종목코드/명]</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">탐색기(포트폴리오)에 종목을 추가합니다.</p>
                  <p className="text-gray-400 mt-0.5 text-xs">예시: <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">add 삼성전자</span> 또는 <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">add AAPL</span></p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">remove</span>
                    <span className="text-[#9cdcfe]">[종목코드/명]</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">탐색기(포트폴리오)에서 종목을 제거합니다.</p>
                  <p className="text-gray-400 mt-0.5 text-xs">예시: <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">remove 005930</span></p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">portfolio</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">현재 등록된 포트폴리오 종목 목록을 터미널에 출력합니다.</p>
                </div>
              </div>
            </div>

            {/* 모의투자 */}
            <div>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1 mt-6">2. 모의투자 (Paper Trading)</h3>
              <div className="space-y-3">
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">buy</span>
                    <span className="text-[#9cdcfe]">[종목명/코드] [수량]</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">현재가로 종목을 가상 매수합니다.</p>
                  <p className="text-gray-400 mt-0.5 text-xs">예시: <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">buy TSLA 10</span> (테슬라 10주 매수)</p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">sell</span>
                    <span className="text-[#9cdcfe]">[종목명/코드] [수량]</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">보유 중인 종목을 가상 매도합니다.</p>
                  <p className="text-gray-400 mt-0.5 text-xs">예시: <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">sell 삼성전자 5</span> (삼성전자 5주 매도)</p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">balance</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">현재 예수금, 보유 주식, 평가 수익률을 확인합니다.</p>
                </div>
              </div>
            </div>

            {/* 시스템 명령어 */}
            <div>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1 mt-6">3. 시스템 설정</h3>
              <div className="space-y-3">
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">theme</span>
                    <span className="text-[#9cdcfe]">[dark/light/intellij]</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">에디터의 코드 문법 강조 테마를 변경합니다.</p>
                  <p className="text-gray-400 mt-0.5 text-xs">예시: <span className="text-ide-text bg-[#2d2d2d] px-1 rounded">theme intellij</span></p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">clear</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">터미널의 출력 내역을 모두 지웁니다.</p>
                </div>
                <div className="pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#ce9178] font-bold">help</span>
                  </div>
                  <p className="text-ide-text-muted mt-1 text-sm">터미널에서 사용 가능한 명령어 목록을 출력합니다.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
