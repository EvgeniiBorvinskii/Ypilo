'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Send, Save, Play, Code, MessageSquare, Loader2, Sparkles, Eye, AlertTriangle, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Project {
  id: string
  title: string
  description: string | null
  code: string
  preview: string
  chatHistory: any[] | null
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [code, setCode] = useState('')
  const [preview, setPreview] = useState('')
  const [previewError, setPreviewError] = useState('')
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-update preview when code changes
  useEffect(() => {
    if (code && !loading) {
      const timeoutId = setTimeout(() => {
        updatePreview()
      }, 1000) // Auto-update preview after 1 second of no changes
      
      return () => clearTimeout(timeoutId)
    }
  }, [code])

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
        const proj = data.project
        
        // Check if user owns this project
        if (session?.user?.email !== proj.user.email) {
          router.push('/dashboard')
          return
        }

        setProject(proj)
        setCode(proj.code)
        setPreview(proj.preview)
        
        // Load chat history if exists
        if (proj.chatHistory && Array.isArray(proj.chatHistory)) {
          setMessages(proj.chatHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })))
        } else {
          // Initialize with welcome message
          setMessages([{
            role: 'assistant',
            content: `Welcome back! I'm ready to help you edit "${proj.title}". What would you like to change?`,
            timestamp: new Date()
          }])
        }
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

  // Optimized scroll to bottom - only when user sends message or AI responds
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [])

  // Only scroll when messages array length changes (new message added)
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length, scrollToBottom])

  // Validate code for security before preview - minimal checks
  const validateCode = (codeToValidate: string): { isValid: boolean; error?: string } => {
    // Only check for truly dangerous patterns that could break the page
    const dangerousPatterns = [
      /while\s*\(\s*true\s*\)/gi,
      /for\s*\(\s*;;\s*\)/gi,
    ]

    const patternNames = [
      'Infinite while loop',
      'Infinite for loop',
    ]

    for (let i = 0; i < dangerousPatterns.length; i++) {
      if (dangerousPatterns[i].test(codeToValidate)) {
        return { 
          isValid: false, 
          error: `Security violation: ${patternNames[i]} is not allowed in preview mode.` 
        }
      }
    }

    return { isValid: true }
  }

  const updatePreview = async () => {
    setIsPreviewUpdating(true)
    setPreviewError('')

    try {
      const validation = validateCode(code)
      
      if (!validation.isValid) {
        setPreviewError(validation.error!)
        setPreview('')
        return
      }

      // Strip dangerous elements but keep CSS - create isolated HTML
      let sanitizedCode = code
        // Only remove dangerous scripts (not CDN libraries)
        .replace(/<script[^>]*src\s*=\s*["'](?!https?:\/\/(cdn\.|unpkg\.|cdnjs\.|jsdelivr\.))[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, '')
        // Remove iframes
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<iframe[^>]*>/gi, '')
        // Remove objects and embeds
        .replace(/<object[\s\S]*?<\/object>/gi, '')
        .replace(/<object[^>]*>/gi, '')
        .replace(/<embed[\s\S]*?<\/embed>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
      
      // Create completely isolated HTML with base tag to prevent navigation
      const safeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <base href="about:srcdoc">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:;">
  <title>Preview - ${project?.title || 'Project'}</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
    }
    .error { 
      color: red; 
      padding: 10px; 
      border: 1px solid red; 
      border-radius: 4px; 
      margin: 10px 0; 
      background: #ffe6e6;
    }
    /* Block dangerous elements but allow CDN CSS */
    iframe, object, embed { display: none !important; }
  </style>
</head>
<body>
  <div id="preview-content">${sanitizedCode}</div>
  <script>
    (function() {
      'use strict';
      
      // Block all navigation attempts
      window.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);
      
      // Safety timeout to prevent infinite loops
      const startTime = Date.now();
      const safetyTimeout = setTimeout(() => {
        const content = document.getElementById('preview-content');
        if (content) {
          content.innerHTML = '<div class="error">⚠️ Preview stopped due to execution timeout (max 10s).</div>';
        }
      }, 10000);
      
      // Clear safety timeout after execution completes normally
      setTimeout(() => clearTimeout(safetyTimeout), 9500);
      
    })();
  </script>
</body>
</html>`

      setPreview(safeHtml)
    } catch (error) {
      setPreviewError('Failed to update preview: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setPreview('')
    } finally {
      setIsPreviewUpdating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    try {
      const payload = {
        projectId: project?.id,
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      }
      
      console.log('🚀 Sending chat request:', { 
        projectId: project?.id, 
        hasProject: !!project,
        messageCount: payload.messages.length 
      })
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('📥 Response status:', res.status)
      console.log('📥 Response ok:', res.ok)

      if (res.ok) {
        const data = await res.json()
        
        if (data.code) {
          setCode(data.code)
          // Preview will auto-update thanks to useEffect on code changes
        }

        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message || 'Code updated successfully!',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        const error = await res.json()
        console.error('API Error Response:', error)
        console.error('Status:', res.status)
        
        let errorMessage = 'Sorry, there was an error processing your request.'
        
        if (error.error?.includes('prohibited patterns')) {
          errorMessage = error.error
        } else if (error.error?.includes('rate limit')) {
          errorMessage = 'AI service is busy. Please wait a moment and try again.'
        } else if (error.error?.includes('credits depleted')) {
          errorMessage = 'AI service credits are depleted. Please try again later.'
        }
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!project) return

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          preview,
          chatHistory: messages
        })
      })

      if (res.ok) {
        alert('Project saved successfully!')
      } else {
        alert('Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
      const newMessages = [{
        role: 'assistant' as const,
        content: `Chat history cleared. I'm ready to help you edit "${project?.title}". What would you like to change?`,
        timestamp: new Date()
      }]
      
      setMessages(newMessages)
      
      // Save cleared chat history to database
      try {
        await fetch(`/api/projects/${project?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatHistory: newMessages
          })
        })
      } catch (error) {
        console.error('Error clearing chat history in database:', error)
      }
    }
  }

  const handleDeleteProject = async () => {
    if (!project) return

    const confirmDelete = confirm(
      `⚠️ Are you sure you want to delete "${project.title}"?\n\n` +
      `This action CANNOT be undone and will permanently delete all project data.`
    )
    
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('✅ Project deleted successfully! You can now create a new project.')
        router.push('/dashboard')
      } else {
        const error = await res.json()
        alert(`Failed to delete project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages.length])

  // Limit displayed messages to prevent performance issues (show last 50)
  const displayedMessages = useMemo(() => {
    return memoizedMessages.slice(-50)
  }, [memoizedMessages])

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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 bg-background sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              ← Back
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Edit: {project.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteProject}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-xl hover:from-secondary/90 hover:to-secondary/70 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={updatePreview}
              disabled={isPreviewUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPreviewUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Update Preview</span>
            </button>
            <Link
              href={`/dashboard/projects/${project.id}/preview`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Run</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border min-h-[300px] lg:min-h-0">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-semibold">Code</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all code? This cannot be undone.')) {
                  setCode('')
                  setPreview('')
                }
              }}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              title="Clear code"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm bg-background resize-none focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            spellCheck={false}
            placeholder="Enter your HTML/CSS/JavaScript code here..."
          />
        </div>

        {/* AI Chat */}
        <div className="w-full lg:w-96 flex flex-col border-b lg:border-b-0 lg:border-r border-border min-h-[400px] lg:min-h-0 transition-all duration-300">
          <div className={`px-4 py-2 border-b border-border flex items-center gap-2 transition-all duration-300 ${
            isGenerating ? 'bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse' : 'bg-muted/30'
          }`}>
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="font-semibold">AI Assistant</span>
            {isGenerating && (
              <span className="text-xs text-primary ml-2 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Thinking...
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {messages.length}
              </span>
              <button
                onClick={handleClearChat}
                className="p-1 hover:bg-red-500/10 rounded transition-colors"
                title="Clear chat history"
              >
                <RefreshCw className="h-3.5 w-3.5 text-red-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {displayedMessages.length > 50 && (
              <div className="text-center text-xs text-muted-foreground py-2 animate-in fade-in duration-500">
                Showing last 50 messages
              </div>
            )}
            {displayedMessages.map((message, index) => (
              <div
                key={`${index}-${message.timestamp.getTime()}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 fade-in duration-500`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl'
                      : 'bg-muted shadow-sm hover:shadow-md hover:bg-muted/80'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start animate-in slide-in-from-bottom-3 fade-in duration-500">
                <div className="bg-muted rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground animate-pulse">Generating your code...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-gradient-to-b from-muted/20 to-muted/30 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to modify your project..."
                className="flex-1 px-4 py-3 bg-background/80 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/50 hover:shadow-md placeholder:text-muted-foreground/50"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={isGenerating || !input.trim()}
                className="px-5 py-3 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                <Send className={`h-5 w-5 ${isGenerating ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col bg-muted/30 min-h-[400px] lg:min-h-0">
          <div className="px-4 py-2 border-b border-border bg-muted/50 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              <span className="font-semibold">Preview</span>
            </div>
            {previewError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Security Error</span>
              </div>
            )}
          </div>
          <div className="flex-1 relative overflow-hidden">
            {previewError ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Preview Blocked
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {previewError}
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                    Please fix the security issues and click "Update Preview" to try again.
                  </p>
                </div>
              </div>
            ) : preview ? (
              <iframe
                srcDoc={preview}
                className="absolute inset-0 w-full h-full border-0 bg-[#0a0a0a]"
                sandbox="allow-scripts"
                title="Preview"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Preview Available</p>
                  <p className="text-sm">Click "Update Preview" to see your code in action</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
