import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const base = hover ? 'card-hover' : 'card'
  return (
    <div className={`${base} animate-fade-in ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-semibold text-gray-200 uppercase tracking-wider ${className}`}>{children}</h3>
}

export function CardValue({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-2xl font-bold text-white font-mono ${className}`}>{children}</p>
}
