'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, X, Shield, Mail, Building } from 'lucide-react'
import { getUsers, addUser, updateUser, deleteUser } from '@/app/actions/admin'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    orgType: 'clinic',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setForm({ name: '', email: '', organization: '', orgType: 'clinic', password: '' })
    setError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user: any) => {
    setModalMode('edit')
    setSelectedUser(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      organization: user.organization || '',
      orgType: user.orgType || 'clinic',
      password: '' // Optional for edit
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (modalMode === 'add') {
        const res = await addUser(form)
        if (res.success) {
          setIsModalOpen(false)
          fetchUsers()
        } else {
          setError(res.error || 'Failed to add user')
        }
      } else {
        const res = await updateUser(selectedUser.id, {
          name: form.name,
          email: form.email,
          organization: form.organization,
          orgType: form.orgType,
          ...(form.password ? { password: form.password } : {})
        })
        if (res.success) {
          setIsModalOpen(false)
          fetchUsers()
        } else {
          setError(res.error || 'Failed to update user')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const res = await deleteUser(id)
      if (res.success) {
        fetchUsers()
      } else {
        alert(res.error || 'Failed to delete user')
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.organization?.toLowerCase().includes(search.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.orgType === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <>
      <title>User Management - MediHub Admin</title>
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">User Management</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-semibold">USERS</span>
        </div>
        <button onClick={handleOpenAdd} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Registered Users</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and audit credentials and access roles.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email, organization..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select 
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg py-2.5 px-3 focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="clinic">Clinics</option>
              <option value="supplier">Suppliers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-sm font-semibold text-slate-200">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-500" /> {user.organization || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.orgType === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          user.orgType === 'supplier' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {user.orgType === 'admin' ? 'Administrator' : user.orgType === 'supplier' ? 'Supplier' : 'Clinic'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(user)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modalMode === 'add' ? 'Add New User' : 'Edit User Profile'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. Dr. John Watson" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="e.g. john@watson.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization / Facility</label>
                <input required value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} type="text" placeholder="e.g. Baker Clinic" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role & Access Type</label>
                <select value={form.orgType} onChange={e => setForm({...form, orgType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500">
                  <option value="clinic">Clinic / Hospital</option>
                  <option value="supplier">Supplier / Vendor</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password {modalMode === 'edit' && <span className="text-slate-500 text-[10px] lowercase">(Leave blank to keep current)</span>}
                </label>
                <input required={modalMode === 'add'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary-500" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  {loading ? 'Processing...' : modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
