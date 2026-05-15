import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'warning'
  className?: string
}

const variants = {
  default: 'bg-gray-700 text-gray-200',
  positive: 'bg-green-900/50 text-green-400 border border-green-700/50',
  negative: 'bg-red-900/50 text-red-400 border border-red-700/50',
  neutral: 'bg-gray-700/50 text-gray-400 border border-gray-600/50',
  warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
