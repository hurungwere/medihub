'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/app/actions/auth'

const adminSections = [
  { icon:'📊', label:'Overview', href:'/admin', id:'overview' },
  { icon:'👥', label:'Users', href:'/admin/users', id:'users' },
  { icon:'🏭', label:'Suppliers', href:'/admin/suppliers', id:'suppliers' },
  { icon:'🏥', label:'Clinics', href:'/admin/clinics', id:'clinics' },
  { icon:'📋', label:'Tenders', href:'/admin/tenders', id:'tenders' },
  { icon:'🏷️', label:'Categories', href:'/admin/categories', id:'categories' },
  { icon:'🛡️', label:'Verification', href:'/admin/verification', id:'verification' },
  { icon:'✉️', label:'Contact Centre', href:'/admin/support', id:'support' },
  { icon:'📝', label:'Case Studies', href:'/admin/case-studies', id:'case-studies' },
  { icon:'📈', label:'Reports', href:'/admin/reports', id:'reports' },
  { icon:'⚙️', label:'Settings', href:'/admin/settings', id:'settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [userName, setUserName] = useState('Admin')
  const [userOrg, setUserOrg] = useState('Super Admin')

  useEffect(() => {
    const cookiesObj = document.cookie.split('; ').reduce((prev, current) => {
      const [name, ...value] = current.split('=')
      if (name) prev[name] = value.join('=')
      return prev
    }, {} as Record<string, string>)
    
    if (cookiesObj['session_user']) {
      try {
        const user = JSON.parse(decodeURIComponent(cookiesObj['session_user']))
        setUserName(user.name || user.email || 'Admin')
        setUserOrg(user.organization || 'Super Admin')
      } catch (e) {}
    }
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800/60 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} flex-shrink-0`}>
        <div className={`flex items-center gap-2.5 p-4 border-b border-slate-800/60 h-20 ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? (
            <img src="/logo/medihub-logo-icon.svg" alt="MediHub Logo" className="w-10 h-10 flex-shrink-0" />
          ) : (
            <div className="flex flex-col mt-2">
              <img src="/logo/medihub-logo-reversed.svg" alt="MediHub Logo" className="h-8 w-auto mb-1" />
              <p className="text-[10px] text-primary-400 font-semibold leading-none">Admin Console</p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {adminSections.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.id} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-500/15 text-primary-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${collapsed ? 'justify-center' : ''}`}>
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        
        {/* User Profile Footer */}
        <div className={`p-3 border-t border-slate-800/60 flex items-center justify-between gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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

        <button onClick={() => setCollapsed(!collapsed)} className="p-3 border-t border-slate-800/60 text-slate-500 hover:text-slate-300 flex justify-center w-full">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}
