import { create } from 'zustand'
import type { StockData, CandleData, NewsItem } from '../utils/types'
import { fetchQuote, fetchCandles, fetchNews } from '../api/finnhub'
import { CHART_TIMEFRAMES } from '../constants/config'

interface StockDetailStore {
  stock: StockData | null
  candles: CandleData[]
  news: NewsItem[]
  timeframe: number
  loading: boolean
  candlesLoading: boolean
  newsLoading: boolean
  error: string | null

  fetchDetail: (symbol: string) => Promise<void>
  setTimeframe: (index: number) => Promise<void>
  fetchCandles: (symbol: string, timeframeIndex: number) => Promise<void>
  fetchNews: (symbol: string) => Promise<void>
  reset: () => void
}

export const useStockDetailStore = create<StockDetailStore>((set, get) => ({
  stock: null,
  candles: [],
  news: [],
  timeframe: 0,
  loading: false,
  candlesLoading: false,
  newsLoading: false,
  error: null,

  fetchDetail: async (symbol: string) => {
    set({ loading: true, error: null })
    try {
      const stock = await fetchQuote(symbol)
      set({ stock, loading: false })
      get().fetchCandles(symbol, 0)
      get().fetchNews(symbol)
    } catch {
      set({ error: `Failed to load ${symbol}`, loading: false })
    }
  },

  setTimeframe: async (index: number) => {
    set({ timeframe: index })
    const { stock } = get()
    if (stock) {
      get().fetchCandles(stock.symbol, index)
    }
  },

  fetchCandles: async (symbol: string, timeframeIndex: number) => {
    set({ candlesLoading: true })
    const tf = CHART_TIMEFRAMES[timeframeIndex]
    const to = Math.floor(Date.now() / 1000)
    const from = to - tf.days * 86400
    try {
      const candles = await fetchCandles(symbol, tf.resolution, from, to)
      set({ candles, candlesLoading: false })
    } catch {
      set({ candles: [], candlesLoading: false })
    }
  },

  fetchNews: async (symbol: string) => {
    set({ newsLoading: true })
    const to = new Date().toISOString().split('T')[0]
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
    try {
      const news = await fetchNews(symbol, from, to)
      set({ news, newsLoading: false })
    } catch {
      set({ news: [], newsLoading: false })
    }
  },

  reset: () => {
    set({
      stock: null,
      candles: [],
      news: [],
      timeframe: 0,
      loading: false,
      error: null,
    })
  },
}))
