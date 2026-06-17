import { useStore } from '../store/useStore';
import { DOMESTIC_LIST, GLOBAL_LIST, CRYPTO_LIST } from './marketData';
import { API_BASE_URL } from '../config/api';

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

export const handleTerminalCommand = async (cmd: string): Promise<string[]> => {
  const args = cmd.trim().split(/\s+/);
  const command = args[0].toLowerCase();
  
  const state = useStore.getState();
  const { portfolio, balance, holdings, buyStock, sellStock, prices, addStock, removeStock, addAlert } = state;

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
    return []; // Handled by component
  }

  if (command === 'portfolio' || command === 'pf') {
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
  
  if (command === 'balance') {
    const formattedBalance = Math.floor(balance).toLocaleString();
    let totalValue = balance;
    const lines = [
      '--- 모의투자 계좌 현황 ---',
      `예수금: ₩${formattedBalance}`
    ];
    if (holdings.length > 0) {
      lines.push('보유 종목:');
      holdings.forEach(h => {
        const currentPrice = prices[h.code]?.price || h.avgPrice;
        const isCrypto = h.code.includes('-');
        const isGlobal = !h.code.endsWith('.KS') && !h.code.endsWith('.KQ') && !isCrypto;
        const exchangeRate = prices['KRW=X']?.price || 1400;
        
        let currentPriceKRW = currentPrice;
        if (isGlobal && !isCrypto) {
          currentPriceKRW = currentPrice * exchangeRate;
        }
        
        const value = currentPriceKRW * h.amount;
        totalValue += value;
        const returnRate = ((currentPriceKRW / (h.avgPrice * (isGlobal && !isCrypto ? exchangeRate : 1))) - 1) * 100;
        
        lines.push(`- ${h.name} (${h.code}): ${h.amount}주 | 수익률: ${returnRate > 0 ? '+' : ''}${returnRate.toFixed(2)}% | 평가금: ₩${Math.floor(value).toLocaleString()}`);
      });
    }
    lines.push(`총 평가 자산: ₩${Math.floor(totalValue).toLocaleString()}`);
    return lines;
  }

  if (command === 'buy' || command === 'sell') {
    if (args.length < 3) {
      return [`사용법: ${command} [종목명] [수량] (예: ${command} 삼성전자 10)`];
    }
    const keyword = args[1];
    const amount = parseInt(args[2], 10);
    
    if (isNaN(amount) || amount <= 0) {
      return ['수량은 1 이상의 숫자여야 합니다.'];
    }

    let code = MAPPING[keyword] || keyword.toUpperCase();
    let name = keyword;
    
    if (!prices[code]) {
      const found = portfolio.find(p => p.name.includes(keyword) || p.name.replace(/\s/g, '').includes(keyword) || p.code === code);
      if (found) {
        code = found.code;
        name = found.name;
      } else {
        return [`'${keyword}' 종목의 현재 시세 정보를 찾을 수 없습니다. (시세 탭에 추가되어 있어야 매매 가능)`];
      }
    } else {
      const found = portfolio.find(p => p.code === code);
      if (found) name = found.name;
    }

    const currentPrice = prices[code].price;
    if (!currentPrice) return ['현재가 정보를 가져올 수 없습니다.'];

    const isGlobal = !code.endsWith('.KS') && !code.endsWith('.KQ') && !code.includes('-');
    const exchangeRate = prices['KRW=X']?.price || 1400;
    let krwPrice = currentPrice;
    
    if (isGlobal) {
        krwPrice = currentPrice * exchangeRate;
    }

    if (command === 'buy') {
      const res = buyStock(code, name, krwPrice, amount);
      return [res.message];
    } else {
      const res = sellStock(code, krwPrice, amount);
      return [res.message];
    }
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

    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    addAlert({ code, name: finalName, targetPrice, direction: direction as 'UP' | 'DOWN' });
    return [`[ALERT] ${finalName} 가격이 ${targetPrice.toLocaleString()}원 ${direction === 'UP' ? '이상이' : '이하가'} 되면 알림을 보냅니다.`];
  }

  if (command === 'add') {
    if (args.length < 2) return ['Error: Usage: add <name> [buyPrice] [amount]'];
    
    let parsedName = args.slice(1).join(' ');
    let buyPrice: number | undefined;
    let addAmount: number | undefined;
    
    if (args.length >= 4) {
      const possibleAmount = parseFloat(args[args.length - 1].replace(/,/g, ''));
      const possiblePrice = parseFloat(args[args.length - 2].replace(/,/g, ''));
      if (!isNaN(possibleAmount) && !isNaN(possiblePrice)) {
        addAmount = possibleAmount;
        buyPrice = possiblePrice;
        parsedName = args.slice(1, args.length - 2).join(' ');
      }
    }

    let code = MAPPING[parsedName] || MAPPING[parsedName.toUpperCase()];
    let finalName = parsedName;

    if (!code) {
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

    if (!code) {
      return [`Error: "${parsedName}" 검색 결과가 없습니다. (전체 시장 검색 실패)`];
    }

    if (portfolio.some(s => s.code === code)) {
      return [`Error: "${finalName}" (${code}) 은(는) 이미 내 관심 종목(포트폴리오)에 존재합니다.`];
    }

    addStock({ name: finalName, code, buyPrice, amount: addAmount });
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
