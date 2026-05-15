import type { StockData } from '../../utils/types'
import { formatPrice, formatChange, formatChangePercent, formatMarketCap, formatVolume } from '../../utils/formatters'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useWatchlistStore } from '../../store/useWatchlistStore'

interface CompanyHeaderProps {
  stock: StockData
}

export function CompanyHeader({ stock }: CompanyHeaderProps) {
  const isWatched = useWatchlistStore(s => s.symbols.includes(stock.symbol))
  const toggleSymbol = useWatchlistStore(s => s.toggleSymbol)

  const isPositive = stock.change >= 0

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white font-mono">{stock.symbol}</h1>
          <Badge variant={isPositive ? 'positive' : 'negative'}>
            {formatChangePercent(stock.changePercent)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSymbol(stock.symbol)}
            className={isWatched ? 'text-yellow-400' : ''}
          >
            {isWatched ? (
              <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            )}
            {isWatched ? 'Watched' : 'Watch'}
          </Button>
        </div>
        <h2 className="text-sm text-gray-400 mb-1">{stock.name}</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>{stock.sector}</span>
          <span>·</span>
          <span>{stock.industry}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-4xl font-bold text-white font-mono tracking-tight">
          {formatPrice(stock.price)}
        </div>
        <div className={`text-lg font-mono mt-1 ${isPositive ? 'text-market-up' : 'text-market-down'}`}>
          {formatChange(stock.change)} ({formatChangePercent(stock.changePercent)})
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Market Cap: {formatMarketCap(stock.marketCap)}
        </div>
      </div>
    </div>
  )
}
