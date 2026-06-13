'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { CheckCircle2, Zap } from 'lucide-react'
import Link from 'next/link'
import { getSettings } from '@/app/actions/admin'

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

const clinicTiers = [
  {
    name: 'Basic',
    price: 'Free',
    desc: 'Perfect for small clinics getting started with digital procurement.',
    features: ['Post unlimited tenders', 'Basic supplier matching', 'Standard email support', 'Up to 3 user accounts'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    desc: 'For growing hospitals needing advanced analytics and integrations.',
    features: ['Everything in Basic', 'Advanced analytics dashboard', 'Priority 24/7 support', 'Unlimited user accounts', 'ERP integration access'],
    cta: 'Upgrade to Pro',
    popular: true
  }
]

const supplierTiers = [
  {
    name: 'Standard',
    price: '$149',
    period: '/mo',
    desc: 'Get your products in front of thousands of verified clinics.',
    features: ['Bid on up to 20 tenders/mo', 'Verified Supplier Badge', 'Basic profile analytics', 'Standard support'],
    cta: 'Start Selling',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Unlimited volume and dedicated account management for large distributors.',
    features: ['Unlimited tender bidding', 'Featured profile placement', 'Dedicated account manager', 'API access for automated bidding'],
    cta: 'Contact Sales',
    popular: true
  }
]

export default function PricingPage() {
  const [clinicProPrice, setClinicProPrice] = useState('$99')
  const [supplierStandardPrice, setSupplierStandardPrice] = useState('$149')

  useEffect(() => {
    async function loadPricing() {
      try {
        const settings = await getSettings()
        if (settings) {
          if (settings.clinicProPrice) setClinicProPrice(settings.clinicProPrice)
          if (settings.supplierStandardPrice) setSupplierStandardPrice(settings.supplierStandardPrice)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadPricing()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-bold tracking-wide uppercase mb-6">
            <Zap className="w-4 h-4" /> Transparent Pricing
          </motion.div>
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Simple pricing for <span className="text-primary-600">every</span> facility.
          </motion.h1>
          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-lg text-slate-600">
            Whether you are a small clinic or a global distributor, MediHub has a plan tailored to scale your procurement operations.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Clinics */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-slate-900">For Healthcare Providers</h2>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Buyers</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {clinicTiers.map((tier, i) => (
                  <motion.div key={tier.name} custom={i+3} initial="hidden" animate="visible" variants={fadeUp} className={`bg-white rounded-2xl p-8 border ${tier.popular ? 'border-primary-500 shadow-xl shadow-primary-500/10 ring-1 ring-primary-500 relative' : 'border-slate-200 shadow-sm'} flex flex-col hover:shadow-md transition-shadow`}>
                    {tier.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">Most Popular</div>}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                    <p className="text-sm text-slate-500 mb-6 min-h-[40px] leading-relaxed">{tier.desc}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-extrabold text-slate-900">
                        {tier.name === 'Pro' ? clinicProPrice : tier.price}
                      </span>
                      {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-primary-500' : 'text-slate-400'}`} />
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/register?type=clinic" className={`w-full py-3 rounded-xl font-bold text-center transition-all ${tier.popular ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                      {tier.cta}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Suppliers */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-slate-900">For Suppliers</h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">Sellers</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {supplierTiers.map((tier, i) => (
                  <motion.div key={tier.name} custom={i+5} initial="hidden" animate="visible" variants={fadeUp} className={`bg-white rounded-2xl p-8 border ${tier.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500 relative' : 'border-slate-200 shadow-sm'} flex flex-col hover:shadow-md transition-shadow`}>
                    {tier.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">Enterprise Choice</div>}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                    <p className="text-sm text-slate-500 mb-6 min-h-[40px] leading-relaxed">{tier.desc}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-extrabold text-slate-900">
                        {tier.name === 'Standard' ? supplierStandardPrice : tier.price}
                      </span>
                      {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={tier.name === 'Enterprise' ? '/contact' : '/auth/register?type=supplier'} className={`w-full py-3 rounded-xl font-bold text-center transition-all ${tier.popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                      {tier.cta}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Is there a contract or commitment?', a: 'No, all paid plans are strictly month-to-month. You can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.' },
              { q: 'Are there hidden transaction fees?', a: 'None. MediHub does not take a percentage of your procurement contracts. We strictly charge a flat monthly software access fee.' },
              { q: 'How does the verification process work for suppliers?', a: 'Upon registering, our compliance team reviews your business licenses, financial health, and industry certifications within 48 hours before granting the Verified Badge.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
