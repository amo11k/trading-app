interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 p-1 bg-market-border/50 rounded-lg ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150
            ${active === tab.id
              ? 'bg-market-accent text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-market-hover'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
