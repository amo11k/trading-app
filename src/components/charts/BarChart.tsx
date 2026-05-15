import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface BarChartProps {
  data: { name: string; value: number; fill?: string }[]
  height?: number
  showGrid?: boolean
  barSize?: number
}

export function CustomBarChart({ data, height = 200, showGrid = true, barSize = 20 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barSize={barSize}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2025" vertical={false} />
        )}
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          dx={-5}
        />
        <Tooltip
          contentStyle={{
            background: '#111316',
            border: '1px solid #1e2025',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#9ca3af' }}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill || '#3b82f6'} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
