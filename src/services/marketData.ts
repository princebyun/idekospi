import { useStore } from '../store/useStore';

let upbitWs: WebSocket | null = null;
let mockInterval: any = null;

// CORS 우회를 위해 국내/해외 주식은 가상의 등락을 발생시킴 (프론트엔드 전용 구성)
const MOCK_STOCKS = [
  { code: '005930', name: '삼성전자', basePrice: 81000 },
  { code: '000660', name: 'SK하이닉스', basePrice: 175000 },
  { code: '035420', name: 'NAVER', basePrice: 195000 },
  { code: 'AAPL', name: 'Apple Inc.', basePrice: 190 },
];

export const startMarketStream = () => {
  if (upbitWs) upbitWs.close();
  if (mockInterval) clearInterval(mockInterval);
  
  // 1. Upbit 웹소켓 연결 (암호화폐 실시간 시세 - CORS 없이 브라우저에서 직접 연결 가능)
  upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
  upbitWs.binaryType = 'blob';
  
  upbitWs.onopen = () => {
    upbitWs?.send(JSON.stringify([
      { ticket: "ide-kospi" },
      { type: "ticker", codes: ["KRW-BTC", "KRW-ETH", "KRW-XRP", "KRW-SOL", "KRW-DOGE"] }
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

  // 2. 가상의 주식 시세 스트리밍 (2초마다 미세하게 변동시킴)
  mockInterval = setInterval(() => {
    MOCK_STOCKS.forEach(stock => {
      const volatility = 0.002; // 0.2% 변동성
      const randomChange = 1 + (Math.random() * volatility * 2 - volatility);
      const state = useStore.getState();
      const currentPrice = state.prices[stock.code]?.price || stock.basePrice;
      
      const newPrice = Math.round(currentPrice * randomChange * 100) / 100;
      const changeRate = ((newPrice - stock.basePrice) / stock.basePrice) * 100;
      
      state.updatePrice(stock.code, newPrice, changeRate);
    });
  }, 2000);
};
