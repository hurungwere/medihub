'use client'

import { useState, useEffect } from 'react'
import { Save, Shield, Settings, Sliders, Info, RefreshCw } from 'lucide-react'
import { getSettings, updateSettings } from '@/app/actions/admin'

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    platformName: 'MediHub',
    maintenanceMode: false,
    allowRegistrations: true,
    requireVerification: true,
    commissionRate: '2.5%',
    supportEmail: 'support@medihub.com',
    clinicProPrice: '$99',
    supplierStandardPrice: '$149'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await getSettings()
      if (data && Object.keys(data).length > 0) {
        setForm({
          platformName: data.platformName ?? 'MediHub',
          maintenanceMode: !!data.maintenanceMode,
          allowRegistrations: data.allowRegistrations ?? true,
          requireVerification: data.requireVerification ?? true,
          commissionRate: data.commissionRate ?? '2.5%',
          supportEmail: data.supportEmail ?? 'support@medihub.com',
          clinicProPrice: data.clinicProPrice ?? '$99',
          supplierStandardPrice: data.supplierStandardPrice ?? '$149'
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const res = await updateSettings(form)
      if (res.success) {
        setMessage({ type: 'success', text: 'Platform settings updated successfully!' })
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save settings' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <title>Platform Settings - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">System Settings</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">SETTINGS</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-4xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Global Configuration</h2>
          <p className="text-sm text-slate-400 mt-1">Configure registrations, fees, maintenance, and support contact credentials.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl border flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General settings */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-2">
              <Sliders className="w-5 h-5 text-primary-400" />
              <h3 className="font-bold text-slate-200">General Platform Config</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Title</label>
                <input required value={form.platformName} onChange={e => setForm({...form, platformName: e.target.value})} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Commission Charge Rate</label>
                <input required value={form.commissionRate} onChange={e => setForm({...form, commissionRate: e.target.value})} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinic Pro Price Plan</label>
                <input required value={form.clinicProPrice} onChange={e => setForm({...form, clinicProPrice: e.target.value})} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Supplier Standard Price Plan</label>
                <input required value={form.supplierStandardPrice} onChange={e => setForm({...form, supplierStandardPrice: e.target.value})} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Technical Support Email</label>
                <input required value={form.supportEmail} onChange={e => setForm({...form, supportEmail: e.target.value})} type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-2">
              <Shield className="w-5 h-5 text-primary-400" />
              <h3 className="font-bold text-slate-200">Access & Guardrails</h3>
            </div>

            <div className="space-y-4 divide-y divide-slate-800/40">
              {/* Allow registrations */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Allow Registrations</h4>
                  <p className="text-xs text-slate-500">Toggle whether new Clinics or Suppliers can sign up.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.allowRegistrations} onChange={e => setForm({...form, allowRegistrations: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white"></div>
                </label>
              </div>

              {/* Require verification */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Require Verification</h4>
                  <p className="text-xs text-slate-500">New suppliers must go through verification before bidding on bid requests.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.requireVerification} onChange={e => setForm({...form, requireVerification: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white"></div>
                </label>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Platform Maintenance Mode</h4>
                  <p className="text-xs text-slate-500">Put the front-end marketplace into read-only mode for users.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.maintenanceMode} onChange={e => setForm({...form, maintenanceMode: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button type="button" onClick={fetchSettings} className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 text-sm font-semibold rounded-lg hover:text-white transition-all flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Reset Settings
            </button>
            
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
