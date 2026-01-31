'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Upload, Code, Eye, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProject()
      fetchComments()
      incrementViewCount()
    }
  }, [status])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
        setViewCount(data.project.viewCount || 0)
      } else {
        alert('Project not found')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const incrementViewCount = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/view`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setViewCount(data.viewCount)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/projects/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments([data.comment, ...comments])
        setNewComment('')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/publish`, {
        method: 'POST',
      })

      if (res.ok) {
        alert('Project published successfully!')
        router.push('/dashboard')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to publish')
      }
    } catch (error) {
      console.error('Error publishing:', error)
      alert('Failed to publish project')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project || !project.preview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No preview available</h2>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/projects/new`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Editor</span>
              </Link>
              
              <div className="h-6 w-px bg-border" />
              
              <h1 className="text-lg font-semibold">{project.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{viewCount.toLocaleString()}</span>
              </div>

              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>{showCode ? 'Hide' : 'Show'} Code</span>
              </button>

              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Publish to Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1">
          {showCode ? (
            /* Code View */
            <div className="h-full overflow-auto p-8">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-xl p-6 overflow-x-auto"
                >
                  <pre className="text-sm text-gray-100">
                    <code>{project.preview}</code>
                  </pre>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Preview View */
            <div className="w-full h-full bg-muted/30">
              <iframe
                srcDoc={project.preview}
                className="w-full h-full border-0 bg-background"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        <div className="w-96 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h2 className="font-semibold">Comments</h2>
              <span className="text-sm text-muted-foreground">({comments.length})</span>
            </div>
          </div>

          {/* Comment Form */}
          {session && (
            <form onSubmit={handleSubmitComment} className="p-4 border-b border-border">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
                disabled={submittingComment}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submittingComment}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingComment ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet</p>
                <p className="text-sm mt-1">Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-start gap-3">
                    {comment.user.image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name || 'User'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {comment.user.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.user.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* View Count Footer */}
          <div className="p-4 border-t border-border bg-accent/50">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>
                <strong className="text-foreground">{viewCount.toLocaleString()}</strong> total views
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
