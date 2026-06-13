'use client'

import { useState, useEffect } from 'react'
import { Check, X, ShieldAlert, FileText, Search, ShieldCheck } from 'lucide-react'
import { getVerifications, updateVerification } from '@/app/actions/admin'

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchVerifications()
  }, [])

  const fetchVerifications = async () => {
    const data = await getVerifications()
    setVerifications(data)
  }

  const handleAction = async (id: number, status: 'Approved' | 'Declined') => {
    if (confirm(`Are you sure you want to mark this request as ${status}?`)) {
      const res = await updateVerification(id, status)
      if (res.success) {
        fetchVerifications()
      } else {
        alert(res.error || 'Failed to update verification status')
      }
    }
  }

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || v.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <>
      <title>Trust & Verification - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Trust & Verification</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">VERIFICATION</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Pending Credentials Review</h2>
          <p className="text-sm text-slate-400 mt-1">Audit certifications, compliance documentation, and risk profile ratings.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by supplier or facility name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg py-2.5 px-3 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Organization Types</option>
            <option value="Supplier">Supplier / Vendor</option>
            <option value="Clinic">Clinic / Pharmacy</option>
          </select>
        </div>

        {/* Verifications List */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Requester Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4">Risk Profile</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVerifications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No verification requests found.</td>
                  </tr>
                ) : (
                  filteredVerifications.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-emerald-500/10 flex items-center justify-center text-lg">
                            {v.type === 'Supplier' ? '🏭' : '🏥'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{v.name}</p>
                            <p className="text-xs text-slate-500">Request #{v.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-xs border border-slate-700/60">{v.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-300 hover:text-primary-400 cursor-pointer">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>{v.docs || 0} PDF files</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border flex items-center gap-1 w-fit ${
                          v.risk === 'Low' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {v.risk} Risk
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {v.submitted || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          v.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          v.status === 'Declined' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {v.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleAction(v.id, 'Approved')} 
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-bold rounded-lg border border-emerald-500/20 transition-all duration-200 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button 
                              onClick={() => handleAction(v.id, 'Declined')} 
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold rounded-lg border border-rose-500/20 transition-all duration-200 flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 flex items-center justify-end gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
