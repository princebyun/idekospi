import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import stockRoutes from './routes/stocks';
import gitRoutes from './routes/git';
import newsRoutes from './routes/news';
import { chatRouter, setupChatWebSocket } from './routes/chat';

const app = express();
app.use(cors());

// 라우트 등록
app.use(stockRoutes);
app.use(gitRoutes);
app.use(newsRoutes);
app.use(chatRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupChatWebSocket(wss);

import { fetchYahooStock, fetchNaverStockBasic } from './services/stockFetcher';
import { broadcastMessage } from './routes/chat';

const DOMESTIC_LIST = ['005930.KS', '000660.KS', '005380.KS', '^KS11', '^KQ11', 'KRW=X'];
const GLOBAL_LIST = ['^IXIC', '^GSPC', '^DJI', 'QQQ', 'QQQM', 'SPY', 'TQQQ', 'SOXL', 'NVDA', 'TSLA', 'AAPL', 'BTC-USD', 'CL=F', 'ZN=F'];

interface PriceSnapshot {
  timestamp: number;
  price: number;
}
const priceHistory = new Map<string, PriceSnapshot[]>();

const updateHistoryAndCalculateRates = (symbol: string, currentPrice: number, dailyChangeRate: number) => {
  const now = Date.now();
  let history = priceHistory.get(symbol) || [];
  
  // Add current price
  history.push({ timestamp: now, price: currentPrice });
  
  // Remove data older than 35 minutes to save memory
  history = history.filter(s => now - s.timestamp <= 35 * 60 * 1000);
  priceHistory.set(symbol, history);
  
  // Find closest snapshot to 15m and 30m ago
  const getOldPrice = (minutesAgo: number) => {
    const targetTime = now - minutesAgo * 60 * 1000;
    let closest = history[0];
    let minDiff = Infinity;
    for (const snap of history) {
      const diff = Math.abs(snap.timestamp - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = snap;
      }
    }
    // If not enough history, return current price (0% change)
    if (now - closest.timestamp < (minutesAgo / 2) * 60 * 1000) return currentPrice;
    return closest.price;
  };

  const price15m = getOldPrice(15);
  const price30m = getOldPrice(30);

  const changeRate15m = price15m ? ((currentPrice - price15m) / price15m) * 100 : 0;
  const changeRate30m = price30m ? ((currentPrice - price30m) / price30m) * 100 : 0;

  return { changeRate15m, changeRate30m };
};

const startCentralPolling = () => {
  setInterval(async () => {
    try {
      const allStocks = [...DOMESTIC_LIST, ...GLOBAL_LIST];
      const promises = allStocks.map(async (symbol) => {
        try {
          const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
          const data = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
          
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

startCentralPolling();

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Stock proxy server running on http://localhost:${PORT}`);
  // 강제로 프로세스가 죽지 않도록 방지
  setInterval(() => {}, 1000 * 60 * 60);
});
