import { useCallback } from 'react'
import { useStockDetailStore } from '../../store/useStockDetailStore'
import { CHART_TIMEFRAMES } from '../../constants/config'
import { CustomAreaChart } from '../charts/AreaChart'
import { Card, CardTitle } from '../ui/Card'
import { SkeletonChart } from '../ui/Skeleton'
import { formatTime } from '../../utils/formatters'

export function StockChart() {
  const { candles, timeframe, setTimeframe, candlesLoading } = useStockDetailStore()

  const handleTimeframeChange = useCallback((index: number) => {
    setTimeframe(index)
  }, [setTimeframe])

  if (candlesLoading) return <SkeletonChart />

  const chartData = candles.map(c => ({
    time: formatTime(c.time),
    value: c.close,
  }))

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Price Chart</CardTitle>
        <div className="flex gap-1">
          {CHART_TIMEFRAMES.map((tf, index) => (
            <button
              key={tf.label}
              onClick={() => handleTimeframeChange(index)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors
                ${timeframe === index
                  ? 'bg-market-accent text-white'
                  : 'text-gray-400 hover:text-white hover:bg-market-hover'
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      {chartData.length > 0 ? (
        <CustomAreaChart data={chartData} height={400} />
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500 text-sm">
          No chart data available
        </div>
      )}
    </Card>
  )
}
