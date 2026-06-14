'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, ClipboardList, CheckCircle2, XCircle } from 'lucide-react'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/app/actions/admin'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    tendersCount: 0,
    status: 'Active'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setForm({ name: '', description: '', tendersCount: 0, status: 'Active' })
    setError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: any) => {
    setModalMode('edit')
    setSelectedCategory(cat)
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      tendersCount: cat.tendersCount || 0,
      status: cat.status || 'Active'
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
      description: form.description,
      tendersCount: Number(form.tendersCount) || 0,
      status: form.status
    }

    try {
      if (modalMode === 'add') {
        const res = await addCategory(payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchCategories()
        } else {
          setError(res.error || 'Failed to add category')
        }
      } else {
        const res = await updateCategory(selectedCategory.id, payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchCategories()
        } else {
          setError(res.error || 'Failed to update category')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const res = await deleteCategory(id)
      if (res.success) {
        fetchCategories()
      } else {
        alert(res.error || 'Failed to delete category')
      }
    }
  }

  const toggleStatus = async (cat: any) => {
    const nextStatus = cat.status === 'Active' ? 'Inactive' : 'Active'
    const payload = {
      ...cat,
      status: nextStatus
    }
    const res = await updateCategory(cat.id, payload)
    if (res.success) {
      fetchCategories()
    } else {
      alert(res.error || 'Failed to update status')
    }
  }

  const filteredCategories = categories.filter(cat => {
    return cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <>
      <title>Procurement Categories - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Procurement Categories</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">CATEGORIES</span>
        </div>
        <button onClick={handleOpenAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Marketplace Categories</h2>
          <p className="text-sm text-slate-400 mt-1">Structure classifications and trace matching bids.</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900 border border-slate-800/60 rounded-xl">No categories found.</div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="glass-card rounded-2xl p-5 border border-slate-800/60 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white leading-tight">{cat.name}</h3>
                    <button 
                      onClick={() => toggleStatus(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 transition-colors ${
                        cat.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {cat.status === 'Active' ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium min-h-[40px] line-clamp-2 mb-4">{cat.description || 'No description provided.'}</p>
                </div>
                
                <div className="border-t border-slate-800/60 pt-4 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ClipboardList className="w-3.5 h-3.5 text-primary-400" />
                    <span><strong className="text-slate-200">{cat.tendersCount || 0}</strong> bids</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(cat)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</h2>
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. Laboratory Diagnostics" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the category classification..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Associated Bids Count</label>
                <input value={form.tendersCount} onChange={e => setForm({...form, tendersCount: Number(e.target.value)})} type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  {loading ? 'Processing...' : modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
