'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, X } from 'lucide-react'
import { getCaseStudies, addCaseStudy, deleteCaseStudy } from '@/app/actions/case-studies'

export default function AdminCaseStudiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studies, setStudies] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    hospital: '',
    location: '',
    metric: '',
    stat: '',
    statLabel: '',
    title: '',
    desc: '',
    tags: ''
  })

  useEffect(() => {
    getCaseStudies().then(setStudies)
  }, [])

  const handlePostStudy = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await addCaseStudy(formData)
    if (res.success) {
      // Reload studies
      const updated = await getCaseStudies()
      setStudies(updated)
      setIsModalOpen(false)
      setFormData({
        hospital: '',
        location: '',
        metric: '',
        stat: '',
        statLabel: '',
        title: '',
        desc: '',
        tags: ''
      })
    } else {
      alert(res.error || 'Failed to add case study')
    }
    setSubmitting(false)
  }

  const handleDeleteStudy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return
    const res = await deleteCaseStudy(id)
    if (res.success) {
      setStudies(studies.filter(s => s.id !== id))
    } else {
      alert(res.error || 'Failed to delete case study')
    }
  }

  const filteredStudies = studies.filter(s => 
    s.hospital?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 min-h-screen bg-slate-950 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            📝 Case Studies Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">Publish and manage client success stories displayed on the marketing site.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-primary-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Case Study
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by hospital, title or content..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudies.map((study) => (
          <div key={study.id} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#4285F4] uppercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-2 py-0.5 rounded-full">{study.id}</span>
                <button 
                  onClick={() => handleDeleteStudy(study.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xs text-slate-400 font-semibold">{study.hospital} — <span className="text-[11px] text-slate-500">{study.location}</span></h3>
                <h2 className="text-base font-bold text-white mt-1 group-hover:text-primary-400 transition-colors line-clamp-2">{study.title}</h2>
              </div>

              <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed">{study.desc}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(Array.isArray(study.tags) ? study.tags : (study.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)).map((tag: string) => (
                  <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-950 border border-slate-800/60 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800/60 mt-4 pt-4 grid grid-cols-2 gap-2 text-center bg-slate-950/30 rounded-xl p-2">
              <div>
                <span className="block text-sm font-extrabold text-[#4285F4]">{study.metric}</span>
                <span className="text-[9px] uppercase text-slate-500 font-semibold">Outcome</span>
              </div>
              <div className="border-l border-slate-800/60">
                <span className="block text-sm font-extrabold text-slate-300">{study.stat}</span>
                <span className="text-[9px] uppercase text-slate-500 font-semibold">{study.statLabel || 'Metric'}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredStudies.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-900 border border-slate-800/60 rounded-2xl">
            <p className="text-slate-500 text-sm">No case studies found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Study Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">📝 Add New Case Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostStudy} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Hospital / Facility Name</label>
                  <input required type="text" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} placeholder="Metro General Hospital" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Chicago, IL" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Metric</label>
                  <input required type="text" value={formData.metric} onChange={e => setFormData({...formData, metric: e.target.value})} placeholder="22% Cost Savings" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Secondary Stat</label>
                  <input required type="text" value={formData.stat} onChange={e => setFormData({...formData, stat: e.target.value})} placeholder="18 Days to 48 Hours" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Stat Label</label>
                  <input required type="text" value={formData.statLabel} onChange={e => setFormData({...formData, statLabel: e.target.value})} placeholder="Time Reduction" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Case Study Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Optimizing ICU Monitor Sourcing under Urgent Deadlines" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description / Narrative</label>
                <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={4} placeholder="Detailed story of the sourcing challenge and outcome..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tags (Comma-separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="ICU Monitors, Equipment, Savings" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold rounded-lg text-sm transition-colors">{submitting ? 'Publishing...' : 'Publish Case Study'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
