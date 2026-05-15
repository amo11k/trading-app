import { useMarketStore } from '../../store/useMarketStore'
import { Card, CardTitle, CardValue } from '../ui/Card'
import { formatVolume, formatLargeNumber } from '../../utils/formatters'
import { Skeleton } from '../ui/Skeleton'

export function MarketOverview() {
  const { marketOverview, stocks, loading } = useMarketStore()

  if (loading && !stocks.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="w-20 h-3 mb-2" />
            <Skeleton className="w-28 h-6" />
          </Card>
        ))}
      </div>
    )
  }

  const totalMCap = stocks.reduce((sum, s) => sum + s.marketCap, 0)
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0)
  const avgPE = stocks.filter(s => s.peRatio > 0).reduce((sum, s, _, arr) => sum + s.peRatio / arr.length, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardTitle>Advance/Decline</CardTitle>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-xl font-bold text-market-up font-mono">{marketOverview?.totalAdvancing ?? 0}</span>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-xl font-bold text-market-down font-mono">{marketOverview?.totalDeclining ?? 0}</span>
        </div>
      </Card>

      <Card>
        <CardTitle>Market Sentiment</CardTitle>
        <CardValue className={marketOverview?.marketSentiment === 'bullish' ? 'text-market-up' : 'text-market-down'}>
          {marketOverview?.marketSentiment === 'bullish' ? 'Bullish' : 'Bearish'}
        </CardValue>
      </Card>

      <Card>
        <CardTitle>Total Volume</CardTitle>
        <CardValue>{formatVolume(totalVolume)}</CardValue>
      </Card>

      <Card>
        <CardTitle>Avg P/E</CardTitle>
        <CardValue>{avgPE ? avgPE.toFixed(1) : '—'}</CardValue>
      </Card>
    </div>
  )
}
