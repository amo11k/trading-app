import { AreaChart, Area } from 'recharts'

interface SparklineChartProps {
  data: number[]
  width?: number
  height?: number
  positive?: boolean
}

export function SparklineChart({ data, width = 80, height = 32, positive = true }: SparklineChartProps) {
  if (!data.length) return null

  const chartData = data.map((value, index) => ({ index, value }))
  const color = positive ? '#22c55e' : '#ef4444'

  return (
    <AreaChart width={width} height={height} data={chartData}>
      <defs>
        <linearGradient id={`sparkGrad-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.5}
        fill={`url(#sparkGrad-${positive ? 'up' : 'down'})`}
        dot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}
