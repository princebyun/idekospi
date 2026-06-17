interface PriceSnapshot {
  timestamp: number;
  price: number;
}

const priceHistory = new Map<string, PriceSnapshot[]>();

export const updateHistoryAndCalculateRates = (symbol: string, currentPrice: number, dailyChangeRate: number) => {
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
