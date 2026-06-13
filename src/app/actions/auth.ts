'use server'

import { API_BASE } from '@/lib/api'
import { cookies } from 'next/headers'

// Required when using IP directly — tells the server which virtual host to use
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

export async function registerUser(data: any) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        org: data.org,
        orgType: data.orgType,
      }),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Registration failed' }

    // Log the user in by setting the cookie
    cookies().set('session_user', JSON.stringify({
      email: data.email,
      name: data.name,
      organization: data.org,
      orgType: data.orgType,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return { success: true, userId: json.userId }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function loginUser(data: any) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
    const json = await safeJson(res)
    if (!json) return { success: false, error: 'Server error — please try again later' }
    if (!res.ok) return { success: false, error: json.error || 'Login failed' }

    // Log the user in by setting the cookie
    cookies().set('session_user', JSON.stringify(json.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return { success: true, user: json.user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Could not reach the server' }
  }
}

export async function logoutUser() {
  cookies().delete('session_user')
  return { success: true }
}
