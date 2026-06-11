import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const yahooFinance = new YahooFinance();

const app = express();
app.use(cors());

// Git 실제 로그를 가져오는 엔드포인트 추가
app.get('/api/git/log', async (req, res) => {
  try {
    const { stdout } = await execPromise('git log -n 50 --pretty=format:"%s"');
    const logs = stdout.split('\n').filter(line => line.trim().length > 0);
    res.json({ logs });
  } catch (error) {
    console.error('Failed to get git log', error);
    res.status(500).json({ error: 'Failed to get git log', logs: [] });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const symbolsParam = req.query.symbols as string;
    const symbols = symbolsParam ? symbolsParam.split(',') : ['005930.KS', '000660.KS', '035420.KS', 'AAPL'];
    
    const promises = symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        
        let displayPrice = quote.regularMarketPrice;
        let displayChange = quote.regularMarketChangePercent;
        const marketState = quote.marketState || 'REGULAR';
        
        if (marketState === 'PRE' && quote.preMarketPrice) {
          displayPrice = quote.preMarketPrice;
          displayChange = quote.preMarketChangePercent;
        } else if ((marketState === 'POST' || marketState === 'CLOSED') && quote.postMarketPrice) {
          displayPrice = quote.postMarketPrice;
          displayChange = quote.postMarketChangePercent;
        }

        return {
          symbol,
          code: symbol.replace('.KS', ''),
          price: displayPrice,
          changeRate: displayChange,
          marketState: marketState
        };
      } catch (err) {
        console.error(`Failed to fetch ${symbol}:`);
        console.error(err);
        return null;
      }
    });

    const results = (await Promise.all(promises)).filter(Boolean);
    res.json(results);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/api/stock/details', async (req, res) => {
  try {
    const symbol = req.query.symbol as string;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    const quote = await yahooFinance.quote(symbol);
    
    // 기간별 수익률 계산을 위한 히스토리 (최대 5년)
    const now = new Date();
    const period1 = new Date();
    period1.setFullYear(now.getFullYear() - 5);
    
    let history: any[] = [];
    try {
      history = await yahooFinance.historical(symbol, { period1, period2: now, interval: '1d' });
    } catch (e) {
      console.error('Failed to fetch history for', symbol);
    }

    const currentPrice = quote.regularMarketPrice || 0;
    
    const getReturnRate = (daysAgo: number) => {
      if (history.length === 0 || currentPrice === 0) return 0;
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - daysAgo);
      
      let closest = history[0];
      let minDiff = Infinity;
      
      for (const h of history) {
        const diff = Math.abs(h.date.getTime() - targetDate.getTime());
        if (diff < minDiff && h.date.getTime() <= targetDate.getTime()) {
          minDiff = diff;
          closest = h;
        }
      }
      
      if (!closest || !closest.close) return 0;
      return ((currentPrice - closest.close) / closest.close) * 100;
    };

    // 네이버 금융 API 연동을 통한 수급(투자자 동향) 가져오기
    let investorTrend = null;
    const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
    if (isKorean) {
      const codeOnly = symbol.replace('.KS', '').replace('.KQ', '');
      try {
        const naverRes = await fetch(`https://m.stock.naver.com/api/stock/${codeOnly}/integration`);
        if (naverRes.ok) {
          const naverData = await naverRes.json();
          if (naverData.dealTrendInfos && naverData.dealTrendInfos.length > 0) {
            const todayTrend = naverData.dealTrendInfos[0];
            investorTrend = {
              individual: todayTrend.individualPureBuyQuant,
              foreigner: todayTrend.foreignerPureBuyQuant,
              institution: todayTrend.organPureBuyQuant,
            };
          }
        }
      } catch (err) {
        console.error('Failed to fetch naver trend', err);
      }
    }

    res.json({
      symbol,
      price: currentPrice,
      changeRate: quote.regularMarketChangePercent || 0,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      returns: {
        '1D': quote.regularMarketChangePercent || 0,
        '1W': getReturnRate(7),
        '1M': getReturnRate(30),
        '3M': getReturnRate(90),
        '1Y': getReturnRate(365),
        '5Y': getReturnRate(365 * 5),
      },
      investorTrend
    });
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    
    const result = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 15
    });
    
    const formatted = result.quotes.map((q: any) => ({
      code: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      type: q.quoteType,
      exchange: q.exchDisp
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 채팅 메시지 메모리 저장소 (최대 100개 유지)
interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  author: string;
}
let chatMessages: ChatMessage[] = [];

app.get('/api/chat', (req, res) => {
  res.json(chatMessages);
});

app.post('/api/chat', express.json(), (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const newMessage: ChatMessage = {
    id: Math.random().toString(36).substr(2, 9),
    text: text.substring(0, 500), // 길이 제한
    timestamp: Date.now(),
    author: author || 'Anonymous',
  };
  
  chatMessages.push(newMessage);
  if (chatMessages.length > 100) {
    chatMessages.shift(); // 오래된 메시지 삭제
  }
  
  res.json(newMessage);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Stock proxy server running on http://localhost:${PORT}`);
  // 강제로 프로세스가 죽지 않도록 방지
  setInterval(() => {}, 1000 * 60 * 60);
});
