import { useState, useMemo, useCallback } from 'react'
import type { StockData } from '../../utils/types'
import { useMarketStore } from '../../store/useMarketStore'
import { Card, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { formatPrice, formatChangePercent, formatMarketCap, formatVolume, formatRatio } from '../../utils/formatters'
import { CustomLineChart } from '../charts/LineChart'
import { Badge } from '../ui/Badge'

export function StockComparison() {
  const { stocks } = useMarketStore()
  const [stockA, setStockA] = useState('AAPL')
  const [stockB, setStockB] = useState('MSFT')

  const options = useMemo(() =>
    stocks
      .filter(s => s.price > 0)
      .map(s => ({ value: s.symbol, label: `${s.symbol} - ${s.name}` })),
    [stocks],
  )

  const data = useMemo(() => {
    const a = stocks.find(s => s.symbol === stockA)
    const b = stocks.find(s => s.symbol === stockB)
    return { a, b }
  }, [stocks, stockA, stockB])

  const chartData = useMemo(() => {
    if (!data.a || !data.b) return []
    const points = 20
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1)
      const aStart = data.a!.price * (1 - data.a!.changePercent / 100)
      const bStart = data.b!.price * (1 - data.b!.changePercent / 100)
      return {
        time: `${i + 1}`,
        [stockA]: aStart * (1 + data.a!.changePercent / 100 * progress),
        [stockB]: bStart * (1 + data.b!.changePercent / 100 * progress),
      }
    })
  }, [data, stockA, stockB])

  const metricRows = useMemo(() => {
    if (!data.a || !data.b) return []
    const metrics: { label: string; a: string | number; b: string | number; better: 'a' | 'b' | null }[] = [
      { label: 'Price', a: formatPrice(data.a.price), b: formatPrice(data.b.price), better: data.a.price > data.b.price ? 'a' : 'b' },
      { label: 'Change %', a: `${formatChangePercent(data.a.changePercent)}`, b: `${formatChangePercent(data.b.changePercent)}`, better: data.a.changePercent > data.b.changePercent ? 'a' : 'b' },
      { label: 'Market Cap', a: formatMarketCap(data.a.marketCap), b: formatMarketCap(data.b.marketCap), better: data.a.marketCap > data.b.marketCap ? 'a' : 'b' },
      { label: 'Volume', a: formatVolume(data.a.volume), b: formatVolume(data.b.volume), better: data.a.volume > data.b.volume ? 'a' : 'b' },
      { label: 'P/E', a: data.a.peRatio > 0 ? formatRatio(data.a.peRatio) : '—', b: data.b.peRatio > 0 ? formatRatio(data.b.peRatio) : '—', better: null },
      { label: 'EPS', a: data.a.eps > 0 ? data.a.eps.toFixed(2) : '—', b: data.b.eps > 0 ? data.b.eps.toFixed(2) : '—', better: data.a.eps > data.b.eps ? 'a' : 'b' },
    ]
    return metrics
  }, [data])

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Compare Stocks</CardTitle>
        <div className="flex flex-wrap items-end gap-4 mt-3">
          <div className="w-64">
            <Select
              label="Stock A"
              options={options}
              value={stockA}
              onChange={e => setStockA(e.target.value)}
            />
          </div>
          <div className="w-64">
            <Select
              label="Stock B"
              options={options}
              value={stockB}
              onChange={e => setStockB(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {data.a && data.b && (
        <>
          <Card>
            <CardTitle>Price Comparison</CardTitle>
            <CustomLineChart
              data={chartData}
              lines={[
                { dataKey: stockA, color: '#3b82f6', name: stockA },
                { dataKey: stockB, color: '#f59e0b', name: stockB },
              ]}
              height={350}
            />
          </Card>

          <Card>
            <CardTitle>Metrics Comparison</CardTitle>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-market-border">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Metric</th>
                    <th className="text-right py-2 px-3 text-blue-400 font-mono font-semibold">{stockA}</th>
                    <th className="text-right py-2 px-3 text-amber-400 font-mono font-semibold">{stockB}</th>
                  </tr>
                </thead>
                <tbody>
                  {metricRows.map(row => (
                    <tr key={row.label} className="border-b border-market-border/50">
                      <td className="py-2.5 px-3 text-gray-400">{row.label}</td>
                      <td className={`py-2.5 px-3 text-right font-mono ${row.better === 'a' ? 'text-market-up' : 'text-white'}`}>
                        {row.a}
                        {row.better === 'a' && <Badge variant="positive" className="ml-2">Best</Badge>}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono ${row.better === 'b' ? 'text-market-up' : 'text-white'}`}>
                        {row.b}
                        {row.better === 'b' && <Badge variant="positive" className="ml-2">Best</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
