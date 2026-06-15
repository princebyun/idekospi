import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from '../services/marketData';
import { API_BASE_URL } from '../config/api';

export function Terminal() {
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'error' | 'system', text: string }[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { addStock, removeStock, portfolio } = useStore();

  const MAPPING: Record<string, string> = {
    '비트코인': 'KRW-BTC',
    '이더리움': 'KRW-ETH',
    '리플': 'KRW-XRP',
    '솔라나': 'KRW-SOL',
    '도지코인': 'KRW-DOGE',
    '도지': 'KRW-DOGE',
    '애플': 'AAPL',
    'Apple': 'AAPL',
    '테슬라': 'TSLA',
    'Tesla': 'TSLA',
    '엔비디아': 'NVDA',
    'NVIDIA': 'NVDA',
    '나스닥': '^IXIC',
    '코스피': '^KS11',
    '코스닥': '^KQ11'
  };
  [...DOMESTIC_LIST, ...GLOBAL_LIST, ...CRYPTO_LIST].forEach(item => {
    MAPPING[item.name] = item.code;
  });

  // 하단 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // 실시간 포트폴리오 스트리밍 로직
  useEffect(() => {
    const intervalId = setInterval(() => {
      // 최신 상태를 useStore.getState()로 직접 가져옴 (의존성 초기화 방지)
      const currentPortfolio = useStore.getState().portfolio;
      const currentPrices = useStore.getState().prices;

      if (currentPortfolio.length === 0) return;

      // 포트폴리오에서 랜덤으로 하나 선택
      const randomItem = currentPortfolio[Math.floor(Math.random() * currentPortfolio.length)];
      const priceData = currentPrices[randomItem.code];

      if (priceData) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS

        // 부호에 따른 기호 및 상태 문자열
        const prefix = priceData.changeRate > 0 ? '+' : '';
        const status = priceData.changeRate > 0 ? 'UPTREND' : priceData.changeRate < 0 ? 'DOWNTREND' : 'STABLE';

        const marketTag = priceData.marketState === 'PRE' ? '[PRE] ' : (priceData.marketState === 'POST' || priceData.marketState === 'CLOSED' ? '[AFT] ' : '');
        const logText = `[INFO] [${timeStr}] SYSTEM_FETCH: ${randomItem.name} (${randomItem.code}) Connection OK. Tick: ${priceData.price.toLocaleString()} (${marketTag}${prefix}${priceData.changeRate.toFixed(2)}%) - ${status}`;

        setHistory(prev => {
          const next = [...prev, { type: 'system' as const, text: logText }];
          // 100개 이상이면 오래된 것 삭제하여 메모리 최적화
          if (next.length > 100) return next.slice(next.length - 100);
          return next;
        });
      }
    }, 4500); // 4.5초마다 하나씩 로그 찍음

    return () => clearInterval(intervalId);
  }, []);

  const handleCommand = async (cmd: string): Promise<string[]> => {
    const args = cmd.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    if (command === 'help') {
      return [
        '[사용 가능한 명령어]',
        '  add <종목명> [단가] [수량] : 관심 종목 추가 (예: add 삼성전자 65000 10)',
        '  rm <종목명>                : 관심 종목에서 제거 (예: rm 삼성전자)',
        '  alert <종목명> <UP|DOWN> <가격> : 목표가 알림 설정 (예: alert AAPL UP 300)',
        '  portfolio                  : 포트폴리오 수익률 대시보드 조회',
        '  clear                      : 터미널 화면 지우기',
        '',
        '[유용한 단축키]',
        '  Ctrl + P      : 종목 빠른 검색 및 추가 (Quick Open)',
        '  Ctrl + B      : 좌측 탐색기(사이드바) 열기/닫기',
        '  Ctrl + \\      : 하단 터미널 열기/닫기',
        '  ESC (2번 연속): 보스 모드 (진짜 개발 화면으로 위장)',
      ];
    }

    if (command === 'clear') {
      setHistory([]);
      return [];
    }

    if (command === 'alert') {
      if (args.length < 4) return ['Error: Usage: alert <name> <UP|DOWN> <price>'];
      const targetPrice = parseFloat(args[args.length - 1].replace(/,/g, ''));
      const direction = args[args.length - 2].toUpperCase();
      const parsedName = args.slice(1, args.length - 2).join(' ');

      if (isNaN(targetPrice)) return ['Error: Invalid target price.'];
      if (direction !== 'UP' && direction !== 'DOWN') return ['Error: Direction must be UP or DOWN.'];

      let code = MAPPING[parsedName] || MAPPING[parsedName.toUpperCase()];
      let finalName = parsedName;

      if (!code) {
        // 로컬에 없으면 API 검색
        try {
          const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(parsedName)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              code = data[0].code;
              finalName = data[0].name;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!code) return [`Error: "${parsedName}" 검색 결과가 없습니다.`];

      // 알림 권한 요청
      if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }

      useStore.getState().addAlert({ code, name: finalName, targetPrice, direction });
      return [`[ALERT] ${finalName} 가격이 ${targetPrice.toLocaleString()}원 ${direction === 'UP' ? '이상이' : '이하가'} 되면 알림을 보냅니다.`];
    }
    
    if (command === 'portfolio' || command === 'pf') {
      const prices = useStore.getState().prices;
      if (portfolio.length === 0) return ['포트폴리오가 비어있습니다.'];
      
      const lines = [
        '======================================================',
        '                  PORTFOLIO DASHBOARD                 ',
        '======================================================'
      ];
      
      let totalInvestment = 0;
      let totalCurrentValue = 0;

      portfolio.forEach(p => {
        const currentData = prices[p.code];
        const currentPrice = currentData ? currentData.price : 0;
        
        let row = `${p.name} (${p.code})`;
        if (p.buyPrice && p.amount) {
          const investment = p.buyPrice * p.amount;
          const currentValue = currentPrice * p.amount;
          const profit = currentValue - investment;
          const profitRate = (profit / investment) * 100;
          
          totalInvestment += investment;
          totalCurrentValue += currentValue;
          
          row += ` | 매수: ${p.buyPrice.toLocaleString()} x ${p.amount}`;
          row += ` | 현재가: ${currentPrice.toLocaleString()}`;
          row += ` | 손익: ${profitRate > 0 ? '+' : ''}${profitRate.toFixed(2)}%`;
        } else {
          row += ` | 현재가: ${currentPrice.toLocaleString()} (매수단가 미입력)`;
        }
        lines.push(row);
      });
      
      if (totalInvestment > 0) {
        const totalProfit = totalCurrentValue - totalInvestment;
        const totalProfitRate = (totalInvestment === 0) ? 0 : (totalProfit / totalInvestment) * 100;
        lines.push('------------------------------------------------------');
        lines.push(`총 매수금액: ${totalInvestment.toLocaleString()}`);
        lines.push(`총 평가금액: ${totalCurrentValue.toLocaleString()}`);
        lines.push(`총 수익률: ${totalProfitRate > 0 ? '+' : ''}${totalProfitRate.toFixed(2)}%`);
      }
      
      lines.push('======================================================');
      return lines;
    }

    if (command === 'buy' || command === 'add') {
      if (args.length < 2) return ['Error: Usage: add <name> [buyPrice] [amount]'];
      
      let parsedName = args.slice(1).join(' ');
      let buyPrice: number | undefined;
      let amount: number | undefined;
      
      if (args.length >= 4) {
        const possibleAmount = parseFloat(args[args.length - 1].replace(/,/g, ''));
        const possiblePrice = parseFloat(args[args.length - 2].replace(/,/g, ''));
        if (!isNaN(possibleAmount) && !isNaN(possiblePrice)) {
          amount = possibleAmount;
          buyPrice = possiblePrice;
          parsedName = args.slice(1, args.length - 2).join(' ');
        }
      }

      let code = MAPPING[parsedName] || MAPPING[parsedName.toUpperCase()];
      let finalName = parsedName;

      if (!code) {
        // 로컬에 없으면 API 검색
        try {
          const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(parsedName)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              // 가장 유사도가 높은 첫 번째 결과 선택
              code = data[0].code;
              finalName = data[0].name;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!code) {
        return [`Error: "${parsedName}" 검색 결과가 없습니다. (전체 시장 검색 실패)`];
      }

      if (portfolio.some(s => s.code === code)) {
        return [`Error: "${finalName}" (${code}) 은(는) 이미 내 관심 종목(포트폴리오)에 존재합니다.`];
      }

      addStock({ name: finalName, code, buyPrice, amount });
      return [`Successfully added ${finalName} (${code}) to portfolio.`];
    }

    if (command === 'rm' || command === 'rm-rf' || command === 'rm -rf') {
      const name = args.slice(1).join(' ');
      if (!name) return ['Error: Usage: rm <name>'];

      const target = portfolio.find(s =>
        s.name === name ||
        s.code === name ||
        s.name.replace(/ /g, '_') === name
      );
      if (target) {
        removeStock(target.id);
        return [`Successfully removed ${target.name} from portfolio.`];
      }
      return [`Error: Could not find ${name} in portfolio.`];
    }

    return [`Command not found: ${command}`];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'input' as const, text: input }];
    // 낙관적 업데이트로 입력줄 먼저 표시
    setHistory(newHistory);
    setInput('');

    const outputLines = await handleCommand(input);

    if (outputLines.length > 0) {
      setHistory(prev => {
        const next = [...prev];
        outputLines.forEach(line => {
          next.push({
            type: line.startsWith('Error') ? 'error' : 'output',
            text: line
          });
        });
        return next;
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-ide-bg font-mono text-[13px] border-t border-ide-border">
      <div className="flex items-center px-4 h-8 text-[#e7e7e7] uppercase tracking-wider text-xs font-semibold select-none bg-ide-sidebar">
        <TerminalIcon size={14} className="mr-2" />
        Terminal
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* 상단 고정 도움말 (Sticky Header) - 패딩과 배경색을 확실히 지정하여 스크롤 오버랩 방지 */}
        <div className="sticky top-0 bg-ide-bg z-10 px-4 py-3 border-b border-ide-border shrink-0 shadow-sm">
          <div className="text-ide-text-muted font-bold mb-1">IDE-KOSPI 터미널에 오신 것을 환영합니다.</div>
          <div className="text-ide-text-muted">IDE-KOSPI의 사용법을 보려면 터미널에 help를 입력해보세요.</div>
        </div>

        <div className="p-4 flex-1">
          {history.map((line, i) => (
            <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-[#f48771]' : line.type === 'input' ? 'text-ide-text' : line.type === 'system' ? 'text-code-comment' : 'text-ide-text-muted'}`}>
              {line.type === 'input' && <span className="text-[#519657] mr-2">➜</span>}
              {line.text}
            </div>
          ))}

          <form onSubmit={onSubmit} className="flex items-center mt-2">
            <span className="text-[#519657] mr-2">➜</span>
            <span className="text-[#4fc1ff] mr-2">~</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-ide-text"
              autoFocus
              spellCheck={false}
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
