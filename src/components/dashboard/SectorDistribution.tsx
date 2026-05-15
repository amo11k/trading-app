import { useMemo } from 'react'
import { useMarketStore } from '../../store/useMarketStore'
import { Card, CardTitle } from '../ui/Card'
import { CustomBarChart } from '../charts/BarChart'
import { formatMarketCap } from '../../utils/formatters'

const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': '#3b82f6',
  'Health Care': '#22c55e',
  'Financials': '#f59e0b',
  'Consumer Discretionary': '#ef4444',
  'Communication Services': '#8b5cf6',
  'Industrials': '#06b6d4',
  'Consumer Staples': '#ec4899',
  'Energy': '#f97316',
  'Utilities': '#10b981',
  'Real Estate': '#6366f1',
  'Materials': '#84cc16',
}

export function SectorDistribution() {
  const { stocks } = useMarketStore()

  const sectorData = useMemo(() => {
    const map = new Map<string, number>()
    stocks.forEach(s => {
      map.set(s.sector, (map.get(s.sector) || 0) + s.marketCap)
    })
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name: name.split(' ')[0],
        value: value / 1_000_000_000_000,
        fill: SECTOR_COLORS[name] || '#6b7280',
        fullName: name,
      }))
      .sort((a, b) => b.value - a.value)
  }, [stocks])

  return (
    <Card>
      <CardTitle>Sector Market Cap Distribution</CardTitle>
      <CustomBarChart data={sectorData} height={250} barSize={18} />
      <div className="flex flex-wrap gap-3 mt-3">
        {sectorData.map(s => (
          <div key={s.fullName} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.fill }} />
            <span className="text-xs text-gray-400">{s.fullName.split(' ').slice(0, 2).join(' ')}</span>
            <span className="text-xs text-gray-500 font-mono">{formatMarketCap(s.value * 1_000_000_000_000)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
