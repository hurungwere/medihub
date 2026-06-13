'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { 
  Heart, Users, ShieldCheck, Award, Sparkles, 
  Target, Globe, CheckCircle2, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-20">
        {/* Hero Banner */}
        <div className="bg-primary-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-800/60 border border-primary-700/40 text-primary-200 text-xs font-semibold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-300" />
              Empowering Healthcare Procurement
            </motion.div>
            <motion.h1 
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight"
            >
              About MediHub
            </motion.h1>
            <motion.p 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-lg lg:text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed"
            >
              We are on a mission to modernize and secure medical supply chains. By connecting verified healthcare providers directly with accredited manufacturers and distributors, we help deliver better patient care at a lower cost.
            </motion.p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Active Facilities', value: '250+', sub: 'Hospitals & Clinics', color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Accredited Suppliers', value: '180+', sub: 'Vetted Brands', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Tenders Completed', value: '$12M+', sub: 'Procured Value', color: 'text-cyan-600', bg: 'bg-cyan-50' },
              { label: 'Cycle Reduction', value: '74%', sub: 'Faster Delivery', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg ${stat.bg} ${stat.color} text-xs font-bold mb-3`}>
                  {stat.label}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Vision & Mission */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Redefining How Healthcare Providers Source Supplies</h2>
              <p className="text-slate-600 leading-relaxed">
                Traditional healthcare procurement is bogged down by manual administration, fragmented communication, and opaque pricing systems. MediHub was founded to replace this outdated model with a modern, automated platform.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our technology enables clinics to post detailed procurement criteria, receive transparent bids in real-time, evaluate regulatory documents automatically, and trace supply contracts end-to-end.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md">
                  See How It Works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
              className="grid gap-6"
            >
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To eliminate inefficiencies and inflated costs in medical distribution, making essential clinical products accessible, traceable, and affordable.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                  To build a globally interconnected, digital-first healthcare supply chain that responds instantly to clinical requirements and public health needs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-slate-950 py-24 mt-28 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Our Core Values</h2>
              <p className="text-slate-400 mt-3">The principles guiding every action we take to build trust in global healthcare.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-10 h-10 text-primary-400" />,
                  title: 'Uncompromising Trust',
                  desc: 'Every clinic and supplier is verified. We enforce high standards of transparency, credentials authentication, and performance tracking.'
                },
                {
                  icon: <Heart className="w-10 h-10 text-rose-400" />,
                  title: 'Patient-First Focus',
                  desc: 'We remember that behind every syringe, monitor, or medicine box is a patient. Getting supplies where they need to go saves lives.'
                },
                {
                  icon: <Award className="w-10 h-10 text-amber-400" />,
                  title: 'Operational Excellence',
                  desc: 'We strive for continuous improvement in tools, analytics, and service. Eliminating delay is our daily pursuit.'
                }
              ].map((value, idx) => (
                <div key={value.title} className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300">
                  <div className="mb-6">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Join the Future of Medical Procurement</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">Create a free account today and discover how MediHub can optimize your healthcare supply operations.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto">
              Get Started Now
            </Link>
            <Link href="/marketplace" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto">
              Explore Tenders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
