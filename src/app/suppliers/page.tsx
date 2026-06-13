import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, CheckCircle2, Factory, Truck, MapPin, Search } from 'lucide-react'

import { getSuppliers } from '@/app/actions/suppliers'

export const dynamic = 'force-dynamic'

export default async function SuppliersPage({ searchParams }: { searchParams: any }) {
  const params = await Promise.resolve(searchParams)
  const query = (params?.q || '') as string

  let suppliers = await getSuppliers()

  if (query) {
    const qLower = query.toLowerCase()
    suppliers = suppliers.filter((s: any) => 
      s.name?.toLowerCase().includes(qLower) || 
      s.type?.toLowerCase().includes(qLower) ||
      s.location?.toLowerCase().includes(qLower) ||
      (s.specialties && s.specialties.some((spec: string) => spec.toLowerCase().includes(qLower)))
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        <div className="bg-primary-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">Trusted Supplier Network</h1>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto mb-8">
              Discover, vet, and connect with thousands of pre-verified manufacturers and distributors across the globe.
            </p>
            <form action="/suppliers" className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                name="q"
                defaultValue={query}
                placeholder="Search by company name, product, or certification..." 
                className="w-full bg-white border-0 rounded-full py-4 pl-12 pr-28 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          {suppliers.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No suppliers found</h3>
              <p className="text-slate-500">We couldn't find any suppliers matching "{query}".</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
                    {supplier.name.substring(0, 2)}
                  </div>
                  {supplier.verified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{supplier.name}</h3>
                
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {supplier.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {supplier.type === 'Manufacturer' ? <Factory className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    {supplier.type}
                  </span>
                </div>

                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplier.specialties.map((spec: string) => (
                      <span key={spec} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-bold text-slate-700">{supplier.rating}</span>
                    <span className="text-xs text-slate-400">(120+ reviews)</span>
                  </div>
                  <button className="text-primary-600 font-medium text-sm hover:text-primary-700">View Profile</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 lg:p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Rigorous Verification Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Every supplier on MediHub undergoes a comprehensive 5-step verification process, including financial auditing, compliance checks (ISO, FDA, CE), and reference validation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Identity Verified</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Financial Health Check</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quality Certificates Validated</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
