import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ApiStatusBanner } from './ApiStatusBanner'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ApiStatusBanner />
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
