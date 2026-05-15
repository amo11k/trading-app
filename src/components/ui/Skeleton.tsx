interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rect' | 'circle'
  width?: string
  height?: string
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const base = 'bg-gray-700/50 animate-pulse rounded'
  const variants = {
    text: 'h-4 w-full',
    rect: 'h-full w-full',
    circle: 'h-10 w-10 rounded-full',
  }

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      <Skeleton className="w-1/3" />
      <Skeleton className="w-2/3" />
      <Skeleton className="w-1/2" />
    </div>
  )
}

export function SkeletonTableRow({ cols = 7 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-3 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`${i === 0 ? 'w-16' : i === 1 ? 'w-32 flex-1' : 'w-20'} h-4`} />
      ))}
    </div>
  )
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex gap-2 mb-4">
        <Skeleton className="w-12 h-6" />
        <Skeleton className="w-12 h-6" />
        <Skeleton className="w-12 h-6" />
        <Skeleton className="w-12 h-6" />
      </div>
      <Skeleton variant="rect" className="h-64 w-full rounded-lg" />
    </div>
  )
}
