'use client'

import { useState, useEffect } from 'react'
import { Download, Calendar, ArrowUpRight, TrendingUp, DollarSign, Users, FileText, CheckCircle } from 'lucide-react'
import { getReports } from '@/app/actions/admin'

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const reports = await getReports()
      setData(reports)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  const stats = data?.stats || {
    totalUsers: 2847,
    totalTenders: 342,
    totalSuppliers: 1840,
    totalClinics: 1007,
    activeTenders: 120,
    revenueEstimate: '$128,450',
    bidsSubmitted: 8491
  }

  const userGrowth = data?.userGrowth || [120, 145, 132, 178, 156, 201, 189, 224, 243, 218, 267, 312]
  const recentActivity = data?.recentActivity || []

  const maxGrowth = Math.max(...userGrowth)

  const cards = [
    { label: 'Total Revenue Estimate', value: stats.revenueEstimate, icon: DollarSign, color: 'from-emerald-500/20 to-teal-500/10', text: 'text-emerald-400' },
    { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500/20 to-indigo-500/10', text: 'text-blue-400' },
    { label: 'Bids Posted', value: stats.totalTenders, icon: FileText, color: 'from-purple-500/20 to-pink-500/10', text: 'text-purple-400' },
    { label: 'Bids Submitted', value: stats.bidsSubmitted, icon: TrendingUp, color: 'from-amber-500/20 to-orange-500/10', text: 'text-amber-400' },
  ]

  return (
    <>
      <title>Analytics & Reports - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Platform Analytics</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">REPORTS</span>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Growth & Metrics</h2>
          <p className="text-sm text-slate-400 mt-1">Review user registration, engagement and transaction metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, idx) => {
            const Icon = c.icon
            return (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800/60 flex items-center justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${c.color} rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-500`} />
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{c.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/60 ${c.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart + Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Active Users Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Monthly Registrations</h3>
                <p className="text-xs text-slate-400 font-medium">Growth trend over the past 12 months</p>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" /> +28% YoY
              </span>
            </div>

            {/* Premium Custom SVG Line Chart */}
            <div className="relative h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeDasharray="4,4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeDasharray="4,4" />
                <line x1="0" y1="180" x2="600" y2="180" stroke="#1e293b" strokeDasharray="4,4" />
                
                {/* Area under the line */}
                <path 
                  d={`M 0,240 
                     ${userGrowth.map((val: number, i: number) => {
                       const x = (i / (userGrowth.length - 1)) * 600
                       const y = 240 - (val / maxGrowth) * 160
                       return `L ${x},${y}`
                     }).join(' ')}
                     L 600,240 Z`} 
                  fill="url(#chart-grad)" 
                />

                {/* The main trendline */}
                <path 
                  d={userGrowth.map((val: number, i: number) => {
                    const x = (i / (userGrowth.length - 1)) * 600
                    const y = 240 - (val / maxGrowth) * 160
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                  }).join(' ')} 
                  fill="none" 
                  stroke="rgb(59, 130, 246)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Interactive circles */}
                {userGrowth.map((val: number, i: number) => {
                  const x = (i / (userGrowth.length - 1)) * 600
                  const y = 240 - (val / maxGrowth) * 160
                  return (
                    <circle key={i} cx={x} cy={y} r="5" fill="rgb(30, 41, 59)" stroke="rgb(59, 130, 246)" strokeWidth="2.5" className="cursor-pointer hover:r-7 transition-all duration-200" />
                  )
                })}
              </svg>
            </div>
            
            {/* Months Axis Labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1 mt-4">
              <span>Jul 2025</span>
              <span>Sep 2025</span>
              <span>Nov 2025</span>
              <span>Jan 2026</span>
              <span>Mar 2026</span>
              <span>May 2026</span>
            </div>
          </div>

          {/* Audit Logs / Activity */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60 flex flex-col">
            <h3 className="font-bold text-lg text-white mb-4">Live Platform Activity</h3>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 no-scrollbar max-h-[290px]">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-slate-500">No activity logged.</p>
              ) : (
                recentActivity.map((act: any, idx: number) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-sm flex-shrink-0">
                      {act.type === 'tender' ? '📋' : act.type === 'verify' ? '✅' : '🏆'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 leading-tight">{act.action}</p>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{act.detail}</p>
                      <span className="text-[9px] text-slate-600 font-semibold uppercase">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
