export interface StockData {
  symbol: string;
  price: number;
  changeRate: number;
  marketState?: string;
  changeRate15m?: number;
  changeRate30m?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface MarketPrices {
  [code: string]: {
    price: number;
    changeRate: number;
    changeRate15m?: number;
    changeRate30m?: number;
    marketState?: string;
  }
}
