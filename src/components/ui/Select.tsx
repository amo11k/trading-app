import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
      <select
        className={`w-full bg-market-border border border-market-border rounded-md px-3 py-2 text-sm text-white
          focus:outline-none focus:ring-1 focus:ring-market-accent focus:border-market-accent
          transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
