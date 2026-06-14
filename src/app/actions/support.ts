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

export async function getSupportInquiries() {
  try {
    const res = await fetch(`${API_BASE}/api/support-inquiries`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get support inquiries error:', error)
    return []
  }
}

export async function addSupportInquiry(inquiry: any) {
  try {
    const res = await fetch(`${API_BASE}/api/support-inquiries`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(inquiry),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to submit inquiry' }
    return { success: true }
  } catch (error) {
    console.error('Add support inquiry error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteSupportInquiry(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/support-inquiries/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete inquiry' }
    return { success: true }
  } catch (error) {
    console.error('Delete support inquiry error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}
