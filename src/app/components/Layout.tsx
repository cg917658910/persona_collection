import { Outlet, useLocation, useNavigate } from 'react-router'
import { Home, Search, Compass, User } from 'lucide-react'
import { motion } from 'motion/react'
import { PlayerProvider } from '../context/PlayerContext'
import { PlayerBar } from './PlayerBar'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/search', icon: Search, label: '搜索' },
    { path: '/discover', icon: Compass, label: '发现' },
    { path: '/profile', icon: User, label: '我的' },
  ]

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  return (
    <PlayerProvider>
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1115' }}>
        <div className="relative w-full max-w-[375px] h-screen flex flex-col" style={{ background: '#0F1115' }}>
          <main className="flex-1 overflow-y-auto pb-36">
            <Outlet />
          </main>
          <PlayerBar />
          <nav className="fixed bottom-0 w-full max-w-[375px] border-t flex items-center justify-around h-16" style={{ background: '#1A1D23', borderColor: 'rgba(108, 122, 137, 0.15)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = isActive(tab.path)
              return (
                <button key={tab.path} onClick={() => navigate(tab.path)} className="flex flex-col items-center justify-center gap-1 py-2 px-4 relative">
                  {active && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-lg" style={{ background: 'rgba(214, 179, 106, 0.1)' }} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
                  <Icon size={20} strokeWidth={1.5} style={{ color: active ? '#D6B36A' : '#6C7A89', position: 'relative' }} />
                  <span className="text-xs relative" style={{ color: active ? '#D6B36A' : '#6C7A89' }}>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </PlayerProvider>
  )
}
