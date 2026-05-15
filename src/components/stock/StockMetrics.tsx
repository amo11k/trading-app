import type { StockData } from '../../utils/types'
import { Card } from '../ui/Card'
import { formatVolume, formatMarketCap, formatRatio, formatNumber, formatPercent } from '../../utils/formatters'

interface StockMetricsProps {
  stock: StockData
}

export function StockMetrics({ stock }: StockMetricsProps) {
  const metrics = [
    { label: 'Market Cap', value: formatMarketCap(stock.marketCap) },
    { label: 'Volume', value: formatVolume(stock.volume) },
    { label: 'Avg Volume', value: formatVolume(stock.avgVolume) },
    { label: 'P/E Ratio', value: stock.peRatio > 0 ? formatRatio(stock.peRatio) : '—' },
    { label: 'EPS', value: stock.eps > 0 ? formatNumber(stock.eps) : '—' },
    { label: 'Day High', value: formatNumber(stock.dayHigh) },
    { label: 'Day Low', value: formatNumber(stock.dayLow) },
    { label: 'Open', value: formatNumber(stock.open) },
    { label: 'Prev Close', value: formatNumber(stock.previousClose) },
    { label: '52W High', value: formatNumber(stock.yearHigh) },
    { label: '52W Low', value: formatNumber(stock.yearLow) },
    { label: 'Dividend Yield', value: stock.dividendYield > 0 ? formatPercent(stock.dividendYield) : '—' },
    { label: 'Beta', value: stock.beta > 0 ? formatNumber(stock.beta, 2) : '—' },
    { label: 'Shares Out', value: stock.sharesOutstanding > 0 ? formatVolume(stock.sharesOutstanding) : '—' },
  ]

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
        {metrics.map(m => (
          <div key={m.label}>
            <span className="text-xs text-gray-500">{m.label}</span>
            <p className="text-sm font-mono text-white mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
