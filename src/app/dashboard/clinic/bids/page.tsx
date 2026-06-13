'use client'

import { useState } from 'react'

const suppliers = [
  { id:'S1', name:'MedSupply Co.', rating:4.8, badge:'Verified', price:8200, bulk:7900, delivery:'5-7 days', warranty:'12 months', stock:'In Stock', score:94 },
  { id:'S2', name:'PharmaDist Ltd.', rating:4.6, badge:'Premium', price:7800, bulk:7500, delivery:'3-5 days', warranty:'6 months', stock:'In Stock', score:89 },
  { id:'S3', name:'Global MedSource', rating:4.3, badge:'Trusted', price:8600, bulk:8200, delivery:'10-14 days', warranty:'18 months', stock:'Limited', score:76 },
]

const metrics = ['Price','Bulk Price','Delivery','Rating','Warranty','Stock','Match Score']

export default function BidComparisonPage() {
  const [selected, setSelected] = useState<string[]>(['S1','S2','S3'])
  const filtered = suppliers.filter(s => selected.includes(s.id))

  const best = (field: keyof typeof suppliers[0], lower = true) => {
    const vals = filtered.map(s => s[field])
    const target = lower ? Math.min(...vals as number[]) : Math.max(...vals as number[])
    return target
  }

  const formatVal = (s: typeof suppliers[0], metric: string) => {
    switch(metric) {
      case 'Price': return `$${s.price.toLocaleString()}`
      case 'Bulk Price': return `$${s.bulk.toLocaleString()}`
      case 'Delivery': return s.delivery
      case 'Rating': return `⭐ ${s.rating}/5`
      case 'Warranty': return s.warranty
      case 'Stock': return s.stock
      case 'Match Score': return `${s.score}%`
      default: return ''
    }
  }

  const isBest = (s: typeof suppliers[0], metric: string) => {
    switch(metric) {
      case 'Price': return s.price === best('price')
      case 'Bulk Price': return s.bulk === best('bulk')
      case 'Rating': return s.rating === best('rating', false)
      case 'Match Score': return s.score === best('score', false)
      case 'Stock': return s.stock === 'In Stock'
      default: return false
    }
  }

  const badgeStyle: Record<string, string> = {
    Verified: 'badge-verified',
    Premium: 'badge-premium',
    Trusted: 'badge-trusted',
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Bid Comparison</h1>
        <p className="text-sm text-slate-400 mt-1">TND-003 — ICU Patient Monitor (12 units)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className={`glass-card rounded-2xl p-5 card-hover cursor-pointer border-2 transition-all duration-200 ${selected.includes(s.id) ? 'border-primary-500/50' : 'border-transparent'}`}
            onClick={() => setSelected(prev => prev.includes(s.id) ? prev.filter(id=>id!==s.id) : [...prev,s.id])}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-emerald-500/10 flex items-center justify-center text-lg">🏭</div>
              <span className={badgeStyle[s.badge]}>{s.badge}</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{s.name}</h3>
            <div className="flex items-center gap-1.5 mb-3">
              {[0,1,2,3,4].map(i => (
                <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(s.rating) ? '#F59E0B' : '#1e293b'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="text-xs text-slate-400">{s.rating}</span>
            </div>
            {/* Score Ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"/>
                  <circle cx="22" cy="22" r="18" fill="none" stroke={s.score>=90?'#10B981':s.score>=80?'#0B5FFF':'#F59E0B'} strokeWidth="5"
                    strokeDasharray={`${2*Math.PI*18}`} strokeDashoffset={`${2*Math.PI*18*(1-s.score/100)}`} strokeLinecap="round"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{s.score}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Match Score</p>
                <p className="text-xs font-semibold text-white">${s.price.toLocaleString()} unit</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {filtered.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/60">
            <h3 className="text-sm font-semibold text-white">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">🏆 = Best value in category</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Metric</th>
                  {filtered.map(s => (
                    <th key={s.id} className="px-5 py-3 text-center text-xs font-semibold text-slate-200">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {metrics.map(m => (
                  <tr key={m} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-400">{m}</td>
                    {filtered.map(s => (
                      <td key={s.id} className="px-5 py-3.5 text-center">
                        <span className={`text-sm font-semibold ${isBest(s,m) ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {isBest(s,m) ? '🏆 ' : ''}{formatVal(s,m)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Action Row */}
          <div className="p-5 border-t border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-500 flex-shrink-0">Award to:</span>
              {filtered.map(s => (
                <button key={s.id} className="flex-shrink-0 px-4 py-2 text-xs font-semibold bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white rounded-xl border border-primary-500/25 transition-all duration-200">
                  Award {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
