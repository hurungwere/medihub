'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getVerifications, updateVerification } from '@/app/actions/admin'

const recentActivity = [
  { action:'New tender posted', detail:'TND-089 — Defibrillator x4', time:'3 min ago', type:'tender' },
  { action:'Supplier verified', detail:'MedGlobal Corp. — Verified', time:'12 min ago', type:'verify' },
  { action:'Bid awarded', detail:'TND-076 won by PharmaDist', time:'28 min ago', type:'award' },
  { action:'New registration', detail:'Sunrise Hospital joined', time:'1 hr ago', type:'user' },
  { action:'Category added', detail:'Orthopaedic Equipment', time:'2 hrs ago', type:'category' },
]

const activityIcon: Record<string,string> = {
  tender:'📋', verify:'✅', award:'🏆', user:'👤', category:'🏷️',
}

// Growth chart data
const growthData = [120,145,132,178,156,201,189,224,243,218,267,312]
const maxGrowth = Math.max(...growthData)

const adminSections = [
  { icon:'📊', label:'Overview', href:'/admin', id:'overview' },
  { icon:'👥', label:'Users', href:'/admin/users', id:'users' },
  { icon:'🏭', label:'Suppliers', href:'/admin/suppliers', id:'suppliers' },
  { icon:'🏥', label:'Clinics', href:'/admin/clinics', id:'clinics' },
  { icon:'📋', label:'Tenders', href:'/admin/tenders', id:'tenders' },
  { icon:'🏷️', label:'Categories', href:'/admin/categories', id:'categories' },
  { icon:'🛡️', label:'Verification', href:'/admin/verification', id:'verification' },
  { icon:'📈', label:'Reports', href:'/admin/reports', id:'reports' },
  { icon:'⚙️', label:'Settings', href:'/admin/settings', id:'settings' },
]

const platformStats = [
  { label:'Total Users', value:'2,847', change:'+124 this month', trend:'up', icon:'👥' },
  { label:'Active Tenders', value:'342', change:'+28 today', trend:'up', icon:'📋' },
  { label:'Verified Suppliers', value:'1,840', change:'18 pending review', trend:'neutral', icon:'🏭' },
  { label:'Platform Revenue', value:'$128K', change:'+22% MoM', trend:'up', icon:'💰' },
  { label:'Bids Submitted', value:'8,491', change:'This month', trend:'up', icon:'📤' },
  { label:'Awards Given', value:'1,203', change:'Closed tenders', trend:'neutral', icon:'🏆' },
]

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    try {
      const data = await getVerifications()
      const pending = data.filter((v: any) => v.status === 'Pending')
      setVerifications(pending)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (id: number) => {
    if (confirm('Are you sure you want to approve this verification?')) {
      const res = await updateVerification(id, 'Approved')
      if (res.success) {
        fetchPending()
      } else {
        alert(res.error || 'Failed to approve verification')
      }
    }
  }
  return (
    <>
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-300">Admin Dashboard</h1>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-semibold">ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors">Export Report</button>
          <button className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">7</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time metrics and activity across MediHub.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {platformStats.map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-4 card-hover">
              <div className="text-xl mb-2">{s.icon}</div>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className={`text-xs mt-0.5 ${s.trend==='up'?'text-emerald-400':'text-slate-500'}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Growth Chart + Activity */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Growth Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Platform Growth</h3>
                <p className="text-xs text-slate-500">Monthly active users</p>
              </div>
              <span className="text-emerald-400 text-sm font-semibold">+22% MoM</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {growthData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-full rounded-t transition-all duration-300 bg-primary-500/30 group-hover:bg-primary-500/70"
                    style={{ height: `${(v/maxGrowth)*100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 text-white text-xs px-1.5 py-1 rounded -mt-6 text-center whitespace-nowrap">{v}</div>
                  </div>
                  <span className="text-[9px] text-slate-600">M{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Live Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm flex-shrink-0">{activityIcon[a.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200">{a.action}</p>
                    <p className="text-xs text-slate-500 truncate">{a.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-xs text-slate-500">Live updates</span>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
            <div>
              <h3 className="text-sm font-semibold text-white">Pending Verifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">{verifications.length} awaiting review</p>
            </div>
            <Link href="/admin/verification" className="text-xs text-primary-400 hover:text-primary-300 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-slate-800/40">
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading pending requests...</div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No pending verifications.</div>
            ) : (
              verifications.map((v, i) => (
                <div key={v.id || i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-emerald-500/10 flex items-center justify-center text-lg flex-shrink-0">
                    {v.type==='Supplier' ? '🏭' : '🏥'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.type} · {v.docs || 0} documents · {v.submitted || 'Just now'}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${v.risk==='Low' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border-amber-500/25'}`}>
                    {v.risk || 'Low'} Risk
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handleApprove(v.id)}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-semibold rounded-lg border border-emerald-500/25 transition-all duration-200"
                    >
                      Approve
                    </button>
                    <Link 
                      href="/admin/verification"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg transition-all duration-200"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}
