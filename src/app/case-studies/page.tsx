'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, TrendingDown, Clock, ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'

const caseStudies = [
  {
    hospital: 'Metro General Hospital',
    location: 'Chicago, IL',
    metric: '22% Cost Savings',
    stat: '18 Days to 48 Hours',
    statLabel: 'Procurement Time Reduction',
    title: 'Optimizing ICU Monitor Sourcing under Urgent Deadlines',
    desc: 'Metro General needed to upgrade 45 ICU monitors to comply with new federal standards. Using MediHub, they broadcasted the bid request to vetted equipment manufacturers, receiving 8 qualified bids within 24 hours.',
    tags: ['ICU Monitors', 'Equipment Upgrade', 'Budget Savings']
  },
  {
    hospital: 'Apex Surgical Clinic',
    location: 'Austin, TX',
    metric: '100% Compliance',
    stat: '0 Shortage Days',
    statLabel: 'Inventory Security Rate',
    title: 'Resolving Sterile Latex-Free Glove Shortages',
    desc: 'Faced with a sudden regional distributor failure, Apex Surgical used MediHub to source sterile consumables. Within hours, a verified state distributor matched their bid requirements, ensuring zero clinic downtime.',
    tags: ['Consumables', 'Emergency Sourcing', 'Verified Vendor']
  },
  {
    hospital: 'Northside Healthcare Network',
    location: 'New York, NY',
    metric: 'Unified Audit Trail',
    stat: '4,200+ Line Items',
    statLabel: 'Tracked & Audited Annually',
    title: 'Transitioning multi-facility sourcing from spreadsheets to MediHub',
    desc: 'Northside Network consolidated procurement across 12 outpatient clinics. By moving bids and compliance logs onto MediHub, they established a 100% transparent audit trail, eliminating double-sourcing errors.',
    tags: ['Enterprise Sourcing', 'Audit Trail', 'Process Automation']
  }
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4285F4]/20 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <section className="relative z-10 py-16 text-center max-w-4xl mx-auto px-6 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-3 py-1 rounded-full">Success Stories</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            Proven Sourcing Outcomes
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Read how verified medical facilities and certified suppliers utilize MediHub to save costs, automate compliance validation, and secure their medical supply chains.
          </p>
        </section>

        {/* Content list */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 space-y-8">
          {caseStudies.map((study, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-10 shadow-sm hover:shadow-md transition-shadow grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{study.hospital}</span>
                    <span>•</span>
                    <span>{study.location}</span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-950 hover:text-[#4285F4] transition-colors">{study.title}</h2>
                </div>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">{study.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center text-center space-y-4 h-full">
                <div className="space-y-1">
                  <span className="block text-2xl font-extrabold text-[#4285F4]">{study.metric}</span>
                  <span className="text-xs font-semibold uppercase text-slate-400">Primary Outcome</span>
                </div>
                <div className="border-t border-slate-200/60 pt-4 space-y-1">
                  <span className="block text-lg font-bold text-slate-800">{study.stat}</span>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">{study.statLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA section */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 text-white space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to streamline your medical sourcing?</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Join thousands of healthcare purchasers and certified medical manufacturers collaborating on MediHub.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/auth/register" className="px-6 py-3 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/marketplace" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors border border-slate-700">
                Browse Active Bids
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
