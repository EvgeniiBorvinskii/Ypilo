'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Users, FileCode, Crown, Shield, Trash2, Edit, Check, X, BarChart3 } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string | null
  isAdmin: boolean
  createdAt: string
  projects: { id: string; title: string; viewCount: number; createdAt: string }[]
  subscription: { tier: string; status: string } | null
  _count: { projects: number; comments: number }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalProjects: 0, totalViews: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?q=${searchQuery}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        
        // Calculate stats
        const premiumCount = data.users.filter((u: User) => u.subscription?.tier === 'PREMIUM').length
        const totalProjects = data.users.reduce((sum: number, u: User) => sum + u._count.projects, 0)
        const totalViews = data.users.reduce((sum: number, u: User) => 
          sum + u.projects.reduce((s, p) => s + p.viewCount, 0), 0
        )
        
        setStats({
          totalUsers: data.pagination.total,
          premiumUsers: premiumCount,
          totalProjects,
          totalViews,
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGrantPremium = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'grant_premium' }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error granting premium:', error)
    }
  }

  const handleRevokePremium = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'revoke_premium' }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error revoking premium:', error)
    }
  }

  const handleToggleAdmin = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'toggle_admin' }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error toggling admin:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">Manage users, projects, and premium access</p>
          <div className="flex space-x-4 mt-4">
            <a href="/admin228/emails" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Manage Emails
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">{stats.totalUsers}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Crown className="h-8 w-8 text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">{stats.premiumUsers}</span>
            </div>
            <p className="text-sm text-muted-foreground">Premium Users</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileCode className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{stats.totalProjects}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">{stats.totalViews}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-background"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 mt-1">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.subscription?.tier === 'PREMIUM' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 border border-yellow-500/20">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{user._count.projects} projects</div>
                        {user.projects.slice(0, 2).map((project) => (
                          <div key={project.id} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="truncate max-w-[200px]">{project.title}</span>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className="text-xs">{project.viewCount} views</span>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                title="Delete project"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.subscription?.tier === 'PREMIUM' ? (
                          <button
                            onClick={() => handleRevokePremium(user.id)}
                            className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Revoke Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGrantPremium(user.id)}
                            className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 hover:from-yellow-500/20 hover:to-orange-500/20 transition-colors border border-yellow-500/20"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Grant Premium
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleToggleAdmin(user.id)}
                          className={`inline-flex items-center px-3 py-1 text-xs rounded-md transition-colors ${
                            user.isAdmin
                              ? 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}
