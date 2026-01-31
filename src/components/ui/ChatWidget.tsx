'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Mail } from 'lucide-react'
import { chatDataManager, type RealMessage } from '@/lib/chatData'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support'
  timestamp: Date
}

interface ChatWidgetProps {
  companyName?: string
  primaryColor?: string
}

export function ChatWidget({ 
  companyName = 'Ypilo Support',
  primaryColor = '#3B82F6'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! Welcome to Ypilo. How can we help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    
    // Simulate typing indicator
    setIsTyping(true)
    
    // Simulate auto-response
    setTimeout(() => {
      setIsTyping(false)
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to browse our services or check our FAQ.",
        sender: 'support',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, autoResponse])
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }
    }, 1500)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      <div
        className={`absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ height: isMinimized ? '60px' : '500px' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{companyName}</h3>
              <p className="text-white/80 text-xs">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    } animate-slideIn`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none animate-pulse">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
          isOpen ? 'rotate-0' : 'rotate-0 hover:rotate-12'
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </div>
        
        {/* Notification Badge */}
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        
        {/* Pulse Animation */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: primaryColor }}></div>
        )}
      </button>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}