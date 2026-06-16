import { useStore } from '../store/useStore';

let upbitWs: WebSocket | null = null;

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
  { code: 'BTC-USD', name: 'BTC(Global)' },
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

        // 김프 계산 (KRW-BTC가 업데이트 될 때)
        if (data.code === 'KRW-BTC') {
          const prices = useStore.getState().prices;
          const btcUsd = prices['BTC-USD']?.price;
          const exchangeRate = prices['KRW=X']?.price;
          
          if (btcUsd && exchangeRate) {
            const upbitPrice = data.trade_price;
            const globalPriceKRW = btcUsd * exchangeRate;
            const premium = ((upbitPrice - globalPriceKRW) / globalPriceKRW) * 100;
            useStore.getState().setKimchiPremium(premium);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse websocket message', e);
    }
  };
};
