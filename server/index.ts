import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const app = express();
app.use(cors());

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
