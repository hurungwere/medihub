'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, MoreVertical, X, Upload } from 'lucide-react'
import { getTenders, addTender } from '@/app/actions/tenders'

const adminSections = [
  { icon:'📊', label:'Overview', href:'/admin', id:'overview' },
  { icon:'👥', label:'Users', href:'/admin/users', id:'users' },
  { icon:'🏭', label:'Suppliers', href:'/admin/suppliers', id:'suppliers' },
  { icon:'🏥', label:'Clinics', href:'/admin/clinics', id:'clinics' },
  { icon:'📋', label:'Bids', href:'/admin/tenders', id:'tenders' },
  { icon:'🏷️', label:'Categories', href:'/admin/categories', id:'categories' },
  { icon:'🛡️', label:'Verification', href:'/admin/verification', id:'verification' },
  { icon:'📈', label:'Reports', href:'/admin/reports', id:'reports' },
  { icon:'⚙️', label:'Settings', href:'/admin/settings', id:'settings' },
]

export default function AdminTendersPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    facility: '',
    category: 'Pharmaceuticals',
    quantity: '',
    budget: '',
    deadline: '',
    description: ''
  })

  // Data State
  const [tenders, setTenders] = useState<any[]>([])

  useEffect(() => {
    getTenders().then(setTenders)
  }, [])

  const handlePostTender = async (e: React.FormEvent) => {
    e.preventDefault()
    const newTender = {
      id: `TND-0${Math.floor(Math.random() * 1000) + 100}`,
      title: formData.title,
      facility: formData.facility,
      category: formData.category,
      status: 'Active',
      bids: 0,
      deadline: formData.deadline,
      quantity: formData.quantity,
      budget: formData.budget
    }
    
    const res = await addTender(newTender)
    if (res.success) {
      setTenders([newTender, ...tenders])
      setIsModalOpen(false)
      setFormData({ title: '', facility: '', category: 'Pharmaceuticals', quantity: '', budget: '', deadline: '', description: '' })
    }
  }

  return (
    <>
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-white">Bid Management</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Post Bid
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search bids by ID or title..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Tenders Table */}
          <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">Bid ID</th>
                    <th className="px-6 py-4">Title & Facility</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Bids</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tenders.map((tender) => (
                    <tr key={tender.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-primary-400">{tender.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-200">{tender.title}</p>
                        <p className="text-xs text-slate-500">{tender.facility}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{tender.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          tender.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          tender.status === 'Reviewing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {tender.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-300">{tender.bids}</td>
                      <td className="px-6 py-4 text-slate-400">{tender.deadline}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

      {/* Post Tender Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Post New Bid</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePostTender} className="p-6 overflow-y-auto space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Bid Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="e.g. MRI Contrast Agents" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Facility / Clinic Name</label>
                  <input required value={formData.facility} onChange={e => setFormData({...formData, facility: e.target.value})} type="text" placeholder="e.g. Metro Health Clinic" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                    <option>Pharmaceuticals</option>
                    <option>Medical Equipment</option>
                    <option>Consumables</option>
                    <option>Lab Supplies</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Quantity</label>
                  <input required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} type="text" placeholder="e.g. 500 units" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Est. Budget (Optional)</label>
                  <input value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} type="text" placeholder="e.g. $25,000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Deadline</label>
                  <input required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} type="date" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Detailed Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Include specifications, compliance requirements..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none" />
                </div>

                {/* File Upload Mock */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Attachments</label>
                  <div className="w-full border-2 border-dashed border-slate-800 hover:border-primary-500/50 transition-colors rounded-lg flex flex-col items-center justify-center py-6 gap-2 cursor-pointer bg-slate-950/50">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <p className="text-sm text-slate-400">Click to upload RFQ documents or specs</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Post Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
