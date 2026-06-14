'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { 
  Building2, Factory, ClipboardEdit, Search, 
  MessageSquare, FileCheck, ShieldCheck,
  LineChart, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <div className="bg-primary-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1 
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="text-4xl lg:text-6xl font-extrabold text-white mb-6"
            >
              How MediHub Works
            </motion.h1>
            <motion.p 
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-lg text-primary-200 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              The most transparent, efficient, and secure way to source medical supplies and equipment. We bridge the gap between healthcare facilities and top-tier suppliers.
            </motion.p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          
          {/* For Clinics Section */}
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-primary-600 shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">For Healthcare Facilities</h2>
                <p className="text-slate-500 text-lg mt-1">Streamline your procurement process from request to delivery.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <ClipboardEdit className="w-6 h-6" />, 
                  title: '1. Post a Bid Request', 
                  desc: 'Create a detailed request for medical supplies, pharmaceuticals, or equipment. Set your budget, requirements, and deadline.'
                },
                { 
                  icon: <MessageSquare className="w-6 h-6" />, 
                  title: '2. Receive & Compare Bids', 
                  desc: 'Verified suppliers are notified instantly. Review incoming quotes side-by-side using our intelligent dashboard.'
                },
                { 
                  icon: <FileCheck className="w-6 h-6" />, 
                  title: '3. Award & Procure', 
                  desc: 'Select the best offer. All communications and documentation are securely logged for compliance and auditing.'
                }
              ].map((step, i) => (
                <motion.div 
                  key={i} custom={i+2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* For Suppliers Section */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <Factory className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">For Suppliers & Manufacturers</h2>
                <p className="text-slate-500 text-lg mt-1">Access a continuous pipeline of high-quality sales opportunities.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <ShieldCheck className="w-6 h-6" />, 
                  title: '1. Get Verified', 
                  desc: 'Pass our standard compliance and quality checks to earn the "Verified Supplier" badge and build immediate trust.',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                { 
                  icon: <Search className="w-6 h-6" />, 
                  title: '2. Find Opportunities', 
                  desc: 'Browse active bids or let our matching algorithm notify you when requests align with your catalog and specialties.',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                { 
                  icon: <LineChart className="w-6 h-6" />, 
                  title: '3. Submit Quotes & Win', 
                  desc: 'Submit competitive bids directly through the platform. Track your win rates and manage contracts in one place.',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                }
              ].map((step, i) => (
                <motion.div 
                  key={i} custom={i+2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
        
        {/* Why Choose MediHub */}
        <div className="bg-slate-900 py-24 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl lg:text-4xl font-bold mb-16">Why Choose MediHub?</h2>
             <div className="grid md:grid-cols-3 gap-8 text-left">
               <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                 <ShieldCheck className="w-10 h-10 text-primary-400 mb-6" />
                 <h3 className="text-xl font-bold mb-3">100% Secure & Compliant</h3>
                 <p className="text-slate-400 leading-relaxed">Built from the ground up to meet stringent healthcare data security and procurement standards.</p>
               </div>
               <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                 <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-6" />
                 <h3 className="text-xl font-bold mb-3">Vetted Ecosystem</h3>
                 <p className="text-slate-400 leading-relaxed">Every participant is verified. We eliminate the noise so you only deal with legitimate businesses.</p>
               </div>
               <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                 <LineChart className="w-10 h-10 text-amber-400 mb-6" />
                 <h3 className="text-xl font-bold mb-3">Data-Driven Savings</h3>
                 <p className="text-slate-400 leading-relaxed">Leverage historical data and competitive bidding to significantly lower your supply chain overhead.</p>
               </div>
             </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to transform your procurement?</h2>
          <p className="text-lg text-slate-600 mb-10">Join thousands of healthcare professionals already using MediHub.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/register?type=clinic" className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto">
              I'm a Healthcare Provider
            </Link>
            <Link href="/auth/register?type=supplier" className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto">
              I'm a Supplier
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
