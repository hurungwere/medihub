'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Trash2, CheckCircle } from 'lucide-react'
import { getSupportInquiries, deleteSupportInquiry } from '@/app/actions/support'

export default function AdminSupportPage() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getSupportInquiries().then(setInquiries)
  }, [])

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    const res = await deleteSupportInquiry(id)
    if (res.success) {
      setInquiries(inquiries.filter(i => i.id !== id))
    } else {
      alert(res.error || 'Failed to delete inquiry')
    }
  }

  const handleResolveInquiry = (id: string) => {
    // Simple state-based resolution for administrative feedback
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'Resolved' } : i))
  }

  const filteredInquiries = inquiries.filter(i => 
    i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 min-h-screen bg-slate-950 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            ✉️ Contact Centre
          </h1>
          <p className="text-sm text-slate-400 mt-1">Review, follow up, and manage inbound messages from clients and clinic operators.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by sender, subject, or message..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-800/20 transition-colors text-slate-300 text-sm">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-white">{inq.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {inq.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">
                    {inq.subject}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={inq.message}>
                    {inq.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inq.status === 'Resolved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {inq.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Just now'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {inq.status !== 'Resolved' && (
                      <button 
                        onClick={() => handleResolveInquiry(inq.id)}
                        className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No support messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
