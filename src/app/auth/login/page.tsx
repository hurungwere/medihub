'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { registerUser, loginUser } from '@/app/actions/auth'

function AuthForm() {
  const params = useSearchParams()
  const type = params.get('type') as 'clinic'|'supplier'|null
  const [mode, setMode] = useState<'login'|'register'|'forgot'>('login')
  const [orgType, setOrgType] = useState<'clinic'|'supplier'>(type || 'clinic')
  const [form, setForm] = useState({ email:'', password:'', name:'', org:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (mode === 'register') {
        const res = await registerUser({ ...form, orgType })
        if (res.success) {
          window.location.href = orgType === 'clinic' ? '/dashboard/clinic' : '/dashboard/supplier'
        } else {
          setError(res.error || 'Registration failed')
        }
      } else if (mode === 'login') {
        const res = await loginUser({ email: form.email, password: form.password })
        if (res.success && res.user) {
          const userOrgType = res.user.orgType || orgType
          if (userOrgType === 'admin') {
            window.location.href = '/admin'
          } else {
            window.location.href = userOrgType === 'clinic' ? '/dashboard/clinic' : '/dashboard/supplier'
          }
        } else {
          setError(res.error || 'Login failed')
        }
      } else {
        // Forgot password simulation
        setTimeout(() => setLoading(false), 1500)
        return
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center px-4 py-16">
      {/* Orbs */}
      <div className="orb w-80 h-80 bg-primary-500/10 -top-20 -left-20 fixed" />
      <div className="orb w-64 h-64 bg-emerald-500/8 -bottom-10 -right-10 fixed" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center group">
            <img src="/logo/medihub-logo-reversed.svg" alt="MediHub Logo" className="h-14 w-auto" />
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-slate-800/60 p-1 mb-6">
              {(['login','register'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${mode===m ? 'bg-primary-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">
              {mode==='login' ? 'Welcome back' : mode==='register' ? 'Create your account' : 'Reset password'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode==='login' ? 'Sign in to your MediHub account' : mode==='register' ? 'Join the healthcare procurement network' : "We'll send you a reset link"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Account Type (Register only) */}
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(['clinic','supplier'] as const).map(t => (
                  <button key={t} onClick={() => setOrgType(t)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${orgType===t ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/40'}`}>
                    <div className="text-xl mb-2">{t==='clinic' ? '🏥' : '🏭'}</div>
                    <p className={`text-sm font-semibold capitalize ${orgType===t ? 'text-primary-400' : 'text-slate-300'}`}>{t}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t==='clinic' ? 'Hospital, clinic, pharmacy' : 'Distributor, vendor'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <input type="text" required placeholder="Dr. Sarah Mitchell" value={form.name}
                    onChange={e => setForm({...form, name:e.target.value})}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Organization Name</label>
                  <input type="text" required placeholder={orgType==='clinic' ? 'Northgate Hospital' : 'MedSupply Co.'} value={form.org}
                    onChange={e => setForm({...form, org:e.target.value})}
                    className="input-field" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <input type="email" required placeholder="you@hospital.com" value={form.email}
                onChange={e => setForm({...form, email:e.target.value})}
                className="input-field" />
            </div>
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  {mode==='login' && (
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</button>
                  )}
                </div>
                <input type="password" required placeholder="••••••••" value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  className="input-field" />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</>
              ) : mode==='login' ? 'Sign In' : mode==='register' ? 'Create Account' : 'Send Reset Link'}
            </button>
            {mode === 'login' && (
              <button 
                type="button" 
                onClick={async () => {
                  setForm({ ...form, email: 'admin@medihub.com', password: 'admin123' })
                  setLoading(true)
                  setError('')
                  try {
                    const res = await loginUser({ email: 'admin@medihub.com', password: 'admin123' })
                    if (res.success && res.user) {
                      window.location.href = '/admin'
                    } else {
                      setError(res.error || 'Admin login failed')
                    }
                  } catch {
                    setError('An unexpected error occurred')
                  } finally {
                    setLoading(false)
                  }
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all duration-200 border border-slate-800/80 flex items-center justify-center gap-2"
              >
                🛡️ Sign In as Administrator
              </button>
            )}
          </form>

          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="w-full mt-4 text-sm text-slate-400 hover:text-slate-200 transition-colors">
              ← Back to Sign In
            </button>
          )}

          {mode !== 'forgot' && (
            <p className="text-center text-xs text-slate-500 mt-6">
              {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode==='login'?'register':'login')} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                {mode==='login' ? 'Register free' : 'Sign In'}
              </button>
            </p>
          )}

          <p className="text-center text-xs text-slate-600 mt-4">
            By continuing, you agree to MediHub's{' '}
            <Link href="/terms" className="text-slate-500 hover:text-slate-400">Terms</Link> &{' '}
            <Link href="/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-950"/>}><AuthForm/></Suspense>
}
