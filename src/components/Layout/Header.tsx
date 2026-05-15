import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMarketStore } from '../../store/useMarketStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useWatchlistStore } from '../../store/useWatchlistStore'
import { useDebounce } from '../../hooks/useDebounce'
import { MARKET_CONFIG } from '../../constants/config'

export function Header() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, MARKET_CONFIG.DEBOUNCE_MS)
  const navigate = useNavigate()
  const { setSearch } = useMarketStore()
  const { isDark, toggle } = useThemeStore()
  const watchlistCount = useWatchlistStore(s => s.symbols.length)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    setSearch(value)
  }, [setSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate(`/stock/${searchInput.trim().toUpperCase()}`)
    }
  }, [navigate, searchInput])

  return (
    <header className="sticky top-0 z-40 glass border-b border-market-border">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-market-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white hidden sm:block">
            S&P <span className="text-market-accent">500</span>
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search symbol or company..."
            className="w-full bg-market-border/50 border border-market-border rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-market-accent focus:border-market-accent transition-colors"
          />
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/" label="Dashboard" />
          <NavLink to="/watchlist" label={`Watchlist${watchlistCount > 0 ? ` (${watchlistCount})` : ''}`} />
          <NavLink to="/screener" label="Screener" />
          <NavLink to="/compare" label="Compare" />

          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-market-hover transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-market-hover rounded-md transition-colors hidden sm:block"
    >
      {label}
    </Link>
  )
}
