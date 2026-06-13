'use server'

import { API_BASE } from '@/lib/api'

const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(process.env.API_HOST ? { Host: process.env.API_HOST } : {}),
}

async function safeJson(res: Response) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    console.error('Non-JSON response from server:', text.slice(0, 300))
    return null
  }
}

export async function getSuppliers() {
  try {
    const res = await fetch(`${API_BASE}/api/suppliers`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get suppliers error:', error)
    return []
  }
}

export async function addSupplier(supplier: any) {
  try {
    const res = await fetch(`${API_BASE}/api/suppliers`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(supplier),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add supplier' }
    return { success: true, id: json.id }
  } catch (error) {
    console.error('Add supplier error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}
