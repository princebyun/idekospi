

export function PolicyView() {
  return (
    <div className="p-6 h-full overflow-y-auto text-ide-text custom-scrollbar bg-ide-bg font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ide-primary mb-2 flex items-center">
            <svg width="24" height="24" viewBox="0 0 16 16" className="mr-2" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path>
            </svg>
            이용 약관 및 면책 조항 (Policy)
          </h1>
          <p className="text-ide-text-muted">IDE-KOSPI 서비스 이용 전 필독 사항입니다.</p>
        </div>

        <div className="bg-[#1e1e1e] border border-ide-border rounded-md overflow-hidden">
          <div className="p-6 text-[13px] text-gray-300 space-y-6 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1">1. 정보의 출처 및 지연</h3>
              <p>본 서비스(IDE-KOSPI)에서 제공하는 주식, 암호화폐, 환율 등의 시세 정보는 네이버 증권, Yahoo Finance, 업비트 등 외부 API를 통해 수집됩니다. 제공되는 정보는 실제 거래소 시세와 비교해 지연(15~20분)이 발생할 수 있으며, 시스템 오류로 인해 부정확할 수 있습니다.</p>
            </section>
            <section>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1 mt-6">2. 투자 결과에 대한 면책</h3>
              <p>본 서비스는 단순 참고용으로만 제공되며, 투자 권유나 종목 추천을 목적으로 하지 않습니다. 사용자가 본 서비스의 정보를 바탕으로 수행한 모든 투자 및 거래 결과에 대한 책임은 전적으로 사용자 본인에게 있으며, 개발자는 어떠한 법적, 금전적 책임도 지지 않습니다.</p>
            </section>
            <section>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1 mt-6">3. 서비스의 변경 및 중단</h3>
              <p>개발자는 사전 통지 없이 서비스의 일부 또는 전체를 변경, 일시 정지, 또는 영구 종료할 권리를 가집니다. 외부 API 정책 변경 시 예고 없이 특정 기능이 동작하지 않을 수 있습니다.</p>
            </section>
            <section>
              <h3 className="text-lg font-semibold text-[#69b4d8] mb-2 border-b border-[#333] pb-1 mt-6">4. 커뮤니티 및 종목토론방 운영 규정</h3>
              <p>욕설, 비방, 허위사실 유포, 스팸 및 불법 정보 게시물은 사전 경고 없이 자동 필터링 되거나 삭제될 수 있습니다. 쾌적한 이용 환경을 위해 상호 존중 부탁드립니다.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
