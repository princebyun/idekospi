import { useStore } from '../../store/useStore';

const etfs = [
  {
    code: '133690.KS',
    name: 'TIGER 미국나스닥100',
    icon: '📈',
    author: '미래에셋자산운용',
    description: '미국 나스닥 100 지수를 추종하는 국내 상장 대표 ETF. 빅테크 투자에 필수적인 확장 프로그램입니다.'
  },
  {
    code: '069500.KS',
    name: 'KODEX 200',
    icon: '📊',
    author: '삼성자산운용',
    description: '대한민국 KOSPI 200 지수를 추종하는 가장 기본적이고 필수적인 코어 익스텐션입니다.'
  },
  {
    code: '458730.KS',
    name: 'TIGER 미국배당+7%',
    fullName: 'TIGER 미국배당+7%프리미엄다우존스',
    icon: '💰',
    author: '미래에셋자산운용',
    description: '미국 배당주 투자와 커버드콜 전략을 통해 연 7% 수준의 배당을 목표로 하는 수익형 모듈입니다.'
  }
];

export function ExtensionsView() {
  const { portfolio, addStock } = useStore();

  const handleAddStock = (code: string, name: string) => {
    if (portfolio.some(p => p.code === code)) {
      alert(`[${name}] 패키지가 이미 설치되어 있습니다.`);
      return;
    }
    
    addStock({ code, name });
    alert(`[${name}] 패키지가 포트폴리오에 성공적으로 설치되었습니다!\n\n좌측 상단 '탐색기(Explorer)' 탭의 파일 목록에서 확인하실 수 있습니다.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-0 text-ide-text custom-scrollbar">
      <div className="px-4 pt-4 pb-2 text-[11px] text-ide-text-muted uppercase">ETF 탐색기 (마켓)</div>
      <div className="px-4 mb-4 text-[12px] leading-relaxed text-ide-text-muted">
        Marketplace에서 인기 ETF를 검색하고 'Install'하여 시세 탭에 추가하세요.
      </div>
      
      <div className="space-y-4">
        {etfs.map((etf, i) => (
          <div key={i} className={`px-4 flex ${i === etfs.length - 1 ? 'mb-4' : ''}`}>
            <div className="w-10 h-10 bg-[#333333] rounded mr-3 flex items-center justify-center shrink-0">
              <span className="text-xl">{etf.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#4fc1ff] text-[13px] truncate">{etf.fullName || etf.name}</div>
              <div className="text-[11px] text-ide-text-muted truncate mb-1">{etf.author} | {etf.code}</div>
              <div className="text-[11px] text-ide-text line-clamp-2 leading-snug">{etf.description}</div>
              <div className="mt-2 flex space-x-2">
                <button 
                  onClick={() => handleAddStock(etf.code, etf.name)}
                  className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-2 py-0.5 rounded text-[11px] transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
