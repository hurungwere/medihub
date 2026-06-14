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

export async function getCaseStudies() {
  try {
    const res = await fetch(`${API_BASE}/api/case-studies`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get case studies error:', error)
    return []
  }
}

export async function addCaseStudy(study: any) {
  try {
    const res = await fetch(`${API_BASE}/api/case-studies`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(study),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add case study' }
    return { success: true }
  } catch (error) {
    console.error('Add case study error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteCaseStudy(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/case-studies/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete case study' }
    return { success: true }
  } catch (error) {
    console.error('Delete case study error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}
