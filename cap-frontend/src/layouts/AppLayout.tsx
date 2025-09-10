import { Link, NavLink, Outlet } from 'react-router-dom'
import { BarChart3, ClipboardList, Gauge, Settings, Table } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/workflows', label: 'Workflows', icon: ClipboardList },
  { to: '/records', label: 'Records', icon: Table },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  return (
    <div className="min-h-full grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <header className="col-span-2 h-14 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="h-full flex items-center justify-between px-4">
          <Link to="/dashboard" className="font-semibold tracking-tight">
            CAP App
          </Link>
          <div className="text-sm text-gray-500">v0.1</div>
        </div>
      </header>
      <aside className="border-r bg-white">
        <nav className="p-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

