import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMarketStore } from '../../store/useMarketStore'
import { Card, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatPrice, formatChangePercent } from '../../utils/formatters'
import { Skeleton } from '../ui/Skeleton'

export function TopMovers() {
  const { stocks, loading } = useMarketStore()
  const navigate = useNavigate()

  const { gainers, losers, active } = useMemo(() => {
    const sorted = [...stocks].filter(s => s.price > 0)
    return {
      gainers: sorted.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
      losers: sorted.sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
      active: sorted.sort((a, b) => b.volume - a.volume).slice(0, 5),
    }
  }, [stocks])

  if (loading && !stocks.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="w-24 h-4 mb-3" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex justify-between py-2 border-b border-market-border last:border-0">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-12 h-3" />
              </div>
            ))}
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MoverCard title="Top Gainers" stocks={gainers} variant="positive" navigate={navigate} />
      <MoverCard title="Top Losers" stocks={losers} variant="negative" navigate={navigate} />
      <MoverCard title="Most Active" stocks={active} variant="neutral" navigate={navigate} showVolume />
    </div>
  )
}

function MoverCard({
  title,
  stocks,
  variant,
  navigate,
  showVolume,
}: {
  title: string
  stocks: { symbol: string; name: string; price: number; changePercent: number; volume: number }[]
  variant: 'positive' | 'negative' | 'neutral'
  navigate: (path: string) => void
  showVolume?: boolean
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="space-y-1 mt-2">
        {stocks.map(stock => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-market-hover cursor-pointer transition-colors"
            onClick={() => navigate(`/stock/${stock.symbol}`)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-white">{stock.symbol}</span>
              <span className="text-xs text-gray-500 truncate hidden md:inline">{stock.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-mono text-white">{formatPrice(stock.price)}</span>
              <Badge variant={variant}>
                {formatChangePercent(stock.changePercent)}
              </Badge>
              {showVolume && (
                <span className="text-xs text-gray-500 w-16 text-right">
                  {stock.volume >= 1_000_000 ? `${(stock.volume / 1_000_000).toFixed(1)}M` : `${(stock.volume / 1_000).toFixed(0)}K`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
