import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const yahooFinance = new YahooFinance();

// Helper: Fetch from Yahoo
async function fetchYahooStock(symbol: string) {
  const quote = await yahooFinance.quote(symbol);
  let displayPrice = quote.regularMarketPrice || 0;
  let displayChange = quote.regularMarketChangePercent || 0;
  const marketState = quote.marketState || 'REGULAR';
  
  if (marketState === 'PRE' && quote.preMarketPrice) {
    displayPrice = quote.preMarketPrice;
    displayChange = quote.preMarketChangePercent || 0;
  } else if ((marketState === 'POST' || marketState === 'CLOSED') && quote.postMarketPrice) {
    displayPrice = quote.postMarketPrice;
    displayChange = quote.postMarketChangePercent || 0;
  }

  return {
    symbol,
    code: symbol.replace('.KS', '').replace('.KQ', ''),
    price: displayPrice,
    changeRate: displayChange,
    marketState,
    quote // 원본 quote 객체 유지 (상세 API에서 사용)
  };
}

// Helper: Fetch from Naver (with Yahoo Fallback)
async function fetchNaverStockBasic(symbol: string) {
  const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
  if (!isKorean) return fetchYahooStock(symbol);

  const codeOnly = symbol.replace('.KS', '').replace('.KQ', '');
  
  try {
    const res = await fetch(`https://m.stock.naver.com/api/stock/${codeOnly}/basic`);
    if (!res.ok) throw new Error('Naver API response not ok');
    
    const data = await res.json();
    
    // 네이버 데이터 파싱
    const priceStr = data.closePrice || '0';
    const price = parseFloat(priceStr.replace(/,/g, ''));
    const changeRate = parseFloat(data.fluctuationsRatio || '0');
    
    // 네이버 API의 marketStatus 기반 상태 매핑 ('CLOSE' -> 'CLOSED', 그 외 'REGULAR')
    const marketState = data.marketStatus === 'CLOSE' ? 'CLOSED' : 'REGULAR';

    return {
      symbol,
      code: codeOnly,
      price,
      changeRate,
      marketState,
      naverData: data // 원본 데이터 (상세 API에서 사용)
    };
  } catch (err) {
    console.warn(`[Fallback] Naver API failed for ${symbol}, falling back to Yahoo:`, err);
    return fetchYahooStock(symbol); // 실패 시 야후로 폴백
  }
}

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

// ReleaseNotes 렌더링용 Git 로그 (해시, 날짜 포함)
app.get('/api/git/releases', async (req, res) => {
  try {
    const { stdout } = await execPromise('git log -n 20 --pretty=format:"%h|%cd|%s" --date=short');
    const releases = stdout.split('\n').filter(line => line.trim().length > 0).map(line => {
      const [hash, date, ...msgParts] = line.split('|');
      return {
        hash,
        date,
        message: msgParts.join('|').replace(/"/g, "'") // 따옴표 이스케이프 방지
      };
    });
    res.json({ releases });
  } catch (error) {
    console.error('Failed to get git releases', error);
    res.status(500).json({ error: 'Failed to get git releases', releases: [] });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const symbolsParam = req.query.symbols as string;
    const symbols = symbolsParam ? symbolsParam.split(',') : ['005930.KS', '000660.KS', '035420.KS', 'AAPL'];
    
    const promises = symbols.map(async (symbol) => {
      try {
        const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
        const data = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
        
        return {
          symbol: data.symbol,
          code: data.code,
          price: data.price,
          changeRate: data.changeRate,
          marketState: data.marketState
        };
      } catch (err) {
        console.error(`Failed to fetch ${symbol}:`, err);
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

    const isKorean = symbol.endsWith('.KS') || symbol.endsWith('.KQ');
    
    // 1. 현재 가격 데이터 가져오기 (Naver 또는 Yahoo)
    const currentData = isKorean ? await fetchNaverStockBasic(symbol) : await fetchYahooStock(symbol);
    const currentPrice = currentData.price;
    const displayChange = currentData.changeRate;
    const marketState = currentData.marketState;

    // 2. 야후 파이낸스에서 과거 데이터(History) 가져오기 (수익률 계산용)
    const now = new Date();
    const period1 = new Date();
    period1.setFullYear(now.getFullYear() - 5);
    
    let history: any[] = [];
    try {
      history = await yahooFinance.historical(symbol, { period1, period2: now, interval: '1d' });
    } catch (e) {
      console.error('Failed to fetch history for', symbol);
    }
    
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

    // 3. 네이버 수급 데이터 가져오기 (한국 주식만)
    let investorTrend = null;
    if (isKorean) {
      const codeOnly = currentData.code;
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

    // 4. 상세 메타데이터 조합
    let open = 0, high = 0, low = 0, volume = 0, marketCap = 0, fiftyTwoWeekHigh = 0, fiftyTwoWeekLow = 0;
    
    if (isKorean && currentData.naverData) {
      const nd = currentData.naverData;
      open = parseFloat((nd.openPrice || '0').replace(/,/g, ''));
      high = parseFloat((nd.highPrice || '0').replace(/,/g, ''));
      low = parseFloat((nd.lowPrice || '0').replace(/,/g, ''));
      volume = nd.accumulatedTradingVolume || 0;
      marketCap = nd.marketSum ? nd.marketSum * 100000000 : 0; // 억원 단위 변환
    } else if (currentData.quote) {
      const q = currentData.quote;
      open = q.regularMarketOpen || 0;
      high = q.regularMarketDayHigh || 0;
      low = q.regularMarketDayLow || 0;
      volume = q.regularMarketVolume || 0;
      marketCap = q.marketCap || 0;
      fiftyTwoWeekHigh = q.fiftyTwoWeekHigh || 0;
      fiftyTwoWeekLow = q.fiftyTwoWeekLow || 0;
    }

    res.json({
      symbol,
      price: currentPrice,
      changeRate: displayChange,
      marketState: marketState,
      open,
      high,
      low,
      volume,
      marketCap,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      returns: {
        '1D': displayChange,
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
