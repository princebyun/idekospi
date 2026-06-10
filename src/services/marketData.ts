import { useStore } from '../store/useStore';

let upbitWs: WebSocket | null = null;
let mockInterval: any = null;

export const DOMESTIC_LIST = [
  { code: '005930.KS', name: '삼성전자' },
  { code: '000660.KS', name: 'SK하이닉스' },
  { code: '005380.KS', name: '현대차' },
  { code: '^KS11', name: '코스피' },
  { code: '^KQ11', name: '코스닥' },
  { code: 'KRW=X', name: '원/달러' },
];

export const GLOBAL_LIST = [
  { code: '^IXIC', name: '나스닥' },
  { code: '^GSPC', name: 'S&P500' },
  { code: '^DJI', name: '다우' },
  { code: 'QQQ', name: 'QQQ' },
  { code: 'QQQM', name: 'QQQM' },
  { code: 'SPY', name: 'SPY' },
  { code: 'TQQQ', name: 'TQQQ' },
  { code: 'SOXL', name: 'SOXL' },
  { code: 'NVDA', name: '엔비디아' },
  { code: 'TSLA', name: '테슬라' },
  { code: 'AAPL', name: '애플' },
  { code: 'CL=F', name: 'WTI 원유' },
  { code: 'ZN=F', name: '미국채 10년' },
];

export const CRYPTO_LIST = [
  { code: 'KRW-BTC', name: 'BTC' },
  { code: 'KRW-ETH', name: 'ETH' },
  { code: 'KRW-XRP', name: 'XRP' },
  { code: 'KRW-SOL', name: 'SOL' },
  { code: 'KRW-DOGE', name: 'DOGE' },
  { code: 'KRW-ADA', name: 'ADA' },
  { code: 'KRW-TRX', name: 'TRX' },
  { code: 'KRW-SUI', name: 'SUI' },
  { code: 'KRW-XLM', name: 'XLM' },
  { code: 'KRW-LINK', name: 'LINK' },
];

export const startMarketStream = () => {
  if (upbitWs) upbitWs.close();
  if (mockInterval) clearInterval(mockInterval);
  
  // 1. Upbit 웹소켓 연결 (암호화폐)
  upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
  upbitWs.binaryType = 'blob';
  
  upbitWs.onopen = () => {
    const cryptoCodes = CRYPTO_LIST.map(c => c.code);
    upbitWs?.send(JSON.stringify([
      { ticket: "ide-kospi" },
      { type: "ticker", codes: cryptoCodes }
    ]));
  };

  upbitWs.onmessage = async (event) => {
    try {
      const text = await new Response(event.data).text();
      const data = JSON.parse(text);
      if (data.code && data.trade_price) {
        useStore.getState().updatePrice(
          data.code, 
          data.trade_price, 
          data.signed_change_rate * 100
        );
      }
    } catch (e) {
      console.error('Failed to parse websocket message', e);
    }
  };

  // 2. 백엔드 프록시 서버를 통한 실제 주식/지수 시세 (5초 주기 폴링)
  const fetchStockData = async () => {
    try {
      const allStocks = [...DOMESTIC_LIST, ...GLOBAL_LIST].map(s => s.code).join(',');
      const backendUrl = `http://${window.location.hostname}:3001`;
      const response = await fetch(`${backendUrl}/api/stocks?symbols=${allStocks}`);
      if (!response.ok) return;
      const data = await response.json();
      data.forEach((stock: any) => {
        useStore.getState().updatePrice(stock.symbol, stock.price, stock.changeRate, stock.marketState);
      });
    } catch (e) {
      console.error('Failed to fetch real stock data:', e);
    }
  };
  
  fetchStockData();
  mockInterval = setInterval(fetchStockData, 5000);
};
