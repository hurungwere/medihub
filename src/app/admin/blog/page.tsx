'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, X, BookOpen } from 'lucide-react'
import { getBlogPosts, addBlogPost, deleteBlogPost } from '@/app/actions/blog'

export default function AdminBlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: '',
    role: '',
    readTime: '5 min read',
    category: 'Industry Trends'
  })

  useEffect(() => {
    getBlogPosts().then(setPosts)
  }, [])

  const handlePostBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await addBlogPost(formData)
    if (res.success) {
      const updated = await getBlogPosts()
      setPosts(updated)
      setIsModalOpen(false)
      setFormData({
        title: '',
        excerpt: '',
        author: '',
        role: '',
        readTime: '5 min read',
        category: 'Industry Trends'
      })
    } else {
      alert(res.error || 'Failed to add article')
    }
    setSubmitting(false)
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    const res = await deleteBlogPost(id)
    if (res.success) {
      setPosts(posts.filter(p => p.id !== id))
    } else {
      alert(res.error || 'Failed to delete article')
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 min-h-screen bg-slate-950 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            📰 Procurement Blog Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">Write, publish, and delete insights and regulatory updates for users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg shadow-primary-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search articles by title, content, or author..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#4285F4] uppercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-2 py-0.5 rounded-full">{post.category}</span>
                <button 
                  onClick={() => handleDeleteBlog(post.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-white leading-snug group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>

            <div className="border-t border-slate-800/60 mt-4 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-[#4285F4] border border-slate-700">
                  {(post.author || 'A').split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-200 truncate">{post.author}</p>
                  <p className="text-[9px] text-slate-500 truncate">{post.role}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap bg-slate-950 px-2 py-1 rounded border border-slate-850">{post.readTime}</span>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-900 border border-slate-800/60 rounded-2xl">
            <p className="text-slate-500 text-sm">No articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">📰 Create Blog Article</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostBlog} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Article Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Navigating Healthcare Sourcing Trends" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Author Name</label>
                  <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="e.g. Dr. Alex Carter" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Author Role / Title</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Medical Director" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                    <option value="Industry Trends">Industry Trends</option>
                    <option value="Guides & Checklists">Guides & Checklists</option>
                    <option value="Platform News">Platform News</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Estimate Read Time</label>
                  <input required type="text" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} placeholder="e.g. 5 min read" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Excerpt / Short Description</label>
                <textarea required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={4} placeholder="Brief description summarizing the key message of the article..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary-500 resize-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold rounded-lg text-sm transition-colors">{submitting ? 'Publishing...' : 'Publish Article'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
