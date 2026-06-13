'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, X, MapPin, ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react'
import { getClinics, addClinic, updateClinic, deleteClinic } from '@/app/actions/admin'

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedClinic, setSelectedClinic] = useState<any>(null)
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    location: '',
    tendersCount: 0,
    status: 'Verified'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    const data = await getClinics()
    setClinics(data)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setForm({ name: '', location: '', tendersCount: 0, status: 'Verified' })
    setError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (clinic: any) => {
    setModalMode('edit')
    setSelectedClinic(clinic)
    setForm({
      name: clinic.name || '',
      location: clinic.location || '',
      tendersCount: clinic.tendersCount || 0,
      status: clinic.status || 'Verified'
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name: form.name,
      location: form.location,
      tendersCount: Number(form.tendersCount) || 0,
      status: form.status
    }

    try {
      if (modalMode === 'add') {
        const res = await addClinic(payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchClinics()
        } else {
          setError(res.error || 'Failed to add clinic')
        }
      } else {
        const res = await updateClinic(selectedClinic.id, payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchClinics()
        } else {
          setError(res.error || 'Failed to update clinic')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this clinic?')) {
      const res = await deleteClinic(id)
      if (res.success) {
        fetchClinics()
      } else {
        alert(res.error || 'Failed to delete clinic')
      }
    }
  }

  const toggleStatus = async (clinic: any) => {
    const nextStatus = clinic.status === 'Verified' ? 'Pending' : 'Verified'
    const payload = {
      ...clinic,
      status: nextStatus
    }
    const res = await updateClinic(clinic.id, payload)
    if (res.success) {
      fetchClinics()
    } else {
      alert(res.error || 'Failed to update status')
    }
  }

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = 
      clinic.name?.toLowerCase().includes(search.toLowerCase()) ||
      clinic.location?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || clinic.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <title>Clinic Directory - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Clinic Directory</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">CLINICS</span>
        </div>
        <button onClick={handleOpenAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Clinic
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Healthcare Facilities</h2>
          <p className="text-sm text-slate-400 mt-1">Manage partner hospitals, local clinics, and private pharmacies.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by hospital name or city..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg py-2.5 px-3 focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Verification States</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>
        </div>

        {/* Clinics Table */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Facility Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Active Tenders</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClinics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No clinics found.</td>
                  </tr>
                ) : (
                  filteredClinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">#{clinic.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-200">{clinic.name}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {clinic.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <ClipboardList className="w-4 h-4 text-primary-400" />
                          <span className="font-semibold">{clinic.tendersCount || 0}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {clinic.joinedDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(clinic)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                            clinic.status === 'Verified' 
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25' 
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25'
                          }`}
                        >
                          {clinic.status === 'Verified' ? (
                            <><CheckCircle2 className="w-3 h-3" /> Verified</>
                          ) : (
                            <><AlertCircle className="w-3 h-3" /> Pending</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(clinic)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(clinic.id)} className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
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
              <h2 className="text-lg font-bold text-white">{modalMode === 'add' ? 'Add New Clinic' : 'Edit Clinic'}</h2>
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facility Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. Saint Judes Hospital" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} type="text" placeholder="e.g. New York, USA" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tenders Posted</label>
                <input value={form.tendersCount} onChange={e => setForm({...form, tendersCount: Number(e.target.value)})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  {loading ? 'Processing...' : modalMode === 'add' ? 'Create Clinic' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
