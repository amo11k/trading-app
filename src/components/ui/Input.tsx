import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
}

export function Input({ label, icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-market-border border border-market-border rounded-md px-3 py-2 text-sm text-white
          placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-market-accent focus:border-market-accent
          transition-colors ${icon ? 'pl-10' : ''} ${className}`}
        {...props}
      />
    </div>
  )
}
