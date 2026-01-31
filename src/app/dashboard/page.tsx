'use client'

export const dynamic = 'force-dynamic'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sparkles, LogOut, Crown, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string | null
  viewCount: number
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    
    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return null

  const isPremium = session.user.subscriptionTier === 'PREMIUM'
  const maxProjects = isPremium ? 3 : 1
  const canCreateMore = projects.length < maxProjects

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {!isPremium && (
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Crown className="w-4 h-4" />
                <span className="font-medium">Upgrade to Premium</span>
              </Link>
            )}
            
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-3xl font-bold mt-1">
                  {projects.length}/{maxProjects}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold mt-1">
                  {projects.reduce((sum, p) => sum + p.viewCount, 0)}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-2xl font-bold mt-1">
                  {isPremium ? 'Premium' : 'Free'}
                </p>
              </div>
              {isPremium && <Crown className="w-8 h-8 text-yellow-500" />}
            </div>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          
          {canCreateMore ? (
            <Link
              href="/dashboard/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </Link>
          ) : (
            <div className="text-sm text-muted-foreground">
              {isPremium ? 'Maximum projects reached (3/3)' : 'Upgrade to create more projects'}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border-2 border-dashed border-border rounded-xl"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first AI-powered project
            </p>
            {canCreateMore && (
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-600 rounded-full">
                      {project.viewCount} views
                    </span>
                  </div>
                  
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
