import { fetchWithCache } from './axios'
import type { StockData, CandleData, NewsItem } from '../utils/types'
import { API_CONFIG } from '../constants/config'
import { SP500_LIST } from '../constants/sp500'
import { generateMockStockData, generateMockCandles, generateMockNews } from './mockData'

let _usedFallback = false

export function didUseFallback(): boolean {
  return _usedFallback
}

export function resetFallbackFlag(): void {
  _usedFallback = false
}

function getCompanyInfo(symbol: string) {
  return SP500_LIST.find(c => c.symbol === symbol)
}

export async function fetchQuote(symbol: string): Promise<StockData> {
  if (API_CONFIG.USE_MOCK) return generateMockStockData(symbol)

  try {
    const company = getCompanyInfo(symbol)
    const [quote, profile] = await Promise.all([
      fetchWithCache<FinnhubQuote>(`/quote`, { symbol }),
      fetchWithCache<FinnhubProfile>(`/stock/profile2`, { symbol }),
    ])

    const metrics = await fetchWithCache<FinnhubMetrics>(`/stock/metric`, {
      symbol,
      metric: 'all',
    }).catch(() => null)

    const metricMap = metrics?.metric || {}

    return {
      symbol,
      name: profile?.name || company?.name || symbol,
      sector: profile?.sector || company?.sector || 'N/A',
      industry: profile?.finnhubIndustry || company?.industry || 'N/A',
      price: quote.c ?? 0,
      change: quote.d ?? 0,
      changePercent: quote.dp ?? 0,
      marketCap: metricMap['marketCapitalization'] ? metricMap['marketCapitalization'] * 1_000_000 : 0,
      volume: quote.v ?? 0,
      avgVolume: metricMap['10DayAverageTradingVolume'] ?? 0,
      peRatio: metricMap['peInclExtraTTM'] ?? 0,
      eps: metricMap['epsInclExtraItemsTTM'] ?? 0,
      dayHigh: quote.h ?? 0,
      dayLow: quote.l ?? 0,
      open: quote.o ?? 0,
      previousClose: quote.pc ?? 0,
      yearHigh: metricMap['52WeekHigh'] ?? 0,
      yearLow: metricMap['52WeekLow'] ?? 0,
      dividendYield: metricMap['dividendYieldIndicatedAnnual'] ?? 0,
      dividendPerShare: metricMap['dividendPerShareAnnual'] ?? 0,
      beta: metricMap['beta'] ?? 0,
      sharesOutstanding: metricMap['sharesOutstanding'] ?? 0,
      sparkline: [],
      timestamp: Math.floor(Date.now() / 1000),
    }
  } catch {
    _usedFallback = true
    return generateMockStockData(symbol)
  }
}

export async function fetchCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
): Promise<CandleData[]> {
  if (API_CONFIG.USE_MOCK) return generateMockCandles(symbol, from, to, resolution)

  try {
    const data = await fetchWithCache<FinnhubCandles>(`/stock/candle`, {
      symbol,
      resolution,
      from,
      to,
    })

    if (!data?.c?.length) {
      _usedFallback = true
      return generateMockCandles(symbol, from, to, resolution)
    }

    return data.c.map((_, i) => ({
      time: data.t[i],
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    })).filter(c => c.close > 0 && c.open > 0)
  } catch {
    _usedFallback = true
    return generateMockCandles(symbol, from, to, resolution)
  }
}

export async function fetchNews(symbol: string, from: string, to: string): Promise<NewsItem[]> {
  if (API_CONFIG.USE_MOCK) return generateMockNews(symbol)

  try {
    const data = await fetchWithCache<FinnhubNews[]>(`/company-news`, {
      symbol,
      from,
      to,
    })

    return (data || []).slice(0, 20).map(item => ({
      id: item.id,
      headline: item.headline,
      summary: item.summary,
      source: item.source,
      url: item.url,
      datetime: item.datetime,
      image: item.image || '',
      sentiment: (item.sentiment as NewsItem['sentiment']) || 'neutral',
      related: item.related,
    }))
  } catch {
    _usedFallback = true
    return generateMockNews(symbol)
  }
}

export async function fetchQuoteOnly(symbol: string): Promise<QuoteData | null> {
  try {
    const data = await fetchWithCache<FinnhubQuote>(`/quote`, { symbol })
    return {
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      dayHigh: data.h,
      dayLow: data.l,
      open: data.o,
      previousClose: data.pc,
      volume: data.v,
      timestamp: Math.floor(Date.now() / 1000),
    }
  } catch {
    _usedFallback = true
    return null
  }
}

export interface QuoteData {
  symbol: string
  price: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  open: number
  previousClose: number
  volume: number
  timestamp: number
}

export async function fetchMultipleQuotes(symbols: string[]): Promise<StockData[]> {
  const results = await Promise.allSettled(symbols.map(s => fetchQuote(s)))
  return results
    .filter((r): r is PromiseFulfilledResult<StockData> => r.status === 'fulfilled')
    .map(r => r.value)
}

// Finnhub API response types
interface FinnhubQuote {
  c: number
  d: number
  dp: number
  h: number
  l: number
  o: number
  pc: number
  v: number
}

interface FinnhubProfile {
  name: string
  sector: string
  finnhubIndustry: string
  marketCapitalization: number
  exchange: string
  ipo: string
  country: string
  weburl: string
  logo: string
  shareOutstanding: number
}

interface FinnhubMetrics {
  metric: Record<string, number>
}

interface FinnhubCandles {
  c: number[]
  h: number[]
  l: number[]
  o: number[]
  s: string
  t: number[]
  v: number[]
}

interface FinnhubNews {
  id: number
  headline: string
  summary: string
  source: string
  url: string
  datetime: number
  image: string
  sentiment: string
  related: string
}
