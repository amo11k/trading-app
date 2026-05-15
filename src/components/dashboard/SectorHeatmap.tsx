import { useMemo } from 'react'
import { useMarketStore } from '../../store/useMarketStore'
import { Card, CardTitle } from '../ui/Card'
import { formatChangePercent } from '../../utils/formatters'
import { Skeleton } from '../ui/Skeleton'

export function SectorHeatmap() {
  const { stocks, loading } = useMarketStore()

  const sectors = useMemo(() => {
    const map = new Map<string, { totalChange: number; count: number; mcap: number }>()
    stocks.forEach(s => {
      const existing = map.get(s.sector) || { totalChange: 0, count: 0, mcap: 0 }
      existing.totalChange += s.changePercent
      existing.count += 1
      existing.mcap += s.marketCap
      map.set(s.sector, existing)
    })
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        avgChange: data.totalChange / data.count,
        count: data.count,
        mcap: data.mcap,
      }))
      .sort((a, b) => b.mcap - a.mcap)
  }, [stocks])

  if (loading && !stocks.length) {
    return (
      <Card>
        <Skeleton className="w-24 h-4 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  const maxAbsChange = Math.max(...sectors.map(s => Math.abs(s.avgChange)), 0.1)

  return (
    <Card>
      <CardTitle>Sector Performance</CardTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
        {sectors.map(sector => {
          const intensity = Math.abs(sector.avgChange) / maxAbsChange
          const isUp = sector.avgChange >= 0
          const r = isUp ? Math.round(22 - intensity * 15) : Math.round(239 - intensity * 30)
          const g = isUp ? Math.round(197 - intensity * 50) : Math.round(68 - intensity * 30)
          const b = isUp ? Math.round(94 - intensity * 40) : Math.round(68 - intensity * 20)

          return (
            <div
              key={sector.name}
              className="rounded-lg p-3 transition-colors cursor-default"
              style={{
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
                borderWidth: 1,
              }}
            >
              <p className="text-xs text-gray-400 truncate">{sector.name}</p>
              <p className={`text-sm font-semibold font-mono mt-0.5 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
                {formatChangePercent(sector.avgChange)}
              </p>
              <p className="text-xs text-gray-500">{sector.count} stocks</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
