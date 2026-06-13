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

// --- Users Actions ---
export async function getUsers() {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get users error:', error)
    return []
  }
}

export async function addUser(user: any) {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(user),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add user' }
    return { success: true, id: json.id }
  } catch (error) {
    console.error('Add user error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function updateUser(id: number, user: any) {
  try {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(user),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update user' }
    return { success: true }
  } catch (error) {
    console.error('Update user error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete user' }
    return { success: true }
  } catch (error) {
    console.error('Delete user error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

// --- Clinics Actions ---
export async function getClinics() {
  try {
    const res = await fetch(`${API_BASE}/api/clinics`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get clinics error:', error)
    return []
  }
}

export async function addClinic(clinic: any) {
  try {
    const res = await fetch(`${API_BASE}/api/clinics`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(clinic),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add clinic' }
    return { success: true, id: json.id }
  } catch (error) {
    console.error('Add clinic error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function updateClinic(id: number, clinic: any) {
  try {
    const res = await fetch(`${API_BASE}/api/clinics/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(clinic),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update clinic' }
    return { success: true }
  } catch (error) {
    console.error('Update clinic error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteClinic(id: number) {
  try {
    const res = await fetch(`${API_BASE}/api/clinics/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete clinic' }
    return { success: true }
  } catch (error) {
    console.error('Delete clinic error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

// --- Categories Actions ---
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get categories error:', error)
    return []
  }
}

export async function addCategory(category: any) {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify(category),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to add category' }
    return { success: true, id: json.id }
  } catch (error) {
    console.error('Add category error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function updateCategory(id: number, category: any) {
  try {
    const res = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(category),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update category' }
    return { success: true }
  } catch (error) {
    console.error('Update category error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete category' }
    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

// --- Verifications Actions ---
export async function getVerifications() {
  try {
    const res = await fetch(`${API_BASE}/api/verifications`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return []
    return json as any[]
  } catch (error) {
    console.error('Get verifications error:', error)
    return []
  }
}

export async function updateVerification(id: number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/api/verifications/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify({ status }),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update verification' }
    return { success: true }
  } catch (error) {
    console.error('Update verification error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

// --- Reports Actions ---
export async function getReports() {
  try {
    const res = await fetch(`${API_BASE}/api/reports`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return null
    return json
  } catch (error) {
    console.error('Get reports error:', error)
    return null
  }
}

// --- Settings Actions ---
export async function getSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      cache: 'no-store',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json || !res.ok) return {}
    return json
  } catch (error) {
    console.error('Get settings error:', error)
    return {}
  }
}

export async function updateSettings(settings: any) {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(settings),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update settings' }
    return { success: true }
  } catch (error) {
    console.error('Update settings error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

// --- Suppliers Extra Actions for admin ---
export async function updateSupplier(id: number, supplier: any) {
  try {
    const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: BASE_HEADERS,
      body: JSON.stringify(supplier),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to update supplier' }
    return { success: true }
  } catch (error) {
    console.error('Update supplier error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function deleteSupplier(id: number) {
  try {
    const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: BASE_HEADERS,
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Failed to delete supplier' }
    return { success: true }
  } catch (error) {
    console.error('Delete supplier error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}
