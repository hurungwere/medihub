'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getBlogPosts } from '@/app/actions/blog'

const defaultBlogPosts = [
  {
    id: 'BLOG-001',
    title: 'Modernizing Hospital Sourcing: Moving Beyond Spreadsheets',
    excerpt: 'How automated matching engines and digital bids eliminate human error, secure historical audits, and speed up hospital inventory replenishment cycles.',
    author: 'Dr. Sarah Jenkins',
    role: 'Chief Medical Officer',
    date: 'June 12, 2026',
    readTime: '5 min read',
    category: 'Industry Trends'
  },
  {
    id: 'BLOG-002',
    title: 'Navigating Medical Device Shortages: A Sourcing Checklist',
    excerpt: 'An actionable compliance-focused guide for clinic administrators when sourcing high-demand ICU consumables, surgical gloves, and emergency parts.',
    author: 'Michael Vance',
    role: 'Supply Chain Analyst',
    date: 'May 28, 2026',
    readTime: '7 min read',
    category: 'Guides & Checklists'
  },
  {
    id: 'BLOG-003',
    title: 'Understanding Verification Standards for Healthcare Suppliers',
    excerpt: 'An inside look at MediHub’s verification process: how we audit compliance histories, medical certificates, and financial audits for a secure marketplace.',
    author: 'Elena Rostova',
    role: 'VP of Compliance',
    date: 'May 15, 2026',
    readTime: '4 min read',
    category: 'Platform News'
  }
]

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPosts().then((data) => {
      if (data && data.length > 0) {
        setPosts(data)
      } else {
        setPosts(defaultBlogPosts)
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4285F4]/20 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <section className="relative z-10 py-16 text-center max-w-4xl mx-auto px-6 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-3 py-1 rounded-full">Procurement Blog</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            MediHub Insights
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay up to date with the latest industry news, expert sourcing guides, regulatory compliance updates, and digital supply chain best practices.
          </p>
        </section>

        {/* Post Grid */}
        <section className="relative z-10 max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">Loading insights...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <article key={post.id || idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left group">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[#4285F4] bg-[#4285F4]/5 border border-[#4285F4]/15 px-2.5 py-1 rounded-lg">
                      {post.category}
                    </span>
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-slate-950 group-hover:text-[#4285F4] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {(post.author || 'A').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{post.author}</p>
                        <p className="text-[10px] text-slate-400">{post.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 text-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl lg:text-2xl font-extrabold text-slate-950">Subscribe to our newsletter</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              Get monthly roundups of high-quality procurement tips, market changes, and verified supplier lists.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input required type="email" placeholder="Enter your business email" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500" />
              <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
