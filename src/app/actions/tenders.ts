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

export async function getTenders() {
  try {
    const res = await fetch(`${API_BASE}/api/tenders`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get tenders error:', error)
    return []
  }
}

export async function addTender(tender: any) {
  try {
    const res = await fetch(`${API_BASE}/api/tenders`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(tender),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add tender' }
    return { success: true }
  } catch (error) {
    console.error('Add tender error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function updateTender(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/api/tenders/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(data),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update tender' }
    return { success: true }
  } catch (error) {
    console.error('Update tender error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteTender(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/tenders/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete tender' }
    return { success: true }
  } catch (error) {
    console.error('Delete tender error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}
