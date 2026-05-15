import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface AreaChartProps {
  data: { time: string; value: number }[]
  color?: string
  height?: number
  showGrid?: boolean
  gradientId?: string
}

export function CustomAreaChart({
  data,
  color = '#3b82f6',
  height = 300,
  showGrid = true,
  gradientId = 'areaGrad',
}: AreaChartProps) {
  const isUp = data.length > 1 && data[data.length - 1].value >= data[0].value
  const strokeColor = isUp ? '#22c55e' : '#ef4444'
  const actualColor = color || strokeColor

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={actualColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={actualColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2025" vertical={false} />
        )}
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          dy={10}
        />
        <YAxis
          domain={['auto', 'auto']}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          dx={-5}
          tickFormatter={(v: number) => v.toLocaleString()}
        />
        <Tooltip
          contentStyle={{
            background: '#111316',
            border: '1px solid #1e2025',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#9ca3af' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={actualColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: actualColor }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
