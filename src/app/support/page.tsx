'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { HelpCircle, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'How do I get my hospital or clinic verified?',
    answer: 'Submit your healthcare license, registration credentials, and billing verification info in your account Settings. Our compliance operations team reviews submissions within 24 hours, awarding the Verified Facility badge.'
  },
  {
    question: 'How does the bid matching engine work?',
    answer: 'When a clinic posts a bid request, our system cross-checks the product category, quantities, and location requirements against the catalog details of all verified suppliers. Matching suppliers are instantly notified.'
  },
  {
    question: 'Are there fees for using the basic marketplace?',
    answer: 'No. Posting basic bid requests and submitting quotes is free. We offer premium subscription plans for advanced analytics, API integrations, and higher volume billing features.'
  },
  {
    question: 'How does MediHub handle contract validation?',
    answer: 'Once a clinic accepts a supplier’s quote, our platform auto-generates digital contracts with audit-ready checksums. Safe escrow payments can be configured through our partnered payment gateways.'
  }
]

export default function SupportPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4285F4]/20 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Header */}
        <section className="relative z-10 py-16 text-center max-w-4xl mx-auto px-6 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase bg-[#4285F4]/10 border border-[#4285F4]/20 px-3 py-1 rounded-full">Help & Support</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers to common questions about verification, matching rules, and contract validation, or contact our support team.
          </p>
        </section>

        {/* Contact cards */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 grid sm:grid-cols-2 gap-6 pb-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="w-10 h-10 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center text-[#4285F4] flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-950">Email Support</h3>
              <p className="text-xs text-slate-500">Expect a response within 4 hours from our operations desk.</p>
              <a href="mailto:support@medihub.org" className="block text-sm font-semibold text-[#4285F4] hover:underline pt-1">support@medihub.org</a>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="w-10 h-10 rounded-lg bg-[#34A853]/10 border border-[#34A853]/20 flex items-center justify-center text-[#34A853] flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-950">System Status</h3>
              <p className="text-xs text-slate-500">Continuous uptime monitoring and API status reports.</p>
              <div className="flex items-center gap-1.5 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-600">All systems fully operational</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="text-left pb-4 border-b border-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-bold text-slate-950">Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 text-left">
                    <button 
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-[#4285F4] transition-colors py-2"
                    >
                      <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <p className="text-slate-600 text-sm leading-relaxed mt-2 pl-1 pr-6 animate-fadeIn">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
