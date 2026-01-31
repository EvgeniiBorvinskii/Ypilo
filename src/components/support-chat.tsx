'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User, UserCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface SupportMessage {
  id: string
  message: string
  response?: string | null
  createdAt: string
  respondedAt?: string | null
}

export function SupportChat() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && session?.user) {
      loadMessages()
      // Poll for new responses every 10 seconds
      const interval = setInterval(loadMessages, 10000)
      return () => clearInterval(interval)
    }
  }, [isOpen, session])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/support/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !session?.user) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (response.ok) {
        await loadMessages()
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:animate-bounce" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-background border rounded-lg shadow-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Support Chat</h3>
                <p className="text-xs opacity-90">Chat with our team</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 bg-muted/30 overflow-y-auto space-y-4">
            {!session?.user ? (
              <div className="bg-background shadow-sm border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Please sign in to chat with support
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-background shadow-sm border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  👋 Hi! Send us a message and our team will respond as soon as possible.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3">
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Admin Response */}
                  {msg.response && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-background shadow-sm border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600">Support Team</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                        {msg.respondedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.respondedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            {session?.user ? (
              <div className="flex space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 bg-background text-foreground"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground">
                Sign in to send messages
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
