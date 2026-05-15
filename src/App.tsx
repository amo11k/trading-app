import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { StockDetail } from './pages/StockDetail'
import { Watchlist } from './pages/Watchlist'
import { Comparison } from './pages/Comparison'
import { Screener } from './pages/Screener'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/screener" element={<Screener />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
