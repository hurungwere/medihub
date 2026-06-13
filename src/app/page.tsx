'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  ArrowRight, ShieldCheck, Activity,
  LineChart, ChevronRight, BriefcaseMedical, Building2, BadgeCheck,
  Stethoscope, Clock, FileText, CheckCircle2
} from 'lucide-react'

// ── Animations ───────────────────────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

// ── Components ───────────────────────────────────────────────────────────────
function LogoStrip() {
  return (
    <div className="w-full bg-white border-y border-slate-200 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-500 mb-8">Trusted by leading healthcare institutions</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale opacity-70 hover:opacity-100 transition-opacity duration-500">
          {['St. Jude Medical', 'Mayo Clinic', 'Mount Sinai', 'Kaiser Permanente', 'Cleveland Clinic'].map((logo, i) => (
            <div key={i} className="flex items-center gap-2 font-sans font-bold text-lg text-slate-600">
              <Building2 className="w-5 h-5 text-slate-400" />
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Track raw pixel coordinates for absolute positioning of glow orb
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      const { clientX, clientY } = e
      rawMouseX.set(clientX)
      rawMouseY.set(clientY)

      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 2
      const y = (clientY / innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }
  }

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 150, damping: 20 })

  // Smooth springs for the floating background orb
  const smoothX = useSpring(rawMouseX, { stiffness: 50, damping: 20 })
  const smoothY = useSpring(rawMouseY, { stiffness: 50, damping: 20 })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900" onMouseMove={handleMouseMove}>
      <Navbar />

      {/* Modern 3D Floating Cursor Glow */}
      <motion.div 
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-400/30 to-cyan-400/30 rounded-full blur-[80px] z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />

      <main className="relative pt-32 lg:pt-40 pb-20 overflow-hidden bg-white">
        {/* Soft Background Accent */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Hero Text */}
            <div className="flex-1 text-left">
              <motion.div 
                custom={0} initial="hidden" animate="visible" variants={fadeUp}
                className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-white border border-primary-100 shadow-sm shadow-primary-500/10 mb-8 relative group cursor-default"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-primary-50">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                </div>
                <span className="relative text-[11px] font-bold tracking-widest text-primary-700 uppercase">Secure Healthcare Procurement</span>
              </motion.div>

              <motion.h1 
                custom={1} initial="hidden" animate="visible" variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.15]"
              >
                Modern Procurement for{' '}
                <span className="text-primary-600">
                  Medical Excellence.
                </span>
              </motion.h1>

              <motion.p 
                custom={2} initial="hidden" animate="visible" variants={fadeUp}
                className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
              >
                Connect your facility with a verified network of medical suppliers. Streamline tenders, ensure HIPAA-compliant communication, and reduce supply chain costs securely.
              </motion.p>

              <motion.div 
                custom={3} initial="hidden" animate="visible" variants={fadeUp}
                className="w-full max-w-xl"
              >
                <form action="/marketplace" className="relative flex items-center shadow-sm hover:shadow-md transition-shadow rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <input 
                    type="text" 
                    name="q" 
                    className="block w-full pl-12 pr-32 py-4 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base outline-none transition-all" 
                    placeholder="Search tenders, medical supplies, equipment..." 
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                    Search
                  </button>
                </form>
                
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-500 mr-1">Popular:</span>
                  {['Surgical Gloves', 'MRI Scanners', 'Defibrillators'].map(tag => (
                    <Link key={tag} href={`/marketplace?q=${encodeURIComponent(tag)}`} className="text-slate-600 hover:text-primary-700 font-medium bg-slate-100 hover:bg-primary-50 px-2.5 py-1 rounded-md transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                custom={4} initial="hidden" animate="visible" variants={fadeUp}
                className="mt-8 flex items-center gap-4 text-sm text-slate-500"
              >
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Join over <strong>2,500+</strong> healthcare professionals.</p>
              </motion.div>
            </div>

            {/* Hero Visual (Clean Dashboard UI Mockup) */}
            <motion.div 
              custom={5} initial="hidden" animate="visible" variants={fadeUp}
              className="flex-1 w-full relative lg:block"
              style={{ perspective: 1500 }}
            >
              <motion.div 
                style={{ rotateX, rotateY }}
                className="relative rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary-500/10 overflow-hidden transform-gpu"
              >
                {/* Browser/App Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                  </div>
                  <div className="mx-auto flex-1 max-w-sm bg-white border border-slate-200 rounded-md py-1 px-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    app.medihub.com/dashboard
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Recent Tenders</h3>
                      <p className="text-sm text-slate-500">Manage your active procurement requests.</p>
                    </div>
                    <button className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-md">New Request</button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'TND-087', title: 'MRI Contrast Agents (Gadolinium)', dept: 'Radiology', bids: 12, status: 'Active' },
                      { id: 'TND-088', title: 'Surgical Gloves (Latex-Free)', dept: 'Surgery', bids: 45, status: 'Reviewing' },
                      { id: 'TND-089', title: 'Defibrillator Replacement Parts', dept: 'Cardiology', bids: 8, status: 'Awarded' }
                    ].map((item, idx) => (
                      <Link key={idx} href={`/marketplace/${item.id}`} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${idx === 2 ? 'bg-slate-200' : 'bg-white border border-slate-200 shadow-sm'}`}>
                            <FileText className={`w-5 h-5 ${idx === 2 ? 'text-slate-400' : 'text-primary-600'}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-slate-500">{item.dept}</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                            item.status === 'Reviewing' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-slate-500 font-medium group-hover:text-primary-600 transition-colors">{item.bids} Bids</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </main>

      <LogoStrip />

      {/* Clean Feature Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Healthcare Professionals</h2>
            <p className="text-lg text-slate-600">
              MediHub replaces outdated email chains and manual vendor vetting with a streamlined, secure, and fully auditable procurement workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Suppliers Only</h3>
              <p className="text-slate-600 leading-relaxed">
                Every supplier on MediHub undergoes rigorous credential checks, license verification, and financial review before they can bid on your tenders.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accelerated Sourcing</h3>
              <p className="text-slate-600 leading-relaxed">
                Reduce procurement cycles by weeks. Our intelligent matching algorithm instantly notifies capable suppliers the moment you post a requirement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Data-Driven Insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Easily compare quotes side-by-side. Access historical pricing data to ensure your facility always negotiates the best possible contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Testimonial */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <Stethoscope className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-10 leading-relaxed">
            "MediHub brought much-needed transparency to our supply chain. The ability to instantly compare vetted bids side-by-side has saved our clinic both critical time and significant budget overhead."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=sarah&backgroundColor=e2e8f0" alt="Dr. Sarah Mitchell" />
            </div>
            <div className="text-left">
              <p className="text-slate-900 font-bold">Dr. Sarah Mitchell, MD</p>
              <p className="text-slate-500 text-sm">Director of Operations, Metro Health Clinic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean CTA */}
      <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Modernize your procurement today.</h2>
          <p className="text-lg text-primary-200 mb-10 max-w-2xl mx-auto">
            Join the secure network trusted by thousands of healthcare professionals. Setup takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-900 hover:bg-slate-50 font-semibold rounded-lg transition-colors">
              Create Free Account
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors border border-primary-700">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
