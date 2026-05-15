import { useEffect, useRef, useCallback } from 'react'
import { useMarketStore } from '../store/useMarketStore'
import { useWatchlistStore } from '../store/useWatchlistStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { RateLimiter } from '../utils/rateLimiter'
import { fetchQuoteOnly } from '../api/finnhub'
import { API_CONFIG } from '../constants/config'
import { SP500_SYMBOLS } from '../constants/sp500'
import { MarketOverview } from '../components/dashboard/MarketOverview'
import { TopMovers } from '../components/dashboard/TopMovers'
import { SectorHeatmap } from '../components/dashboard/SectorHeatmap'
import { SectorDistribution } from '../components/dashboard/SectorDistribution'
import { StockTable } from '../components/stock/StockTable'
import { Spinner } from '../components/ui/Spinner'

export function Dashboard() {
  const { stocks, loading, seedMockData, applyQuoteUpdate, updateRealtimePrice } = useMarketStore()
  const watchlistSymbols = useWatchlistStore(s => s.symbols)
  const initialized = useRef(false)
  const limiterRef = useRef<RateLimiter | null>(null)
  const prevWatchlistRef = useRef<string[]>([])

  const handleTrade = useCallback((trade: { symbol: string; price: number; volume: number; timestamp: number }) => {
    updateRealtimePrice(trade.symbol, trade.price, trade.volume, trade.timestamp)
  }, [updateRealtimePrice])

  const { subscribe, unsubscribe } = useWebSocket(handleTrade)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    seedMockData()

    if (!API_CONFIG.USE_MOCK && API_CONFIG.API_KEY) {
      const limiter = new RateLimiter(1100, async (symbol: string) => {
        const quote = await fetchQuoteOnly(symbol)
        if (quote) {
          useMarketStore.getState().applyQuoteUpdate(quote)
        }
      })
      limiter.fill(SP500_SYMBOLS)
      limiter.start()
      limiterRef.current = limiter
    }
  }, [seedMockData, applyQuoteUpdate])

  useEffect(() => {
    const added = watchlistSymbols.filter(s => !prevWatchlistRef.current.includes(s))
    const removed = prevWatchlistRef.current.filter(s => !watchlistSymbols.includes(s))
    if (added.length > 0) subscribe(added)
    if (removed.length > 0) unsubscribe(removed)
    prevWatchlistRef.current = watchlistSymbols
  }, [watchlistSymbols, subscribe, unsubscribe])

  useEffect(() => {
    return () => {
      if (limiterRef.current) {
        limiterRef.current.destroy()
        limiterRef.current = null
      }
    }
  }, [])

  if (loading && !stocks.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading S&P 500 market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Market Overview</h1>
          <p className="text-xs text-gray-500 mt-1">S&P 500 index — stock performance and real-time data</p>
        </div>
      </div>

      <MarketOverview />
      <TopMovers />
      <SectorHeatmap />

      <div className="grid grid-cols-1 gap-6">
        <SectorDistribution />
      </div>

      <div>
        <h2 className="text-base font-semibold text-white mb-3">S&P 500 Companies</h2>
        <StockTable />
      </div>
    </div>
  )
}
