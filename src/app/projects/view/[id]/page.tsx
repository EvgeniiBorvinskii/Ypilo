'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Calendar, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PublicProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/view/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
        await fetch(`/api/projects/${params.id}/view`, { method: 'POST' })
      } else {
        setError('Project not found')
      }
    } catch (err) {
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">This project does not exist or has been removed.</p>
            <Link href="/projects" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {project.user?.name || 'Anonymous'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {project.viewCount} views
              </div>
            </div>

            {project.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Preview</h2>
              <div className="border border-border rounded-lg overflow-hidden bg-background">
                <iframe
                  srcDoc={project.preview}
                  className="w-full border-0 bg-background"
                  style={{ minHeight: '600px', height: '600px' }}
                  title="Project Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
