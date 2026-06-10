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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Stock proxy server running on http://localhost:${PORT}`);
  // 강제로 프로세스가 죽지 않도록 방지
  setInterval(() => {}, 1000 * 60 * 60);
});
