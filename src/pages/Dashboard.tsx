import { useEffect, useCallback, useRef } from 'react'
import { useMarketStore } from '../store/useMarketStore'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { API_CONFIG } from '../constants/config'
import { MarketOverview } from '../components/dashboard/MarketOverview'
import { TopMovers } from '../components/dashboard/TopMovers'
import { SectorHeatmap } from '../components/dashboard/SectorHeatmap'
import { SectorDistribution } from '../components/dashboard/SectorDistribution'
import { StockTable } from '../components/stock/StockTable'
import { Spinner } from '../components/ui/Spinner'

export function Dashboard() {
  const { fetchStocks, loading, stocks } = useMarketStore()
  const initialized = useRef(false)

  const refresh = useCallback(() => {
    fetchStocks()
  }, [fetchStocks])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      refresh()
    }
  }, [refresh])

  useAutoRefresh(refresh, API_CONFIG.REFRESH_INTERVAL, true)

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
      <div>
        <h1 className="text-lg font-bold text-white">Market Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time S&P 500 index data and stock performance</p>
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
