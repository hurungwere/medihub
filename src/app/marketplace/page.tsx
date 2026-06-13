import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Filter, ShieldCheck, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { getTenders } from '@/app/actions/tenders'

export const dynamic = 'force-dynamic'

export default async function MarketplacePage({ searchParams }: { searchParams: any }) {
  const params = await Promise.resolve(searchParams)
  const query = (params?.q || '') as string

  let tenders = await getTenders()
  
  if (query) {
    const qLower = query.toLowerCase()
    tenders = tenders.filter((t: any) => 
      t.title?.toLowerCase().includes(qLower) || 
      t.facility?.toLowerCase().includes(qLower) ||
      t.category?.toLowerCase().includes(qLower)
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Active Tenders & Requests</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse real-time procurement requests from verified hospitals and clinics. Filter by category, budget, or urgency.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Filters */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-28 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold">
                  <Filter className="w-5 h-5" />
                  Filters
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                    <div className="space-y-2">
                      {['Pharmaceuticals', 'Medical Equipment', 'Consumables', 'Lab Supplies', 'Surgical Tools'].map(c => (
                        <label key={c} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                          <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        Open for Bidding
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        Reviewing
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4">
              <form action="/marketplace" className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="Search tenders by keyword, facility, or ID..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                />
              </form>
              
              {tenders.length === 0 && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                  <p className="text-slate-500">No tenders found matching "{query}".</p>
                </div>
              )}

              {tenders.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">{item.status || 'Open'}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary-500" /> Verified Facility</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{item.facility}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase">Quantity</span>
                        <span className="font-semibold text-slate-700">{item.quantity || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase">Est. Budget</span>
                        <span className="font-semibold text-slate-700">{item.budget || 'Hidden'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase">Deadline</span>
                        <span className="font-semibold text-amber-600">{item.deadline || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-3 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <div className="text-center sm:text-right w-full">
                      <span className="block text-2xl font-bold text-slate-900">{item.bids}</span>
                      <span className="text-xs text-slate-500 font-medium uppercase">Active Bids</span>
                    </div>
                    <Link href={`/marketplace/${item.id || 'tender-123'}`} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}

              <div className="text-center pt-8">
                <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors text-sm">Load More Tenders</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
