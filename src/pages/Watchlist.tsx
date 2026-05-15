import { useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketStore } from '../store/useMarketStore'
import { useWatchlistStore } from '../store/useWatchlistStore'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { formatPrice, formatChangePercent, formatMarketCap, formatVolume } from '../utils/formatters'
import { Badge } from '../components/ui/Badge'
import { SparklineChart } from '../components/charts/SparklineChart'

export function Watchlist() {
  const navigate = useNavigate()
  const { stocks, loading, fetchStocks } = useMarketStore()
  const { symbols, clearAll } = useWatchlistStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && !stocks.length) {
      initialized.current = true
      fetchStocks()
    }
  }, [fetchStocks, stocks.length])

  const watchlistStocks = useMemo(
    () => stocks.filter(s => symbols.includes(s.symbol)),
    [stocks, symbols],
  )

  if (!symbols.length) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-lg font-bold text-white">My Watchlist</h1>
        <Card>
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-gray-400 text-sm mb-4">Your watchlist is empty</p>
            <Button variant="primary" onClick={() => navigate('/')}>Browse S&P 500 Stocks</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">My Watchlist</h1>
          <p className="text-xs text-gray-500 mt-1">{symbols.length} stocks tracked</p>
        </div>
        <Button variant="danger" size="sm" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      {loading && !stocks.length ? (
        <Spinner className="py-12" />
      ) : (
        <div className="grid gap-3">
          {watchlistStocks.map(stock => {
            const isPositive = stock.change >= 0
            return (
              <div
                key={stock.symbol}
                className="card-hover flex items-center justify-between p-4"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <span className="text-sm font-semibold text-white font-mono">{stock.symbol}</span>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{stock.name}</p>
                  </div>
                  <SparklineChart data={stock.sparkline} positive={isPositive} width={80} height={28} />
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">{formatPrice(stock.price)}</p>
                    <Badge variant={isPositive ? 'positive' : 'negative'}>
                      {formatChangePercent(stock.changePercent)}
                    </Badge>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Market Cap</p>
                    <p className="text-xs font-mono text-gray-300">{formatMarketCap(stock.marketCap)}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="text-xs font-mono text-gray-300">{formatVolume(stock.volume)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
