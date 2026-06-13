'use client'

import { useState, useRef, useEffect } from 'react'

const conversations = [
  { id:'C1', name:'MedSupply Co.', last:'We can deliver in 5 business days.', time:'2m', unread:2, online:true, avatar:'MS', tender:'TND-001' },
  { id:'C2', name:'PharmaDist Ltd.', last:'Please see the attached COA document.', time:'1h', unread:0, online:true, avatar:'PD', tender:'TND-002' },
  { id:'C3', name:'Global MedSource', last:'Our bulk pricing starts at $7,500.', time:'3h', unread:1, online:false, avatar:'GM', tender:'TND-003' },
  { id:'C4', name:'BioPharm Supplies', last:'Can you clarify the specification?', time:'1d', unread:0, online:false, avatar:'BP', tender:'TND-001' },
]

const initialMessages: Record<string, { from:string; text:string; time:string; me:boolean }[]> = {
  C1: [
    { from:'MedSupply Co.', text:'Hello! We reviewed your tender TND-001 for surgical gloves.', time:'10:15', me:false },
    { from:'You', text:'Great, what is your best unit price for 50,000 units?', time:'10:17', me:true },
    { from:'MedSupply Co.', text:'We can offer $0.16/unit for that volume, with CE and ISO 9001 certification.', time:'10:18', me:false },
    { from:'MedSupply Co.', text:'We can deliver in 5 business days.', time:'10:18', me:false },
  ],
  C2: [
    { from:'PharmaDist Ltd.', text:'Hi, we have the MRI contrast agent in stock.', time:'09:00', me:false },
    { from:'You', text:'Can you provide the Certificate of Analysis?', time:'09:05', me:true },
    { from:'PharmaDist Ltd.', text:'Please see the attached COA document.', time:'09:10', me:false },
  ],
  C3: [
    { from:'Global MedSource', text:'We specialize in ICU monitoring equipment.', time:'Yesterday', me:false },
    { from:'Global MedSource', text:'Our bulk pricing starts at $7,500.', time:'Yesterday', me:false },
  ],
  C4: [
    { from:'BioPharm Supplies', text:'Can you clarify the specification for the gloves?', time:'2 days ago', me:false },
  ],
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState('C1')
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [activeId, messages])

  const send = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId]||[]), { from:'You', text:input, time:now, me:true }] }))
    setInput('')
    // Simulated reply
    setTimeout(() => {
      setMessages(prev => ({ ...prev, [activeId]: [...prev[activeId], { from:conversations.find(c=>c.id===activeId)?.name||'', text:'Thanks for your message. We will get back to you shortly.', time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}), me:false }] }))
    }, 1500)
  }

  const active = conversations.find(c => c.id === activeId)!

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-slate-800/60 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800/60">
          <h2 className="text-sm font-semibold text-white mb-3">Messages</h2>
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search conversations…" className="input-field pl-9 py-2 text-xs"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-800/40">
          {conversations.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-slate-800/30 transition-colors ${activeId===c.id ? 'bg-slate-800/50 border-r-2 border-primary-500' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">{c.avatar}</div>
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-slate-200 truncate">{c.name}</p>
                  <span className="text-[10px] text-slate-600 flex-shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.last}</p>
                <p className="text-[10px] text-primary-400 mt-0.5">Re: {c.tender}</p>
              </div>
              {c.unread > 0 && <span className="w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-1">{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/50">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">{active.avatar}</div>
            {active.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"/>}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{active.name}</p>
            <p className="text-xs text-slate-500">{active.online ? '🟢 Online' : '⚫ Offline'} · {active.tender}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs">📎 Files</button>
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs">ℹ️ Info</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(messages[activeId]||[]).map((m, i) => (
            <div key={i} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
              {!m.me && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white mr-2 flex-shrink-0 mt-auto">{active.avatar}</div>
              )}
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${m.me ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.me ? 'text-primary-200' : 'text-slate-500'} text-right`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Type a message…"
              className="flex-1 bg-slate-800/60 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"/>
            <button onClick={send} disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white flex items-center justify-center transition-all duration-200 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
