'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Play, Edit, Code, Eye, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string | null
  code: string
  preview: string
  userId: string
  createdAt: string
  updatedAt: string
  viewCount: number
  user: {
    name: string | null
    email: string | null
  }
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProject()
    }
  }, [status, params.id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/dashboard')
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

  if (!project) {
    return null
  }

  // Check if user owns this project
  const isOwner = session?.user?.email === project.user.email

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span>Created by</span>
              </div>
              <p className="font-medium">{project.user.name || project.user.email}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="font-medium">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Eye className="h-4 w-4" />
                <span>Views</span>
              </div>
              <p className="font-medium">{project.viewCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Run Project Button */}
            <Link
              href={`/dashboard/projects/${project.id}/preview`}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              Run Project
            </Link>

            {/* Edit Project Button - Only for owner */}
            {isOwner && (
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-200"
              >
                <Edit className="h-5 w-5" />
                Edit Project
              </Link>
            )}
          </div>

          {/* Preview Card */}
          <div className="bg-muted/50 rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Project Preview</h2>
            </div>
            
            <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
              <iframe
                srcDoc={project.preview}
                className="w-full h-96 bg-background border-0"
                sandbox="allow-scripts"
                title="Project Preview"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/projects/${project.id}`}
                target="_blank"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Open in New Tab
              </Link>
            </div>
          </div>

          {/* Code Stats */}
          <div className="mt-8 bg-muted/50 rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {project.code.split('\n').length}
                </p>
                <p className="text-sm text-muted-foreground">Lines of Code</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Math.ceil(project.code.length / 1024)}KB
                </p>
                <p className="text-sm text-muted-foreground">Size</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {isOwner ? 'Owner' : 'Viewer'}
                </p>
                <p className="text-sm text-muted-foreground">Your Role</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
