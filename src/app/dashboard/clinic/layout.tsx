'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logoutUser } from '@/app/actions/auth'

const sidebarItems = [
  { icon: '📊', label: 'Overview', href: '/dashboard/clinic', id: 'overview' },
  { icon: '📋', label: 'My Tenders', href: '/dashboard/clinic/tenders', id: 'tenders' },
  { icon: '➕', label: 'Create Tender', href: '/dashboard/clinic/create', id: 'create' },
  { icon: '📦', label: 'Bid Comparison', href: '/dashboard/clinic/bids', id: 'bids' },
  { icon: '💬', label: 'Messages', href: '/dashboard/clinic/messages', id: 'messages' },
  { icon: '🔔', label: 'Notifications', href: '/dashboard/clinic/notifications', id: 'notifications' },
  { icon: '⚙️', label: 'Settings', href: '/dashboard/clinic/settings', id: 'settings' },
]

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState('Clinic User')
  const [userOrg, setUserOrg] = useState('Clinic Account')

  useEffect(() => {
    const cookiesObj = document.cookie.split('; ').reduce((prev, current) => {
      const [name, ...value] = current.split('=')
      if (name) prev[name] = value.join('=')
      return prev
    }, {} as Record<string, string>)
    
    if (cookiesObj['session_user']) {
      try {
        const user = JSON.parse(decodeURIComponent(cookiesObj['session_user']))
        setUserName(user.name || user.email || 'Clinic User')
        setUserOrg(user.organization || 'Clinic Account')
      } catch (e) {}
    }
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800/60 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-2.5 p-4 border-b border-slate-800/60 h-20 ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? (
            <img src="/logo/medihub-logo-icon.svg" alt="MediHub Logo" className="w-10 h-10 flex-shrink-0" />
          ) : (
            <div className="flex flex-col mt-2">
              <img src="/logo/medihub-logo-reversed.svg" alt="MediHub Logo" className="h-8 w-auto mb-1" />
              <p className="text-[10px] text-primary-400 font-semibold leading-none">Clinic Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarItems.map(item => (
            <Link key={item.id} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800 group ${collapsed ? 'justify-center' : ''}`}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className={`p-3 border-t border-slate-800/60 flex items-center justify-between gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 truncate">{userOrg}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/80 flex-shrink-0" title="Log Out">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-slate-800/60 text-slate-500 hover:text-slate-300 transition-colors flex justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <h1 className="text-sm font-semibold text-slate-300">Clinic Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/clinic/create"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              New Tender
            </Link>
            <button className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
