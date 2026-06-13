'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, X, Star, MapPin, Tag, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getSuppliers, addSupplier } from '@/app/actions/suppliers'
import { updateSupplier, deleteSupplier } from '@/app/actions/admin'

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    type: 'Distributor',
    location: '',
    rating: '5.0',
    specialties: '',
    verified: true
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    const data = await getSuppliers()
    setSuppliers(data)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setForm({ name: '', type: 'Distributor', location: '', rating: '5.0', specialties: '', verified: true })
    setError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (sup: any) => {
    setModalMode('edit')
    setSelectedSupplier(sup)
    setForm({
      name: sup.name || '',
      type: sup.type || 'Distributor',
      location: sup.location || '',
      rating: String(sup.rating || '5.0'),
      specialties: Array.isArray(sup.specialties) ? sup.specialties.join(', ') : sup.specialties || '',
      verified: sup.verified ?? true
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const specialtiesArray = form.specialties
      ? form.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []

    const payload = {
      name: form.name,
      type: form.type,
      location: form.location,
      rating: parseFloat(form.rating) || 5.0,
      specialties: specialtiesArray,
      verified: form.verified
    }

    try {
      if (modalMode === 'add') {
        const res = await addSupplier(payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchSuppliers()
        } else {
          setError(res.error || 'Failed to add supplier')
        }
      } else {
        const res = await updateSupplier(selectedSupplier.id, payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchSuppliers()
        } else {
          setError(res.error || 'Failed to update supplier')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      const res = await deleteSupplier(id)
      if (res.success) {
        fetchSuppliers()
      } else {
        alert(res.error || 'Failed to delete supplier')
      }
    }
  }

  const toggleVerification = async (sup: any) => {
    const nextVerified = !sup.verified
    const payload = {
      ...sup,
      verified: nextVerified
    }
    const res = await updateSupplier(sup.id, payload)
    if (res.success) {
      fetchSuppliers()
    } else {
      alert(res.error || 'Failed to update verification status')
    }
  }

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = 
      sup.name?.toLowerCase().includes(search.toLowerCase()) ||
      sup.location?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(sup.specialties) && sup.specialties.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
    
    const matchesType = filterType === 'all' || sup.type === filterType
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'verified' && sup.verified) || 
      (filterStatus === 'unverified' && !sup.verified)

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <>
      <title>Supplier Directory - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Supplier Directory</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">SUPPLIERS</span>
        </div>
        <button onClick={handleOpenAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Supplier Partnerships</h2>
          <p className="text-sm text-slate-400 mt-1">Manage global medical vendors, distributors and manufacturers.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, location, specialties..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select 
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg py-2.5 px-3 focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg py-2.5 px-3 focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Supplier Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Specialties</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No suppliers found.</td>
                  </tr>
                ) : (
                  filteredSuppliers.map((sup) => (
                    <tr key={sup.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">#{sup.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-200">{sup.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {sup.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-xs border border-slate-700/60">{sup.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{sup.rating || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {Array.isArray(sup.specialties) ? (
                            sup.specialties.map((spec: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">{spec}</span>
                            ))
                          ) : (
                            <span className="text-xs">{sup.specialties || 'N/A'}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleVerification(sup)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                            sup.verified 
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25' 
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25'
                          }`}
                        >
                          {sup.verified ? (
                            <><CheckCircle2 className="w-3 h-3" /> Verified</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3" /> Unverified</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(sup)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(sup.id)} className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modalMode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Supplier Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. Apex Medical Supply" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} type="text" placeholder="e.g. Frankfurt, Germany" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialties (Comma Separated)</label>
                <input value={form.specialties} onChange={e => setForm({...form, specialties: e.target.value})} type="text" placeholder="e.g. PPE, Cold Chain, Vaccines" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</label>
                <input value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} type="number" step="0.1" min="1" max="5" placeholder="5.0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input id="verified" type="checkbox" checked={form.verified} onChange={e => setForm({...form, verified: e.target.checked})} className="rounded bg-slate-950 border-slate-800 text-primary-500 focus:ring-primary-500" />
                <label htmlFor="verified" className="text-sm text-slate-300">Mark as Verified Supplier</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  {loading ? 'Processing...' : modalMode === 'add' ? 'Create Supplier' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
