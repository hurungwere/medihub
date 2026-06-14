'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, ShieldCheck, Activity, Globe, Zap,
  LineChart, ChevronRight, BriefcaseMedical, Building2, BadgeCheck,
  Stethoscope, Clock, FileText, CheckCircle2, Sparkles, Download
} from 'lucide-react'
import { getCategories } from '@/app/actions/admin'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ── Interactive Particle Canvas Background ────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Mouse & Touch position tracking
    let mouse = { x: width * 0.15, y: height * 0.75 }
    let vortex = { x: width * 0.15, y: height * 0.75 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    // Particle definition using robust POJO
    const particleCount = 180
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const maxRadius = Math.random() * Math.max(width, height) * 0.45 + 100
      const radius = Math.random() * maxRadius
      const speed = (Math.random() * 0.0035 + 0.001) * (Math.random() > 0.5 ? 1 : -1)
      const size = Math.random() * 2.5 + 1.2
      const opacity = Math.random() * 0.45 + 0.25
      
      const colors = [
        'rgba(66, 133, 244, opacity)',  // Blue
        'rgba(234, 67, 53, opacity)',   // Red
        'rgba(251, 188, 5, opacity)',   // Yellow
        'rgba(52, 168, 83, opacity)',   // Green
        'rgba(168, 85, 247, opacity)',  // Purple
        'rgba(249, 115, 22, opacity)',  // Orange
      ]
      const colorPattern = colors[Math.floor(Math.random() * colors.length)]
      const color = colorPattern.replace('opacity', opacity.toString())

      return {
        angle,
        maxRadius,
        radius,
        speed,
        size,
        opacity,
        color,
        x: vortex.x + Math.cos(angle) * radius,
        y: vortex.y + Math.sin(angle) * radius
      }
    })

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Interpolate vortex center to mouse position smoothly
      vortex.x += (mouse.x - vortex.x) * 0.075
      vortex.y += (mouse.y - vortex.y) * 0.075

      particles.forEach((p) => {
        p.angle += p.speed
        p.radius += 0.48 // slowly expand outward from cursor
        if (p.radius > p.maxRadius) {
          p.angle = Math.random() * Math.PI * 2
          p.maxRadius = Math.random() * Math.max(width, height) * 0.45 + 100
          p.radius = Math.random() * 25
          p.speed = (Math.random() * 0.0035 + 0.001) * (Math.random() > 0.5 ? 1 : -1)
          p.size = Math.random() * 2.5 + 1.2
          p.opacity = Math.random() * 0.45 + 0.25
          
          const colors = [
            'rgba(66, 133, 244, opacity)',  // Blue
            'rgba(234, 67, 53, opacity)',   // Red
            'rgba(251, 188, 5, opacity)',   // Yellow
            'rgba(52, 168, 83, opacity)',   // Green
            'rgba(168, 85, 247, opacity)',  // Purple
            'rgba(249, 115, 22, opacity)',  // Orange
          ]
          const colorPattern = colors[Math.floor(Math.random() * colors.length)]
          p.color = colorPattern.replace('opacity', p.opacity.toString())
        }

        p.x = vortex.x + Math.cos(p.angle) * p.radius
        p.y = vortex.y + Math.sin(p.angle) * p.radius

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  )
}

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'clinic' | 'supplier'>('clinic')
  const [typedGreeting, setTypedGreeting] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let username = ''
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        username = u.name || u.email || ''
      }
    } catch (e) {}
    
    const fullText = username 
      ? `Welcome back, ${username}! Ready to secure your sourcing?` 
      : 'Hello! Welcome to MediHub Sourcing.'

    let current = ''
    let index = 0
    let timeoutId: any

    const tick = () => {
      if (index < fullText.length) {
        current += fullText[index]
        setTypedGreeting(current)
        index++
        timeoutId = setTimeout(tick, 50)
      }
    }
    
    setTypedGreeting('')
    timeoutId = setTimeout(tick, 100)
    
    return () => clearTimeout(timeoutId)
  }, [mounted])

  useEffect(() => {
    async function load() {
      try {
        const cats = await getCategories()
        if (cats && cats.length > 0) {
          setCategories(cats.filter((c: any) => c.status === 'Active').slice(0, 6))
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const defaultCategories = [
    { name: 'Pharmaceuticals', description: 'Medicines, vaccines, and chemical agents', tendersCount: 12 },
    { name: 'Medical Equipment', description: 'MRI, ICU monitors, and diagnostic machinery', tendersCount: 8 },
    { name: 'Consumables', description: 'Gloves, masks, syringes, and daily disposables', tendersCount: 15 },
    { name: 'Lab Supplies', description: 'Reagents, test tubes, microscopes, and pipettes', tendersCount: 4 },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1f1f1f] font-sans selection:bg-[#4285F4]/20 overflow-x-hidden relative">
      
      {/* ── Global Header ────────────────────────────────────── */}
      <Navbar />

      {/* Particle Canvas background */}
      <ParticleCanvas />

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <header className="relative pt-44 pb-24 z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
        
        {/* Antigravity Logo Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-500 min-h-[16px] inline-block">
            {typedGreeting}
            <span className="animate-pulse ml-0.5 font-bold">|</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold text-[#1f1f1f] tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Modern Procurement for Medical Excellence
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Connect your medical facility with a verified network of qualified suppliers. Streamline bidding processes, ensure secure sourcing, and lower supply chain overhead.
        </p>

        {/* Search Bar / Input */}
        <div className="w-full max-w-2xl mx-auto pt-4">
          <form action="/marketplace" className="relative flex items-center bg-white border border-slate-200 rounded-full p-2 focus-within:border-[#4285F4]/70 shadow-lg transition-all">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              name="q" 
              className="block w-full pl-12 pr-32 py-3 text-slate-900 bg-transparent outline-none placeholder:text-slate-400 text-base rounded-full" 
              placeholder="Search medical supplies, equipment, drugs..." 
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-colors shadow-sm">
              Search
            </button>
          </form>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Search:</span>
            {['Surgical Gloves', 'MRI Systems', 'Defibrillators'].map(tag => (
              <Link key={tag} href={`/marketplace?q=${encodeURIComponent(tag)}`} className="text-slate-600 hover:text-slate-900 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── Live Sourcing Dashboard Preview ────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4285F4]">Active Sourcing Feed</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">Live Matches</span>
          </div>

          <div className="p-6 space-y-3 bg-slate-900">
            {[
              { id: 'TND-087', title: 'MRI Contrast Agents (Gadolinium)', dept: 'Radiology', bids: 12, status: 'Active', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5', query: 'MRI' },
              { id: 'TND-088', title: 'Surgical Gloves (Latex-Free)', dept: 'Surgery', bids: 45, status: 'Reviewing', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5', query: 'Gloves' },
              { id: 'TND-089', title: 'Defibrillator Replacement Parts', dept: 'Cardiology', bids: 8, status: 'Awarded', color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5', query: 'Defibrillator' }
            ].map((item, idx) => (
              <Link 
                key={idx} 
                href={`/marketplace?q=${encodeURIComponent(item.query)}`} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-[#4285F4]/40 hover:bg-slate-900/30 transition-all font-sans text-slate-300 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[#4285F4] group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-[#4285F4] transition-colors">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.dept}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${item.color}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.bids} Bids</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Banner / Logostrip ─────────────────────────────────────────── */}
      <section className="bg-white/40 backdrop-blur-sm border-y border-slate-200/60 py-10 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">Trusted by leading healthcare institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {['St. Jude Medical', 'Mayo Clinic', 'Mount Sinai', 'Kaiser Permanente', 'Cleveland Clinic'].map((logo, i) => (
              <div key={i} className="flex items-center gap-2 font-sans font-bold text-sm text-slate-500">
                <Building2 className="w-4 h-4 text-slate-400" />
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sourcing Markets Bento Grid ──────────────────────────────────────── */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 text-xs font-bold text-[#4285F4]">
            <Zap className="w-3.5 h-3.5" /> Direct Sourcing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f1f] tracking-tight">Active Sourcing Markets</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Explore demand-driven healthcare procurement categories. Real-time listing updates synchronized across our platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-350 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-[#f8f9fa] px-2.5 py-1 rounded-lg border border-slate-200">
                    {cat.tendersCount || 0} active bids
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4285F4] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <Link href={`/marketplace?q=${encodeURIComponent(cat.name)}`} className="text-xs font-bold text-[#4285F4] group-hover:text-[#4285F4]/80 flex items-center gap-0.5">
                  Explore Market <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-white/40 backdrop-blur-sm border-y border-slate-200/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase">Accredited Network</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f1f] tracking-tight">Built for Healthcare Standards</h2>
            <p className="text-slate-600 text-base">
              MediHub replaces email logs and outdated spreadsheets with a unified, auditable procurement solution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Vetted Suppliers Only',
                desc: 'Rigorous verification checks (compliance history, medical license credentials, and financial audits) on all active vendors.',
                color: 'text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20'
              },
              {
                title: 'Accelerated Sourcing',
                desc: 'Automate notifications to specific catalog distributors. Cut procurement cycles from weeks down to hours.',
                color: 'text-[#34A853] bg-[#34A853]/10 border-[#34A853]/20'
              },
              {
                title: 'Side-by-Side Comparison',
                desc: 'Instantly view and sort incoming quotes by cost, timeline, and compliance. Leverage historical metrics to secure optimal rates.',
                color: 'text-[#FBBC05] bg-[#FBBC05]/10 border-[#FBBC05]/20'
              }
            ].map((feat) => (
              <div key={feat.title} className="bg-[#f8f9fa] border border-slate-200/80 p-8 rounded-2xl hover:shadow-sm transition-shadow space-y-6 text-left">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Workspace Tabs ──────────────────────────────────────── */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase">Seamless Operations</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f1f] tracking-tight">Interactive Platform Roles</h2>
          <p className="text-slate-600 text-base">Explore how clinics and suppliers achieve efficiency within our centralized ecosystem.</p>
          
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-full mt-6 shadow-sm">
            <button 
              onClick={() => setActiveTab('clinic')}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'clinic' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
            >
              For Clinics & Hospitals
            </button>
            <button 
              onClick={() => setActiveTab('supplier')}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'supplier' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
            >
              For Vetted Suppliers
            </button>
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-md border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-sm text-left">
          {activeTab === 'clinic' ? (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">Simplify Healthcare Sourcing from Request to Audit</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Draft customizable bid requests with specific certification criteria, medical product parameters, and deadline boundaries. Review dozens of bids in a structured format, communicate securely with vendors, and track delivery compliance logs.
                </p>
                <ul className="space-y-3 text-sm text-slate-600">
                  {[
                    'Create single-item or bundle-item requests',
                    'Strict access control—only verified suppliers can bid',
                    'Comprehensive logging of communications for legal and compliance auditing',
                    'Direct link with local billing and storage management workflows'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-colors shadow-sm">
                    Sign Up as Hospital <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 bg-slate-950">
                <img 
                  src="/hospital_dashboard.png" 
                  alt="Hospital Sourcing Dashboard" 
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">Access a Constant Pipeline of Verified Opportunities</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Skip cold calling and long sales cycles. Our algorithm automatically alerts your distribution teams when clinics request products matching your listed specialties, locations, or inventory.
                </p>
                <ul className="space-y-3 text-sm text-slate-600">
                  {[
                    'Receive automated match notifications based on your catalog specialties',
                    'Submit structured quotes directly to hospital decision-makers',
                    'Build verified credit records and performance scores',
                    'Secure digital contract signatures and escrow validation'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#4285F4] flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-colors shadow-sm">
                    Register as Supplier <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg group hover:shadow-xl transition-all duration-300 bg-slate-950">
                <img 
                  src="/supplier_dashboard.png" 
                  alt="Supplier Console Dashboard" 
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 bg-white/40 backdrop-blur-sm border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center text-[#4285F4]">
              <Stethoscope className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-700 leading-relaxed italic">
            "MediHub brought much-needed transparency and speed to our medical sourcing operations. The ability to review and evaluate credentialed bids side-by-side saved our surgery centers both critical budget overhead and time."
          </h3>
          <div className="flex items-center justify-center gap-4.5 pt-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=sarah&backgroundColor=f8f9fa" alt="Dr. Sarah Mitchell" className="w-full h-full object-cover" />
            </div>
            <div className="text-left ml-4">
              <p className="text-slate-900 font-extrabold text-sm sm:text-base">Dr. Sarah Mitchell, MD</p>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">Director of Sourcing, City General Hospital</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action ───────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 bg-slate-900 text-white text-center space-y-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-850 via-slate-900 to-slate-900 pointer-events-none opacity-80" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Streamline Your Medical Supply Chain?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join the secure network trusted by healthcare buyers and certified suppliers. Setup takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/auth/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-bold rounded-full transition-colors shadow-lg">
              Create Free Account
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-full transition-colors border border-slate-700">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Standard Footer ────────────────────────────────────── */}
      <Footer />

    </div>
  )
}
