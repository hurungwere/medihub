'use server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function getBlogPosts() {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch blog posts')
    return await res.json()
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function addBlogPost(post: { title: string; excerpt: string; author: string; role: string; readTime?: string; category?: string }) {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error || 'Failed to add blog post' }
    return { success: true, post: data.post }
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error || 'Failed to delete blog post' }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' }
  }
}
