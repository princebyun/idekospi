import yahooFinance from 'yahoo-finance2';
yahooFinance.search('삼성').then(res => console.log(res.quotes.slice(0,5).map(q => ({symbol: q.symbol, name: q.shortname || q.longname}))))
