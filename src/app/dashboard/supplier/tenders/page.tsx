'use client'

import { useState } from 'react'
import Link from 'next/link'

const allTenders = [
  { id:'TND-001', title:'Surgical Gloves — Latex Free', facility:'Northgate Hospital', category:'Consumables', budget:'$8,200', deadline:'3 days', bids:7, match:94, region:'London', urgent:true },
  { id:'TND-002', title:'MRI Contrast Agent', facility:'Metro Imaging Center', category:'Pharmaceuticals', budget:'$24,500', deadline:'6 days', bids:4, match:88, region:'Manchester', urgent:false },
  { id:'TND-003', title:'ICU Patient Monitor', facility:'Riverside Clinic', category:'Equipment', budget:'$96,000', deadline:'9 days', bids:9, match:76, region:'Birmingham', urgent:false },
  { id:'TND-004', title:'Blood Glucose Strips', facility:'Diabetes Center', category:'Diagnostics', budget:'$4,200', deadline:'2 days', bids:12, match:97, region:'London', urgent:true },
  { id:'TND-005', title:'Autoclave Sterilizer', facility:'Metro Lab', category:'Equipment', budget:'$28,000', deadline:'8 days', bids:3, match:82, region:'Leeds', urgent:false },
  { id:'TND-006', title:'Antibiotic Infusion Sets', facility:'City Clinic', category:'Pharmaceuticals', budget:'$12,400', deadline:'5 days', bids:6, match:91, region:'London', urgent:false },
]

const categories = ['All','Pharmaceuticals','Equipment','Consumables','Diagnostics','Laboratory','PPE']
const regions = ['All Regions','London','Manchester','Birmingham','Leeds','Bristol']

export default function TenderDiscovery() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [region, setRegion] = useState('All Regions')
  const [sortBy, setSortBy] = useState<'match'|'deadline'|'budget'>('match')
  const [view, setView] = useState<'grid'|'list'>('list')

  const filtered = allTenders
    .filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.facility.toLowerCase().includes(search.toLowerCase())
      const matchCat = cat === 'All' || t.category === cat
      const matchRegion = region === 'All Regions' || t.region === region
      return matchSearch && matchCat && matchRegion
    })
    .sort((a,b) => {
      if (sortBy === 'match') return b.match - a.match
      if (sortBy === 'budget') return parseInt(b.budget.replace(/\D/g,'')) - parseInt(a.budget.replace(/\D/g,''))
      return 0
    })

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Tender Discovery</h1>
        <p className="text-sm text-slate-400 mt-1">Find procurement opportunities matched to your capabilities.</p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search tenders, facilities, products…" value={search} onChange={e=>setSearch(e.target.value)}
              className="input-field pl-10"/>
          </div>
          <select className="input-field lg:w-48" value={cat} onChange={e=>setCat(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="input-field lg:w-48" value={region} onChange={e=>setRegion(e.target.value)}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort:</span>
            {(['match','deadline','budget'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-all ${sortBy===s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>
                {s}
              </button>
            ))}
            <div className="flex items-center gap-1 ml-2">
              {(['list','grid'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`p-2 rounded-lg transition-all ${view===v ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {v === 'list' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{filtered.length} tenders found</p>
        <p className="text-xs text-slate-600">Sorted by: <span className="text-slate-400 capitalize">{sortBy}</span></p>
      </div>

      <div className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map(t => (
          <div key={t.id} className={`glass-card rounded-2xl card-hover group ${view==='list' ? 'flex items-center gap-4 p-4' : 'p-5'}`}>
            {/* Match Score */}
            <div className={`relative flex-shrink-0 ${view==='list' ? 'w-10 h-10' : 'w-12 h-12 mb-4'}`}>
              <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke={t.match>=90?'#10B981':t.match>=80?'#0B5FFF':'#F59E0B'} strokeWidth="5"
                  strokeDasharray={`${2*Math.PI*18}`} strokeDashoffset={`${2*Math.PI*18*(1-t.match/100)}`} strokeLinecap="round"/>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">{t.match}%</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-semibold text-white group-hover:text-emerald-300 transition-colors ${view==='list' ? 'text-sm' : 'text-sm'}`}>{t.title}</p>
                {t.urgent && <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[10px] font-bold border border-rose-500/20">HOT</span>}
              </div>
              <p className="text-xs text-slate-500 mb-2">{t.facility} · {t.region}</p>
              {view === 'grid' && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {[['Category',t.category],['Budget',t.budget],['Closes',t.deadline],['Bids',`${t.bids} so far`]].map(([k,v])=>(
                    <div key={k}><p className="text-slate-600">{k}</p><p className="font-medium text-slate-300">{v}</p></div>
                  ))}
                </div>
              )}
              {view === 'list' && (
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <span className="text-slate-500">{t.category}</span>
                  <span className="text-slate-400 font-semibold">{t.budget}</span>
                  <span className="text-amber-400">⏰ {t.deadline}</span>
                  <span className="text-slate-500">{t.bids} bids</span>
                </div>
              )}
            </div>

            <Link href={`/dashboard/supplier/tenders/${t.id}`}
              className={`flex-shrink-0 px-3 py-2 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/25 transition-all duration-200 ${view==='grid' ? 'w-full text-center mt-2' : ''}`}>
              View & Quote →
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">No tenders found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}
