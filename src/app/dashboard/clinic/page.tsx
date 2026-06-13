'use client'

import { useState } from 'react'
import Link from 'next/link'

const stats = [
  { label:'Active Tenders', value:'12', change:'+2 this week', trend:'up', color:'text-primary-400', bg:'bg-primary-500/10' },
  { label:'Quotes Received', value:'47', change:'+8 today', trend:'up', color:'text-emerald-400', bg:'bg-emerald-500/10' },
  { label:'Approved Orders', value:'8', change:'2 pending approval', trend:'neutral', color:'text-cyan-400', bg:'bg-cyan-500/10' },
  { label:'Total Spent', value:'$284K', change:'↓12% vs last month', trend:'down', color:'text-amber-400', bg:'bg-amber-500/10' },
]

const recentTenders = [
  { id:'TND-001', title:'Surgical Gloves — Latex Free', category:'Consumables', bids:7, status:'Open', deadline:'3 days', budget:'$8,200' },
  { id:'TND-002', title:'MRI Contrast Agent', category:'Pharmaceuticals', bids:4, status:'Open', deadline:'6 days', budget:'$24,500' },
  { id:'TND-003', title:'ICU Patient Monitor', category:'Equipment', bids:9, status:'Evaluating', deadline:'Closed', budget:'$96,000' },
  { id:'TND-004', title:'IV Catheters — Short', category:'Consumables', bids:11, status:'Awarded', deadline:'Done', budget:'$5,600' },
  { id:'TND-005', title:'Ultrasound Machine — Portable', category:'Equipment', bids:3, status:'Open', deadline:'12 days', budget:'$45,000' },
]

const statusColors: Record<string, string> = {
  Open: 'bg-primary-500/15 text-primary-400 border-primary-500/25',
  Evaluating: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Awarded: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Closed: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
}

// Simple bar chart
const spendData = [62,78,54,91,45,67,84,73,88,95,71,92]
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function SpendChart() {
  const max = Math.max(...spendData)
  return (
    <div className="flex items-end gap-1.5 h-28 w-full">
      {spendData.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full rounded-t-sm bg-primary-500/20 hover:bg-primary-500/50 transition-all duration-300 relative cursor-pointer"
            style={{ height: `${(v/max)*100}%` }}>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ${v}K
            </div>
          </div>
          <span className="text-[9px] text-slate-600">{months[i].slice(0,1)}</span>
        </div>
      ))}
    </div>
  )
}

// Donut chart (CSS-based)
function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  )
}

const quickActions = [
  { label:'Post New Tender', href:'/dashboard/clinic/create', icon:'📋', color:'bg-primary-500 hover:bg-primary-600' },
  { label:'Compare Bids', href:'/dashboard/clinic/bids', icon:'📊', color:'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25' },
  { label:'View Messages', href:'/dashboard/clinic/messages', icon:'💬', color:'bg-slate-800 hover:bg-slate-700 border border-slate-700' },
]

export default function ClinicDashboard() {
  const [period, setPeriod] = useState<'week'|'month'|'year'>('month')

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Good morning, Dr. Mitchell 👋</h1>
          <p className="text-sm text-slate-400 mt-1">Here's your procurement overview for today.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
          {(['week','month','year'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${period===p ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 card-hover">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-3`}>
              <div className={`w-2 h-2 rounded-full ${s.color.replace('text-','bg-')}`}/>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs font-medium text-slate-400">{s.label}</p>
            <p className={`text-xs mt-1 ${s.trend==='up'?'text-emerald-400':s.trend==='down'?'text-rose-400':'text-slate-500'}`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Spend Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Procurement Spend</h3>
              <p className="text-xs text-slate-500">Monthly spend in thousands USD</p>
            </div>
            <span className="text-2xl font-bold text-white">$284K</span>
          </div>
          <SpendChart />
        </div>
        {/* Completion Rings */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-6">Tender Performance</h3>
          <div className="grid grid-cols-3 gap-2">
            <DonutChart value={78} label="Award Rate" color="#0B5FFF"/>
            <DonutChart value={92} label="On-Time" color="#10B981"/>
            <DonutChart value={65} label="Savings" color="#22D3EE"/>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 ${a.color}`}>
            <span>{a.icon}</span>{a.label}
          </Link>
        ))}
      </div>

      {/* Recent Tenders */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Tenders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your active procurement requests</p>
          </div>
          <Link href="/dashboard/clinic/tenders" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/40">
                {['ID','Title','Category','Bids','Status','Deadline','Budget',''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {recentTenders.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{t.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-200 max-w-[200px] truncate">{t.title}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{t.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      {t.bids}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{t.deadline}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-300">{t.budget}</td>
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/clinic/tenders/${t.id}`} className="text-xs text-primary-400 hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-all font-medium">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
