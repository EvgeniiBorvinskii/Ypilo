'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Send, Sparkles, ArrowLeft, Eye, Upload } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createProject = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name')
      return
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: projectName, description: projectDescription }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to create project')
        return
      }

      const data = await res.json()
      setProjectId(data.project.id)
      
      // Add welcome message
      setMessages([
        {
          role: 'assistant',
          content: `Great! I've created your project "${projectName}". Now, tell me what you'd like to build. For example:\n\n• A landing page for a business\n• A todo app\n• A blog website\n• A portfolio site\n• Or anything else you can imagine!\n\nDescribe your project and I'll generate the code for you.`
        }
      ])
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !projectId) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          messages: [...messages, userMessage],
        }),
      })

      const data = await res.json()
      
      if (data.code) {
        setGeneratedCode(data.code)
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    if (projectId && generatedCode) {
      router.push(`/dashboard/projects/${projectId}/preview`)
    }
  }

  const handlePublish = async () => {
    if (!projectId) return

    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: 'POST',
      })

      if (res.ok) {
        alert('Project published successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error publishing:', error)
      alert('Failed to publish project')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {!projectId ? (
          /* Project Setup Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
              <p className="text-muted-foreground">
                Give your project a name and let AI help you build it
              </p>
            </div>

            <div className="space-y-6 bg-card p-8 rounded-xl border border-border">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Brief description of your project"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  maxLength={200}
                />
              </div>

              <button
                onClick={createProject}
                disabled={!projectName.trim()}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Continue to AI Chat
              </button>
            </div>
          </motion.div>
        ) : (
          /* Chat Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-[600px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Describe what you want to build..."
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-4">Project Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handlePreview}
                    disabled={!generatedCode}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={handlePublish}
                    disabled={!generatedCode}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Publish to Gallery</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
                <h3 className="font-semibold mb-2 text-blue-600">Tips</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Be specific about what you want</li>
                  <li>• Mention colors, layout preferences</li>
                  <li>• Ask for changes iteratively</li>
                  <li>• Preview before publishing</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
