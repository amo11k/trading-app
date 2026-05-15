import { create } from 'zustand'
import type { StockData, FilterState, SortKey, MarketOverview } from '../utils/types'
import { fetchMultipleQuotes, didUseFallback, resetFallbackFlag } from '../api/finnhub'
import { generateMockStockData } from '../api/mockData'
import { SP500_SYMBOLS, SP500_LIST } from '../constants/sp500'
import { API_CONFIG, MARKET_CONFIG } from '../constants/config'

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

type DataSource = 'live' | 'mock' | 'fallback'

interface MarketStore {
  stocks: StockData[]
  filteredStocks: StockData[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
  filter: FilterState
  marketOverview: MarketOverview | null
  dataSource: DataSource
  liveCount: number

  fetchStocks: () => Promise<void>
  seedMockData: () => void
  applyQuoteUpdate: (quote: QuoteData) => void
  updateRealtimePrice: (symbol: string, price: number, volume: number, timestamp: number) => void
  setSearch: (search: string) => void
  setSector: (sector: string) => void
  setSortBy: (sortBy: SortKey) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setPerformance: (performance: 'all' | 'gainers' | 'losers') => void
  applyFilters: () => void
  getStock: (symbol: string) => StockData | undefined
}

const defaultFilter: FilterState = {
  search: '',
  sector: 'all',
  sortBy: 'marketCap',
  sortOrder: 'desc',
  page: 0,
  pageSize: MARKET_CONFIG.DEFAULT_PAGE_SIZE,
  minPrice: null,
  maxPrice: null,
  minMarketCap: null,
  maxMarketCap: null,
  performance: 'all',
}

function recalcMarketOverview(stocks: StockData[]): MarketOverview {
  const advancing = stocks.filter(s => s.change > 0).length
  const declining = stocks.filter(s => s.change < 0).length
  const unchanged = stocks.length - advancing - declining
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0)
  return {
    totalAdvancing: advancing,
    totalDeclining: declining,
    totalUnchanged: unchanged,
    advDecRatio: advancing / (declining || 1),
    totalVolume,
    marketSentiment: advancing > declining ? 'bullish' : advancing < declining ? 'bearish' : 'neutral',
  }
}

const _liveSymbolsSet = new Set<string>()

export const useMarketStore = create<MarketStore>((set, get) => ({
  stocks: [],
  filteredStocks: [],
  loading: false,
  error: null,
  lastUpdated: null,
  filter: defaultFilter,
  marketOverview: null,
  dataSource: API_CONFIG.USE_MOCK ? 'mock' : 'live',
  liveCount: 0,

  fetchStocks: async () => {
    set({ loading: true, error: null })
    resetFallbackFlag()
    try {
      const stocks = await fetchMultipleQuotes(SP500_SYMBOLS)
      const fellBack = didUseFallback()
      const dataSource = API_CONFIG.USE_MOCK ? 'mock' : fellBack ? 'fallback' : 'live'
      const marketOverview = recalcMarketOverview(stocks)
      set({ stocks, loading: false, lastUpdated: Date.now(), marketOverview, dataSource })
      get().applyFilters()
    } catch {
      set({ error: 'Failed to fetch market data', loading: false })
    }
  },

  seedMockData: () => {
    const stocks = SP500_SYMBOLS.map(s => generateMockStockData(s))
    const marketOverview = recalcMarketOverview(stocks)
    set({ stocks, loading: false, lastUpdated: Date.now(), marketOverview })
    get().applyFilters()
  },

  applyQuoteUpdate: (quote: QuoteData) => {
    let liveCount = get().liveCount
    if (!_liveSymbolsSet.has(quote.symbol)) {
      _liveSymbolsSet.add(quote.symbol)
      liveCount++
    }

    set(state => {
      const stocks = state.stocks.map(s => {
        if (s.symbol !== quote.symbol) return s
        return {
          ...s,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          dayHigh: quote.dayHigh,
          dayLow: quote.dayLow,
          open: quote.open,
          previousClose: quote.previousClose,
          volume: quote.volume,
          timestamp: quote.timestamp,
        }
      })
      const marketOverview = recalcMarketOverview(stocks)
      const dataSource: DataSource = API_CONFIG.USE_MOCK ? 'mock' : liveCount > 0 ? 'live' : 'fallback'
      return { stocks, liveCount, marketOverview, dataSource, lastUpdated: Date.now() }
    })
    get().applyFilters()
  },

  updateRealtimePrice: (symbol: string, tradePrice: number, tradeVolume: number, timestamp: number) => {
    set(state => {
      const stocks = state.stocks.map(s => {
        if (s.symbol !== symbol) return s
        const previousClose = s.previousClose || s.price
        const change = tradePrice - previousClose
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0
        return {
          ...s,
          price: tradePrice,
          change,
          changePercent,
          volume: tradeVolume,
          dayHigh: Math.max(s.dayHigh, tradePrice),
          dayLow: s.dayLow > 0 ? Math.min(s.dayLow, tradePrice) : tradePrice,
          timestamp,
        }
      })
      const marketOverview = recalcMarketOverview(stocks)
      return { stocks, marketOverview, lastUpdated: Date.now() }
    })
    get().applyFilters()
  },

  setSearch: (search: string) => {
    set(state => ({ filter: { ...state.filter, search, page: 0 } }))
    get().applyFilters()
  },

  setSector: (sector: string) => {
    set(state => ({ filter: { ...state.filter, sector, page: 0 } }))
    get().applyFilters()
  },

  setSortBy: (sortBy: SortKey) => {
    set(state => {
      const sortOrder = state.filter.sortBy === sortBy && state.filter.sortOrder === 'desc' ? 'asc' : 'desc'
      return { filter: { ...state.filter, sortBy, sortOrder, page: 0 } }
    })
    get().applyFilters()
  },

  setPage: (page: number) => {
    set(state => ({ filter: { ...state.filter, page } }))
    get().applyFilters()
  },

  setPageSize: (pageSize: number) => {
    set(state => ({ filter: { ...state.filter, pageSize, page: 0 } }))
    get().applyFilters()
  },

  setPerformance: (performance: 'all' | 'gainers' | 'losers') => {
    set(state => ({ filter: { ...state.filter, performance, page: 0 } }))
    get().applyFilters()
  },

  applyFilters: () => {
    const { stocks, filter } = get()
    let result = [...stocks]

    if (filter.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        s =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q),
      )
    }

    if (filter.sector && filter.sector !== 'all') {
      result = result.filter(s => s.sector === filter.sector)
    }

    if (filter.performance === 'gainers') {
      result = result.filter(s => s.changePercent > 0)
    } else if (filter.performance === 'losers') {
      result = result.filter(s => s.changePercent < 0)
    }

    if (filter.minPrice != null) result = result.filter(s => s.price >= filter.minPrice!)
    if (filter.maxPrice != null) result = result.filter(s => s.price <= filter.maxPrice!)
    if (filter.minMarketCap != null) result = result.filter(s => s.marketCap >= filter.minMarketCap!)
    if (filter.maxMarketCap != null) result = result.filter(s => s.marketCap <= filter.maxMarketCap!)

    result.sort((a, b) => {
      const aVal = a[filter.sortBy]
      const bVal = b[filter.sortBy]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return filter.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return filter.sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    set({ filteredStocks: result })
  },

  getStock: (symbol: string) => {
    return get().stocks.find(s => s.symbol === symbol)
  },
}))
