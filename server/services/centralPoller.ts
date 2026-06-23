import { fetchYahooStock, fetchNaverStockBasic, isKoreanSymbol } from './stockFetcher';
import { broadcastMessage } from '../routes/chat';
import { updateHistoryAndCalculateRates } from './priceHistoryManager';

const DOMESTIC_LIST = ['005930.KS', '000660.KS', '005380.KS', '^KS11', '^KQ11', 'FUT', 'KRW=X'];
const GLOBAL_LIST = ['^IXIC', '^GSPC', '^DJI', 'NQ=F', 'ES=F', 'YM=F', 'QQQ', 'QQQM', 'SPY', 'TQQQ', 'SOXL', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'CL=F', 'ZN=F'];

export const startCentralPolling = () => {
  setInterval(async () => {
    try {
      const allStocks = [...DOMESTIC_LIST, ...GLOBAL_LIST];
      const promises = allStocks.map(async (symbol) => {
        try {
          const data = isKoreanSymbol(symbol) ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
          
          const { changeRate15m, changeRate30m } = updateHistoryAndCalculateRates(symbol, data.price, data.changeRate);
          
          return {
            symbol: data.symbol,
            price: data.price,
            changeRate: data.changeRate,
            changeRate15m,
            changeRate30m,
            marketState: data.marketState
          };
        } catch (err) {
          return null;
        }
      });

      const results = (await Promise.all(promises)).filter(Boolean);
      
      broadcastMessage({
        type: 'STOCK_UPDATE',
        data: results
      });
    } catch (e) {
      console.error('Central polling error:', e);
    }
  }, 5000);
};
