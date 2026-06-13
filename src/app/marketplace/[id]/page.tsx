import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, ArrowLeft, Clock, FileText, Building2, DollarSign, Lock } from 'lucide-react'
import Link from 'next/link'
import { getTenders } from '@/app/actions/tenders'

export default async function TenderDetailsPage({ params }: { params: { id: string } }) {
  const tenders = await getTenders()
  const tender = tenders.find((t: any) => t.id === params.id) || tenders[0] // fallback if not found

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">{tender?.status || 'Active'}</span>
                <span className="text-sm text-slate-500 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary-500" /> Verified Facility</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-500 font-medium uppercase">Tender ID</span>
                <p className="font-mono text-slate-900">{params.id}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">{tender?.title || 'Tender Details'}</h1>
            <p className="text-lg text-slate-600 mb-8 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" /> {tender?.facility || 'Unknown Facility'}
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div>
                <span className="flex items-center gap-2 text-sm text-slate-500 font-medium uppercase mb-1">
                  <DollarSign className="w-4 h-4" /> Est. Budget
                </span>
                <p className="text-lg font-semibold text-slate-900">{tender?.budget || 'Confidential'}</p>
              </div>
              <div>
                <span className="flex items-center gap-2 text-sm text-slate-500 font-medium uppercase mb-1">
                  <FileText className="w-4 h-4" /> Quantity
                </span>
                <p className="text-lg font-semibold text-slate-900">{tender?.quantity || 'See Documents'}</p>
              </div>
              <div>
                <span className="flex items-center gap-2 text-sm text-slate-500 font-medium uppercase mb-1">
                  <Clock className="w-4 h-4" /> Deadline
                </span>
                <p className="text-lg font-semibold text-amber-600">{tender?.deadline || 'Rolling'}</p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-8 text-center">
              <Lock className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Login to View Full Documents</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">Full technical specifications, facility contact details, and the bidding portal are locked for verified users only.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/login" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                  Login to Bid
                </Link>
                <Link href="/auth/register" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors">
                  Register as Supplier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
