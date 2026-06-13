'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src="/logo/medihub-logo-fullcolor.svg" alt="MediHub Logo" className="h-12 lg:h-14 w-auto transition-all" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className={`w-5 h-0.5 bg-slate-600 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-slate-600 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-slate-600 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden bg-white border-b border-slate-200 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 mt-2 flex flex-col gap-3">
            <Link href="/auth/login" className="px-4 py-3 text-base font-medium text-slate-700 hover:text-primary-700 text-center rounded-lg hover:bg-slate-50 transition-colors">Sign In</Link>
            <Link href="/auth/register" className="px-4 py-3 text-base font-medium bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
