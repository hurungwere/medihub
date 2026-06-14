'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getCategories } from '@/app/actions/admin'

const units = ['Units','Boxes','Cartons','Vials','Packs','Litres','Kg']

interface ProductRow { name:string; qty:string; unit:string; spec:string }

export default function CreateBidPage() {
  const [categories, setCategories] = useState<string[]>([
    'Pharmaceuticals', 'Medical Equipment', 'Consumables', 'Laboratory', 'IT/Healthcare Tech', 'PPE', 'Diagnostics'
  ])

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories()
        if (data && data.length > 0) {
          setCategories(data.map((c: any) => c.name))
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadCats()
  }, [])

  const [step, setStep] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [products, setProducts] = useState<ProductRow[]>([{ name:'', qty:'', unit:'Units', spec:'' }])
  const [form, setForm] = useState({
    title:'', description:'', category:'', priority:'normal',
    equipName:'', brand:'', techReq:'', budget:'', currency:'USD',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const addProduct = () => setProducts(p => [...p, { name:'', qty:'', unit:'Units', spec:'' }])
  const removeProduct = (i: number) => setProducts(p => p.filter((_,idx)=>idx!==i))
  const updateProduct = (i: number, field: keyof ProductRow, val: string) =>
    setProducts(p => p.map((row,idx) => idx===i ? {...row, [field]:val} : row))

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 2000)
  }

  if (submitted) return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
        <h2 className="text-xl font-bold text-white mb-2">Bid Request Published!</h2>
        <p className="text-sm text-slate-400 mb-6">Your requirement is live. Relevant suppliers have been notified and will submit quotations shortly.</p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/clinic/tenders" className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl text-sm hover:bg-primary-600 transition-colors">View My Bids</Link>
          <button onClick={() => { setSubmitted(false); setStep(1) }} className="px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors">Post Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/clinic" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 inline-flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold text-white mt-2">Create New Bid</h1>
        <p className="text-sm text-slate-400 mt-1">Post your procurement requirement to verified suppliers.</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {['Basic Info','Products','Equipment','Documents'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step>i+1 ? 'bg-emerald-500 text-white' : step===i+1 ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className={`hidden sm:block text-xs font-medium transition-colors ${step===i+1 ? 'text-primary-400' : step>i+1 ? 'text-emerald-400' : 'text-slate-600'}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-slate-800 mx-2 w-8 sm:w-16" />}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width:`${progress}%` }}/>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-base font-semibold text-white">Basic Information</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bid Title <span className="text-rose-400">*</span></label>
              <input className="input-field" placeholder="e.g. Surgical Gloves — Latex Free, 50,000 units" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
              <textarea rows={4} className="input-field resize-none" placeholder="Provide details about your requirement, quality standards, certifications needed…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category <span className="text-rose-400">*</span></label>
                <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="">Select category…</option>
                  {categories.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Priority Level</label>
                <select className="input-field" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                  <option value="low">Low — Flexible timeline</option>
                  <option value="normal">Normal — Standard delivery</option>
                  <option value="urgent">Urgent — ASAP</option>
                  <option value="critical">Critical — Emergency</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Product Requirements</h2>
              <button onClick={addProduct} className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Add Product
              </button>
            </div>
            <div className="space-y-3">
              {products.map((p, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400">Product #{i+1}</span>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(i)} className="text-slate-600 hover:text-rose-400 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-500 mb-1">Product Name</label>
                      <input className="input-field text-xs py-2" placeholder="Surgical Gloves" value={p.name} onChange={e=>updateProduct(i,'name',e.target.value)}/>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Quantity</label>
                      <input type="number" className="input-field text-xs py-2" placeholder="50000" value={p.qty} onChange={e=>updateProduct(i,'qty',e.target.value)}/>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Unit</label>
                      <select className="input-field text-xs py-2" value={p.unit} onChange={e=>updateProduct(i,'unit',e.target.value)}>
                        {units.map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-slate-500 mb-1">Specifications</label>
                    <input className="input-field text-xs py-2" placeholder="Size M, sterile, powder-free, EN455 certified" value={p.spec} onChange={e=>updateProduct(i,'spec',e.target.value)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-base font-semibold text-white">Equipment Requirements</h2>
            <p className="text-xs text-slate-500">Skip this step if your bid request is for medicines or consumables only.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Equipment Name</label>
                <input className="input-field" placeholder="ICU Patient Monitor" value={form.equipName} onChange={e=>setForm({...form,equipName:e.target.value})}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Brand Preference</label>
                <input className="input-field" placeholder="Philips, GE, or equivalent" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Technical Requirements</label>
              <textarea rows={4} className="input-field resize-none" placeholder="Screen size, connectivity, battery, certifications (CE, FDA)…" value={form.techReq} onChange={e=>setForm({...form,techReq:e.target.value})}/>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Budget (Optional)</label>
                <input type="number" className="input-field" placeholder="96000" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Currency</label>
                <select className="input-field" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
                  {['USD','EUR','GBP','AED','SAR','EGP'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-base font-semibold text-white">Supporting Documents</h2>
            <div
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}
              onClick={()=>fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-primary-400 bg-primary-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'}`}>
              <div className="text-4xl mb-3">📎</div>
              <p className="text-sm font-medium text-slate-300">{dragging ? 'Drop files here' : 'Drag & drop files, or click to browse'}</p>
              <p className="text-xs text-slate-500 mt-1.5">PDF, DOCX, XLSX, PNG, JPG — Max 20MB each</p>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileInput} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"/>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3">
                    <span className="text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{f.name}</p>
                      <p className="text-xs text-slate-600">{(f.size/1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setFiles(prev=>prev.filter((_,idx)=>idx!==i))} className="text-slate-600 hover:text-rose-400 transition-colors">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <button onClick={() => setStep(s => Math.max(1, s-1))} disabled={step===1}
            className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200">
            ← Previous
          </button>
          {step < totalSteps ? (
            <button onClick={() => setStep(s => s+1)}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25">
              Next Step →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2">
              {submitting ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Publishing…</> : '🚀 Publish Bid'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
