'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getCategories } from '@/app/actions/admin'

const allTenders = [
  { id: 'TND-001', title: 'Surgical Gloves — Latex Free', category: 'Consumables', bids: 7, status: 'Open', deadline: '2026-06-14', budget: '$8,200', created: '2026-06-01', priority: 'High' },
  { id: 'TND-002', title: 'MRI Contrast Agent', category: 'Pharmaceuticals', bids: 4, status: 'Open', deadline: '2026-06-17', budget: '$24,500', created: '2026-06-02', priority: 'High' },
  { id: 'TND-003', title: 'ICU Patient Monitor', category: 'Equipment', bids: 9, status: 'Evaluating', deadline: '2026-06-10', budget: '$96,000', created: '2026-05-28', priority: 'Critical' },
  { id: 'TND-004', title: 'IV Catheters — Short', category: 'Consumables', bids: 11, status: 'Awarded', deadline: '2026-06-05', budget: '$5,600', created: '2026-05-20', priority: 'Medium' },
  { id: 'TND-005', title: 'Ultrasound Machine — Portable', category: 'Equipment', bids: 3, status: 'Open', deadline: '2026-06-23', budget: '$45,000', created: '2026-06-03', priority: 'High' },
  { id: 'TND-006', title: 'Disposable Syringes 5ml', category: 'Consumables', bids: 14, status: 'Awarded', deadline: '2026-06-01', budget: '$3,200', created: '2026-05-15', priority: 'Low' },
  { id: 'TND-007', title: 'ECG Machine 12-Lead', category: 'Equipment', bids: 6, status: 'Closed', deadline: '2026-05-30', budget: '$18,700', created: '2026-05-10', priority: 'Medium' },
  { id: 'TND-008', title: 'N95 Respirator Masks', category: 'Consumables', bids: 0, status: 'Open', deadline: '2026-06-28', budget: '$12,000', created: '2026-06-05', priority: 'Critical' },
  { id: 'TND-009', title: 'Anaesthetic Agents Bundle', category: 'Pharmaceuticals', bids: 2, status: 'Open', deadline: '2026-06-20', budget: '$67,000', created: '2026-06-04', priority: 'High' },
  { id: 'TND-010', title: 'Blood Glucose Meters x50', category: 'Equipment', bids: 5, status: 'Evaluating', deadline: '2026-06-12', budget: '$9,800', created: '2026-05-29', priority: 'Medium' },
  { id: 'TND-011', title: 'Sterilization Pouches', category: 'Consumables', bids: 8, status: 'Closed', deadline: '2026-05-25', budget: '$4,100', created: '2026-05-12', priority: 'Low' },
  { id: 'TND-012', title: 'Oxygen Concentrators x5', category: 'Equipment', bids: 1, status: 'Open', deadline: '2026-07-01', budget: '$38,500', created: '2026-06-06', priority: 'High' },
]

const statusColors: Record<string, string> = {
  Open: 'bg-primary-500/15 text-primary-400 border-primary-500/25',
  Evaluating: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Awarded: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Closed: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
}

const priorityColors: Record<string, string> = {
  Critical: 'text-rose-400',
  High: 'text-orange-400',
  Medium: 'text-amber-400',
  Low: 'text-slate-500',
}

const priorityDots: Record<string, string> = {
  Critical: 'bg-rose-400',
  High: 'bg-orange-400',
  Medium: 'bg-amber-400',
  Low: 'bg-slate-500',
}

const statuses = ['All', 'Open', 'Evaluating', 'Awarded', 'Closed']

type SortField = 'id' | 'title' | 'bids' | 'deadline' | 'budget' | 'created'

export default function TendersPage() {
  const [categories, setCategories] = useState<string[]>(['All', 'Consumables', 'Pharmaceuticals', 'Equipment'])

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories()
        if (data && data.length > 0) {
          setCategories(['All', ...data.map((c: any) => c.name)])
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadCats()
  }, [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = allTenders.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || t.status === statusFilter
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
    result = [...result].sort((a, b) => {
      let aVal: string | number = a[sortField]
      let bVal: string | number = b[sortField]
      if (sortField === 'budget') {
        aVal = parseFloat(a.budget.replace(/[$,]/g, ''))
        bVal = parseFloat(b.budget.replace(/[$,]/g, ''))
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [search, statusFilter, categoryFilter, sortField, sortDir])

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const toggleAll = () =>
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(t => t.id))

  const summaryStats = {
    total: allTenders.length,
    open: allTenders.filter(t => t.status === 'Open').length,
    evaluating: allTenders.filter(t => t.status === 'Evaluating').length,
    totalBudget: allTenders.reduce((sum, t) => sum + parseFloat(t.budget.replace(/[$,]/g, '')), 0),
  }

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className={`ml-1 opacity-40 ${sortField === field ? 'opacity-100' : ''}`}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">My Bids</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track all your procurement requests.</p>
        </div>
        <Link
          href="/dashboard/clinic/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:-translate-y-0.5 flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          New Bid
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bids', value: summaryStats.total, sub: 'All time', color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Open', value: summaryStats.open, sub: 'Accepting bids', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Evaluating', value: summaryStats.evaluating, sub: 'Under review', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total Budget', value: `$${(summaryStats.totalBudget / 1000).toFixed(0)}K`, sub: 'Committed value', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 card-hover">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} mb-3`}>
              <div className={`w-2 h-2 rounded-full ${s.color.replace('text-', 'bg-')}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
            <p className="text-xs font-medium text-slate-400">{s.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="tender-search"
              type="text"
              placeholder="Search by title or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1.5 bg-slate-800/60 rounded-xl p-1 flex-wrap">
            {statuses.map(s => (
              <button key={s} id={`filter-status-${s.toLowerCase()}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${statusFilter === s ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-primary-500/10 border border-primary-500/25 rounded-2xl px-5 py-3">
          <span className="text-sm font-semibold text-primary-400">{selectedIds.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-lg hover:bg-amber-500/25 transition-colors">
              Close Selected
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25 rounded-lg hover:bg-rose-500/25 transition-colors">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-semibold text-white">All Bids</h3>
            <p className="text-xs text-slate-500 mt-0.5">{filtered.length} of {allTenders.length} results</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-2xl mb-4">📋</div>
            <p className="text-sm font-semibold text-slate-300 mb-1">No bids found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/40">
                  <th className="px-5 py-3 text-left">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 checked:bg-primary-500 focus:ring-primary-500/40 cursor-pointer"
                    />
                  </th>
                  {([
                    { label: 'ID', field: 'id' },
                    { label: 'Title', field: 'title' },
                    { label: 'Category', field: null },
                    { label: 'Priority', field: null },
                    { label: 'Bids', field: 'bids' },
                    { label: 'Status', field: null },
                    { label: 'Deadline', field: 'deadline' },
                    { label: 'Budget', field: 'budget' },
                    { label: '', field: null },
                  ] as { label: string; field: SortField | null }[]).map(col => (
                    <th key={col.label}
                      onClick={() => col.field && toggleSort(col.field)}
                      className={`text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap select-none ${col.field ? 'cursor-pointer hover:text-slate-300 transition-colors' : ''}`}
                    >
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        id={`select-${t.id}`}
                        checked={selectedIds.includes(t.id)}
                        onChange={() => toggleSelect(t.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 checked:bg-primary-500 focus:ring-primary-500/40 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{t.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-200 max-w-[220px] truncate">{t.title}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{t.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityColors[t.priority]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[t.priority]}`} />
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                        {t.bids > 0
                          ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{t.bids}</>
                          : <span className="text-slate-600">—</span>
                        }
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{t.deadline}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-300">{t.budget}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <Link
                          href={`/dashboard/clinic/tenders/${t.id}`}
                          id={`view-${t.id}`}
                          className="text-xs text-primary-400 hover:text-primary-300 font-medium whitespace-nowrap"
                        >
                          View →
                        </Link>
                        {t.status === 'Open' && (
                          <Link
                            href="/dashboard/clinic/bids"
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap"
                          >
                            Bids
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800/60 bg-slate-900/30 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filtered.length} bid{filtered.length !== 1 ? 's' : ''}</p>
          <Link href="/dashboard/clinic/create" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
            + Post new bid
          </Link>
        </div>
      </div>
    </div>
  )
}
