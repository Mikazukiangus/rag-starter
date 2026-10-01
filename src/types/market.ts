export interface BenchmarkIndex {
  id: string;
  name: string;
  subtitle: string;
  value: number;
  changePercent: number;
  isPositive: boolean;
  sparkline: number[];
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicatorSummary {
  rating: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  score: number; // -2 to +2
  buyCount: number;
  neutralCount: number;
  sellCount: number;
  rsi: number;
  macd: string;
  stochK: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  exchange: string;
  marketType: 'NASDAQ' | 'NYSE' | 'AMEX' | 'CRYPTO' | 'FOREX';
  badge: string;
  badgeBg: string;
  badgeText: string;
  lastPrice: number;
  changePrice: number;
  changePercent: number;
  volume: string;
  volumeNum: number;
  marketCap: string;
  peRatio: number;
  sector: string;
  high52w: number;
  low52w: number;
  category: 'Stocks' | 'Crypto' | 'Indices' | 'Forex' | 'Futures' | 'Bonds';
  sparkline: number[];
  postMarketStatus?: string;
  technicals: TechnicalIndicatorSummary;
  candles: {
    '1m': CandleData[];
    '5m': CandleData[];
    '15m': CandleData[];
    '1H': CandleData[];
    'D': CandleData[];
    'W': CandleData[];
  };
}

export interface NewsArticle {
  id: string;
  source: 'Reuters' | 'Bloomberg' | 'WSJ' | 'CNBC' | 'Financial Times';
  timeAgo: string;
  timestamp: string;
  headline: string;
  summary: string;
  fullBody: string;
  category: 'Macro' | 'Equities' | 'Crypto' | 'Commodities';
  relatedTickers: string[];
  readTime: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  title: string;
  subtitle: string;
  country: string;
  flag: string;
  actual?: string;
  forecast: string;
  previous: string;
  status: 'Released' | 'Upcoming';
  analysis: string;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  marketCapBillion: number;
  changePercent: number;
  lastPrice: number;
  sector: string;
}
