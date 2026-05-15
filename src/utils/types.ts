export interface StockData {
  symbol: string
  name: string
  sector: string
  industry: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
  avgVolume: number
  peRatio: number
  eps: number
  dayHigh: number
  dayLow: number
  open: number
  previousClose: number
  yearHigh: number
  yearLow: number
  dividendYield: number
  dividendPerShare: number
  beta: number
  sharesOutstanding: number
  sparkline: number[]
  timestamp: number
}

export interface StockDetail extends StockData {
  description: string
  employees: number
  founded: string
  exchange: string
  country: string
  website: string
  marketCapRank: number
  shortRatio: number
  shortPercent: number
  priceToBook: number
  debtToEquity: number
  revenue: number
  revenueGrowth: number
  grossProfit: number
  netIncome: number
  profitMargin: number
  operatingMargin: number
  returnOnEquity: number
  returnOnAssets: number
  currentRatio: number
  quickRatio: number
  cashPerShare: number
}

export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NewsItem {
  id: number
  headline: string
  summary: string
  source: string
  url: string
  datetime: number
  image: string
  sentiment: 'positive' | 'negative' | 'neutral'
  related: string
}

export interface MarketOverview {
  totalAdvancing: number
  totalDeclining: number
  totalUnchanged: number
  advDecRatio: number
  totalVolume: number
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
}

export interface FilterState {
  search: string
  sector: string
  sortBy: SortKey
  sortOrder: 'asc' | 'desc'
  page: number
  pageSize: number
  minPrice: number | null
  maxPrice: number | null
  minMarketCap: number | null
  maxMarketCap: number | null
  performance: 'all' | 'gainers' | 'losers'
}

export type SortKey =
  | 'symbol'
  | 'name'
  | 'price'
  | 'changePercent'
  | 'marketCap'
  | 'volume'
  | 'peRatio'
  | 'eps'
  | 'dividendYield'
  | 'sector'
