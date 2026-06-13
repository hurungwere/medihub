'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, ShieldCheck, Activity, Globe, Zap,
  LineChart, ChevronRight, BriefcaseMedical, Building2, BadgeCheck,
  Stethoscope, Clock, FileText, CheckCircle2, Sparkles, Download, Play, Pause, Cpu
} from 'lucide-react'

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

    // Mouse position tracking
    let mouse = { x: width * 0.15, y: height * 0.75 }
    let vortex = { x: width * 0.15, y: height * 0.75 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Particle definition
    class Particle {
      x: number = 0
      y: number = 0
      color: string = ''
      size: number = 0
      angle: number = 0
      speed: number = 0
      radius: number = 0
      opacity: number = 0
      maxRadius: number = 0

      constructor() {
        this.reset(true)
      }

      reset(init = false) {
        this.angle = Math.random() * Math.PI * 2
        this.maxRadius = Math.random() * Math.max(width, height) * 0.45 + 100
        this.radius = init ? Math.random() * this.maxRadius : Math.random() * 25
        this.speed = (Math.random() * 0.0035 + 0.001) * (Math.random() > 0.5 ? 1 : -1)
        this.x = vortex.x + Math.cos(this.angle) * this.radius
        this.y = vortex.y + Math.sin(this.angle) * this.radius
        this.size = Math.random() * 2.5 + 1.2
        this.opacity = Math.random() * 0.45 + 0.25

        // Antigravity Google Colors (Blue, Red, Yellow, Green, Purple, Orange)
        const colors = [
          'rgba(66, 133, 244, opacity)',  // Blue
          'rgba(234, 67, 53, opacity)',   // Red
          'rgba(251, 188, 5, opacity)',   // Yellow
          'rgba(52, 168, 83, opacity)',   // Green
          'rgba(168, 85, 247, opacity)',  // Purple
          'rgba(249, 115, 22, opacity)',  // Orange
        ]
        const colorPattern = colors[Math.floor(Math.random() * colors.length)]
        this.color = colorPattern.replace('opacity', this.opacity.toString())
      }

      update() {
        this.angle += this.speed
        this.radius += 0.48 // slowly expand outward from cursor
        if (this.radius > this.maxRadius) {
          this.reset(false)
        }
        this.x = vortex.x + Math.cos(this.angle) * this.radius
        this.y = vortex.y + Math.sin(this.angle) * this.radius
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const particleCount = 180
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Interpolate vortex center to mouse position smoothly
      vortex.x += (mouse.x - vortex.x) * 0.075
      vortex.y += (mouse.y - vortex.y) * 0.075

      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  )
}

export default function HomePage() {
  const [demoPlaying, setDemoPlaying] = useState(true)

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans selection:bg-[#4285F4]/20 overflow-x-hidden relative">
      
      {/* ── Custom Antigravity Style Header ────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9fa]/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#4285F4]">M</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-[#FBBC05]">d</span>
                <span className="text-[#4285F4]">i</span>
                <span className="text-[#34A853]">H</span>
                <span className="text-[#EA4335]">u</span>
                <span className="text-[#4285F4]">b</span>
              </span>
              <span className="text-slate-500 font-semibold text-sm">Procurement</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {['Products', 'Use Cases', 'Pricing', 'Blog', 'Resources'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Pricing' ? '/pricing' : '/how-it-works'} 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-colors shadow-sm"
            >
              Get Started <Download className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Particle Canvas */}
      <ParticleCanvas />

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <header className="relative pt-44 pb-32 z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
        
        {/* Antigravity Logo Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm cursor-default">
          <span className="text-sm font-bold tracking-tight">
            <span className="text-[#4285F4]">M</span>
            <span className="text-[#EA4335]">e</span>
            <span className="text-[#FBBC05]">d</span>
            <span className="text-[#4285F4]">i</span>
            <span className="text-[#34A853]">H</span>
            <span className="text-[#EA4335]">u</span>
            <span className="text-[#4285F4]">b</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-500">Procurement</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold text-[#1f1f1f] tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Experience liftoff with the next-gen agent platform
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Google Antigravity is our agentic development platform, allowing anyone to build in the agent-first era. Now customized for medical supply chains and secure tenders.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-colors shadow-md text-base"
          >
            Get Started Free
          </Link>
          <Link 
            href="/marketplace" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full border border-slate-200 transition-colors shadow-sm text-base"
          >
            Explore marketplace
          </Link>
        </div>
      </header>

      {/* ── Agent Interactive Demo Mockup ────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4285F4]">Agent Controlled Browser</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <button 
              onClick={() => setDemoPlaying(!demoPlaying)}
              className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-sm transition-colors text-slate-700"
            >
              {demoPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-amber-500 fill-amber-500" /> Pause Demo
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" /> Resume Demo
                </>
              )}
            </button>
          </div>

          {/* Browser body */}
          <div className="p-8 bg-slate-900 text-slate-300 font-mono text-sm space-y-4 min-h-[320px] relative">
            {demoPlaying ? (
              <div className="space-y-3">
                <p className="text-slate-500">&gt; Initializing agent runner session...</p>
                <p className="text-slate-400">&gt; Connecting to workspace: `/home/cyberuser/Documents/atromed`</p>
                <p className="text-[#34A853] font-semibold">&gt; Checking active local database (data.json)... OK</p>
                <p className="text-[#4285F4]">&gt; Fetching tenders matching category: "Pharmaceuticals"</p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-white">TND-087: MRI Contrast Agents</span>
                    <span className="px-2 py-0.5 rounded bg-[#34A853]/10 border border-[#34A853]/30 text-[#34A853] text-[10px] font-bold">Active</span>
                  </div>
                  <p className="text-xs text-slate-400">Department: Radiology | Quantity: 500 units | Bids: 12</p>
                </div>
                <p className="text-slate-500">&gt; Syncing dashboard state... done.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] text-slate-500 font-sans">
                Demo paused. Click Resume to run the physics and live log feed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Product Features Grid ─────────────────────────────────────────────── */}
      <section className="relative z-10 bg-white border-y border-slate-200 py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f1f] tracking-tight">The developer platform built for trust</h2>
            <p className="text-slate-600 text-lg">
              Delegate complex supply chain actions, check credentials authenticity, and run secure API queries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'MediHub Dashboard 2.0',
                desc: 'Your command center to manage multiple active medical tenders, view accredited suppliers, and configure pricing models side-by-side.',
                badge: 'Desktop App'
              },
              {
                title: 'MediHub CLI',
                desc: 'The lightweight, fast, terminal-first interface to work with procurement agents. Query catalogs and post requirements right from your shell.',
                badge: 'Terminal'
              },
              {
                title: 'MediHub SDK',
                desc: 'Prototype custom workflows leveraging MediHub API with minimal code. Simple Python scripts to query suppliers and synchronize inventory.',
                badge: 'API & Core'
              }
            ].map((prod) => (
              <div key={prod.title} className="bg-[#f8f9fa] border border-slate-200/80 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <Cpu className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      {prod.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{prod.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{prod.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center">
                  <Link href="/how-it-works" className="text-xs font-bold text-[#4285F4] hover:underline flex items-center gap-1">
                    Read documentation <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers (Antigravity Style) ─────────────────────────────────── */}
      <section className="relative z-10 py-28 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f1f] tracking-tight">Flexible tiers for any scale</h2>
          <p className="text-slate-600 text-lg">Choose the perfect plan for your hospital group or supplier company.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">For Developers & Clinics</h3>
                <p className="text-sm text-slate-500 mt-1">Achieve new heights at no charge.</p>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                {['Single workspace integration', 'Up to 3 active tenders', 'Standard supplier verification', 'Access to Web & CLI interfaces'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link 
              href="/auth/register" 
              className="w-full inline-flex items-center justify-center py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Start Sourcing
            </Link>
          </div>

          {/* Org Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-slate-300 transition-colors relative">
            <div className="absolute -top-3 right-6 bg-[#4285F4] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
              Featured
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">For Organizations</h3>
                <p className="text-sm text-slate-500 mt-1">Level up your entire team.</p>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                {['Unlimited active tenders', 'Global supplier matching SDK', 'Enterprise HIPAA compliance audit logs', 'Dedicated support representative'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4285F4]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link 
              href="/pricing" 
              className="w-full inline-flex items-center justify-center py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors shadow-sm"
            >
              View Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* ── Massive Stylized Brand Footer (Antigravity Style) ────────────────── */}
      <footer className="relative z-10 bg-white border-t border-slate-200 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">About</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">About Us</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Careers</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Products</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/marketplace" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Marketplace</Link></li>
                <li><Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Pricing Plans</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">API Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Help Center</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Contact Sales</Link></li>
              </ul>
            </div>
          </div>

          {/* Giga Brand Heading */}
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-[52px] sm:text-[92px] font-black tracking-tighter text-slate-200 select-none leading-none">
              MediHub
            </h2>
            <div className="text-xs font-semibold text-slate-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} MediHub. Powered by Google Antigravity.</p>
              <p className="mt-1 text-slate-400">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
