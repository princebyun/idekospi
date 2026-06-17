import { Bell, AlertTriangle, Check, Users, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';

export function StatusBar() {
  const { prices, onlineUsers, wsStatus } = useStore();
  const [showTerms, setShowTerms] = useState(false);
  
  const [tickerIndex, setTickerIndex] = useState(0);

  // 표시할 지수/대표종목 그룹
  const tickerGroups = [
    [
      { label: 'KOSPI', code: '^KS11', isCurrency: false },
      { label: 'KOSDAQ', code: '^KQ11', isCurrency: false }
    ],
    [
      { label: 'NASDAQ', code: '^IXIC', isCurrency: false },
      { label: 'S&P500', code: '^GSPC', isCurrency: false }
    ],
    [
      { label: 'USD/KRW', code: 'KRW=X', isCurrency: true },
      { label: 'BTC', code: 'KRW-BTC', isCurrency: false }
    ]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerGroups.length);
    }, 4000); // 4초마다 롤링
    return () => clearInterval(interval);
  }, [tickerGroups.length]);

  const currentGroup = tickerGroups[tickerIndex];

  return (
    <div className="h-[22px] bg-ide-primary text-white text-[11px] flex items-center justify-between px-2 select-none flex-shrink-0 cursor-default">
      <div className="flex items-center space-x-3">
        {/* 경고 아이콘 */}
        <div className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors cursor-help" title="Market Data Status">
          <AlertTriangle size={13} className="text-[#ffcc00]" />
          <span>국장: 실시간 | 미장: 정규장/프리/애프터마켓 실시간 | 데이마켓: 미지원</span>
        </div>
        
        {/* 지수 롤링 표시 */}
        <div className="flex items-center space-x-4 bg-[#1f8ad2] px-3 rounded h-[18px] min-w-[250px] transition-all duration-500 overflow-hidden relative">
          {currentGroup.map((item) => {
            const data = prices[item.code];
            if (!data) return <span key={item.code} className="w-1/2 flex items-center justify-center text-ide-text animate-pulse">Loading {item.label}...</span>;
            
            const isUp = data.changeRate >= 0;
            const colorClass = isUp ? "text-[#ff9d9d]" : "text-[#8cb4ff]";
            const prefix = isUp ? '+' : '';
            const marketTag = data.marketState === 'PRE' ? '[PRE] ' : (data.marketState === 'POST' || data.marketState === 'CLOSED' ? '[AFT] ' : '');
            
            return (
              <span key={item.code} className="w-1/2 flex items-center justify-start space-x-1 animate-fade-in">
                <span className="font-semibold">{item.label}</span>
                <span>
                  {item.isCurrency ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : data.price.toLocaleString()}
                </span>
                <span className={colorClass}>
                  ({marketTag}{prefix}{data.changeRate.toFixed(2)}%)
                </span>
              </span>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center space-x-1 transition-colors" title="WebSocket 상태">
          <span className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-[#519657]' : wsStatus === 'connecting' ? 'bg-[#ffca28] animate-pulse' : 'bg-[#cc3e44]'}`}></span>
          <span className="capitalize">{wsStatus}</span>
        </div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center space-x-1 transition-colors" title="현재 접속 중인 사용자 수">
          <Users size={12} />
          <span>{onlineUsers} Online</span>
        </div>
        <div 
          onClick={() => setShowTerms(true)}
          className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center" 
          title="이용 약관 및 면책 조항 (Policy)"
        >
          <Info size={13} className="mr-1" />
          <span className="text-ide-text">Not for Trading</span>
        </div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center space-x-1 transition-colors">
          <Check size={14} className="mr-1" />
          <span>Prettier</span>
        </div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">UTF-8</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded transition-colors">TypeScript React</div>
        <div className="hover:bg-[#1f8ad2] px-2 py-0.5 rounded flex items-center transition-colors">
          <Bell size={13} />
        </div>
      </div>

      {/* 이용약관 (Policy) 모달 */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl w-[600px] max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#3c3c3c]">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Info size={18} className="mr-2 text-ide-primary" />
                이용 약관 및 면책 조항 (Policy)
              </h2>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-[13px] text-gray-300 space-y-4 leading-relaxed custom-scrollbar">
              <section>
                <h3 className="font-bold text-white mb-1">1. 정보의 출처 및 지연</h3>
                <p>본 서비스(IDE-KOSPI)에서 제공하는 주식, 암호화폐, 환율 등의 시세 정보는 네이버 증권, Yahoo Finance, 업비트 등 외부 API를 통해 수집됩니다. 제공되는 정보는 실제 거래소 시세와 비교해 지연(15~20분)이 발생할 수 있으며, 시스템 오류로 인해 부정확할 수 있습니다.</p>
              </section>
              <section>
                <h3 className="font-bold text-white mb-1">2. 투자 결과에 대한 면책</h3>
                <p>본 서비스는 단순 참고용으로만 제공되며, 투자 권유나 종목 추천을 목적으로 하지 않습니다. 사용자가 본 서비스의 정보를 바탕으로 수행한 모든 투자 및 거래 결과에 대한 책임은 전적으로 사용자 본인에게 있으며, 개발자는 어떠한 법적, 금전적 책임도 지지 않습니다.</p>
              </section>
              <section>
                <h3 className="font-bold text-white mb-1">3. 서비스의 변경 및 중단</h3>
                <p>개발자는 사전 통지 없이 서비스의 일부 또는 전체를 변경, 일시 정지, 또는 영구 종료할 권리를 가집니다. 외부 API 정책 변경 시 예고 없이 특정 기능이 동작하지 않을 수 있습니다.</p>
              </section>
              <section>
                <h3 className="font-bold text-white mb-1">4. 커뮤니티 및 종목토론방 운영 규정</h3>
                <p>욕설, 비방, 허위사실 유포, 스팸 및 불법 정보 게시물은 사전 경고 없이 자동 필터링 되거나 삭제될 수 있습니다. 쾌적한 이용 환경을 위해 상호 존중 부탁드립니다.</p>
              </section>
            </div>
            <div className="p-4 border-t border-[#3c3c3c] flex justify-end bg-[#252526] rounded-b-lg">
              <button 
                onClick={() => setShowTerms(false)} 
                className="px-4 py-2 bg-ide-primary hover:bg-[#005f9e] text-white rounded text-[13px] transition-colors"
              >
                동의하고 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
