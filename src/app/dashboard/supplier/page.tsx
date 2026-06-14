'use client'

import { useState } from 'react'
import Link from 'next/link'

const stats = [
  { label:'New Opportunities', value:'23', change:'+5 today', color:'text-primary-400', bg:'bg-primary-500/10', icon:'🎯' },
  { label:'Bids Submitted', value:'47', change:'This month', color:'text-emerald-400', bg:'bg-emerald-500/10', icon:'📤' },
  { label:'Won Bids', value:'12', change:'Win rate: 25%', color:'text-amber-400', bg:'bg-amber-500/10', icon:'🏆' },
  { label:'Revenue Pipeline', value:'$1.2M', change:'Estimated', color:'text-cyan-400', bg:'bg-cyan-500/10', icon:'💰' },
]

const opportunities = [
  { id:'TND-001', title:'Surgical Gloves — Latex Free', facility:'Northgate Hospital', category:'Consumables', budget:'$8,200', deadline:'3 days', match:94, urgent:true },
  { id:'TND-006', title:'Antibiotic Infusion Sets x500', facility:'City Clinic', category:'Pharmaceuticals', budget:'$12,400', deadline:'5 days', match:88, urgent:false },
  { id:'TND-007', title:'Autoclave Sterilizer — Class B', facility:'Metro Lab', category:'Equipment', budget:'$28,000', deadline:'8 days', match:82, urgent:false },
  { id:'TND-008', title:'Blood Glucose Strips x10,000', facility:'Diabetes Center', category:'Diagnostics', budget:'$4,200', deadline:'2 days', match:97, urgent:true },
]

const myBids = [
  { id:'BID-021', bidTitle:'ICU Patient Monitor', submitted:'2 days ago', status:'Under Review', amount:'$92,500' },
  { id:'BID-020', bidTitle:'N95 Masks x20K', submitted:'4 days ago', status:'Won', amount:'$18,400' },
  { id:'BID-019', bidTitle:'Saline Solution 500ml', submitted:'1 week ago', status:'Lost', amount:'$6,800' },
]

const bidStatusColor: Record<string,string> = {
  'Under Review': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Won: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Lost: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
}

// Mini bar chart for win rate
const weeklyData = [3,5,2,7,4,8,6]
const days = ['M','T','W','T','F','S','S']

export default function SupplierDashboard() {
  const [tab, setTab] = useState<'opportunities'|'bids'>('opportunities')

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Welcome back, MedSupply 👋</h1>
          <p className="text-sm text-slate-400 mt-1">You have <span className="text-emerald-400 font-semibold">23 new opportunities</span> matching your profile today.</p>
        </div>
        <Link href="/dashboard/supplier/tenders"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5">
          🔍 Explore All Bids
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 card-hover">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-3 text-lg`}>{s.icon}</div>
            <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs font-medium text-slate-400">{s.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weekly activity */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Bids This Week</h3>
          <div className="flex items-end gap-1.5 h-20">
            {weeklyData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-emerald-500/30 hover:bg-emerald-500/60 transition-colors"
                  style={{ height: `${(v / Math.max(...weeklyData)) * 100}%` }}/>
                <span className="text-[9px] text-slate-600">{days[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Total: <span className="text-white font-semibold">35 bids</span></p>
        </div>

        {/* Match Score Breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Match Score Distribution</h3>
          <div className="space-y-3">
            {[['90–100%','Excellent',14,'#10B981'],['80–89%','Good',8,'#0B5FFF'],['70–79%','Fair',3,'#F59E0B'],['<70%','Low',1,'#EF4444']].map(([range,label,count,color])=>(
              <div key={range as string} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">{range}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width:`${(count as number/26)*100}%`, backgroundColor:color as string }}/>
                </div>
                <span className="text-xs font-semibold text-slate-300 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Supplier Profile</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">🏭</div>
            <div>
              <p className="text-sm font-semibold text-white">MedSupply Co.</p>
              <span className="badge-verified">✓ Verified Supplier</span>
            </div>
          </div>
          <div className="space-y-2">
            {[['Profile Completeness','88%'],['Response Rate','96%'],['On-time Delivery','94%']].map(([k,v])=>(
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{k}</span>
                <span className="text-xs font-semibold text-emerald-400">{v}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/supplier/profile" className="mt-4 block text-center text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Improve Profile →
          </Link>
        </div>
      </div>

      {/* Opportunities / Bids Tabs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center border-b border-slate-800/60 px-5 pt-5 gap-4">
          {(['opportunities','bids'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-all duration-200 ${tab===t ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t === 'opportunities' ? '🎯 New Opportunities' : '📤 My Bids'}
            </button>
          ))}
        </div>

        {tab === 'opportunities' && (
          <div className="divide-y divide-slate-800/40">
            {opportunities.map(o => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors group">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"/>
                    <circle cx="22" cy="22" r="18" fill="none" stroke={o.match>=90?'#10B981':'#0B5FFF'} strokeWidth="5"
                      strokeDasharray={`${2*Math.PI*18}`} strokeDashoffset={`${2*Math.PI*18*(1-o.match/100)}`} strokeLinecap="round"/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">{o.match}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">{o.title}</p>
                    {o.urgent && <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[10px] font-semibold border border-rose-500/25">URGENT</span>}
                  </div>
                  <p className="text-xs text-slate-500">{o.facility} · {o.category}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-right">
                  <div><p className="text-xs text-slate-500">Budget</p><p className="text-xs font-semibold text-slate-200">{o.budget}</p></div>
                  <div><p className="text-xs text-slate-500">Closes</p><p className="text-xs font-semibold text-amber-400">{o.deadline}</p></div>
                </div>
                <Link href={`/dashboard/supplier/tenders/${o.id}`}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/25 transition-all duration-200">
                  Quote →
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === 'bids' && (
          <div className="divide-y divide-slate-800/40">
            {myBids.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="text-xl">📋</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{b.bidTitle}</p>
                  <p className="text-xs text-slate-500">{b.id} · Submitted {b.submitted}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${bidStatusColor[b.status]}`}>{b.status}</span>
                <span className="text-sm font-bold text-slate-200 hidden sm:block">{b.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
