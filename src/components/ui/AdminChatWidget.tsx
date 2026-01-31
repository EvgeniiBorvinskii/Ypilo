'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Search, Users, Bell } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'
import { useChatData, RealDialog, RealMessage } from '@/lib/chatData'
import { seedChatData } from '@/lib/seedChatData'

interface AdminChatWidgetProps {
  isVisible?: boolean
  onClose?: () => void
  companyName?: string
}

export function AdminChatWidget({ 
  isVisible = false, 
  onClose,
  companyName = 'Ypilo Admin'
}: AdminChatWidgetProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')
  const [selectedDialog, setSelectedDialog] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const { tracker, getAnalyticsData } = useAnalytics()
  const { dialogs, chatStats, addMessage, markAsRead } = useChatData()

  // Обновляем данные каждые 5 секунд
  useEffect(() => {
    if (!isVisible) return
    
    // Инициализируем тестовые данные при первом запуске
    seedChatData()
    
    const interval = setInterval(() => {
      // Данные обновляются автоматически через хуки
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isVisible])

  const activeDialogs = (dialogs || []).filter((d: RealDialog) => d.isActive)
  const inactiveDialogs = (dialogs || []).filter((d: RealDialog) => !d.isActive)
  const currentDialogs = activeTab === 'active' ? activeDialogs : inactiveDialogs

  // Фильтрация диалогов по поисковому запросу
  const filteredDialogs = (currentDialogs || []).filter((dialog: RealDialog) => {
    if (!searchQuery) return true
    
    return (
      dialog.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dialog.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dialog.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const selectedDialogData = (dialogs || []).find((d: RealDialog) => d.id === selectedDialog)

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDialog) return

    try {
      await addMessage(selectedDialog, {
        text: newMessage,
        sender: 'admin',
        isRead: true
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isVisible) return null

  // Если свернут, показываем только маленькую кнопку
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="liquid-glass-card p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 relative group"
        >
          <MessageCircle className="w-6 h-6 text-blue-400" />
          {(chatStats?.totalUnread || 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {chatStats.totalUnread}
            </span>
          )}
          {/* Floating particles effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-1 left-1 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] liquid-glass-card shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="liquid-glass bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-t-2xl flex justify-between items-center relative overflow-hidden">
        {/* Header background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <div className="p-1.5 liquid-glass rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-semibold glass-text">{companyName}</span>
          {(chatStats?.totalUnread || 0) > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              {chatStats.totalUnread}
            </span>
          )}
        </div>
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => setIsMinimized(true)}
            className="glass-text glass-hover p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="glass-text glass-hover p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex liquid-glass-light border-b border-white/10">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'active'
              ? 'border-blue-400 text-blue-400 liquid-glass'
              : 'border-transparent glass-text-muted hover:text-white'
          }`}
          onClick={() => setActiveTab('active')}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="p-1 liquid-glass rounded">
              <Users className="w-4 h-4" />
            </div>
            Active ({activeDialogs.length})
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'inactive'
              ? 'border-blue-400 text-blue-400 liquid-glass'
              : 'border-transparent glass-text-muted hover:text-white'
          }`}
          onClick={() => setActiveTab('inactive')}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="p-1 liquid-glass rounded">
              <Bell className="w-4 h-4" />
            </div>
            Archive ({inactiveDialogs.length})
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 liquid-glass-light border-b border-white/10">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 liquid-glass rounded">
            <Search className="text-blue-400 w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search dialogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="liquid-glass-input pl-12 text-sm"
          />
        </div>
      </div>

      {!selectedDialog ? (
        /* Dialog List */
                <div className="flex-1 overflow-y-auto">
          {filteredDialogs.length > 0 ? (
            filteredDialogs.map((dialog: RealDialog) => (
              <div
                key={dialog.id}
                className="p-4 border-b border-white/10 liquid-glass-light hover:liquid-glass cursor-pointer transition-all duration-300 group"
                onClick={() => {
                  setSelectedDialog(dialog.id)
                  if (dialog.unreadCount > 0) {
                    markAsRead(dialog.id)
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium glass-text group-hover:text-blue-400 transition-colors">{dialog.userName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs glass-text-muted">
                      {formatTime(dialog.timestamp)}
                    </span>
                    {dialog.unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {dialog.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                {dialog.userEmail && (
                  <div className="text-xs glass-text-muted mb-1">{dialog.userEmail}</div>
                )}
                <div className="text-sm glass-text-muted truncate group-hover:text-white transition-colors">
                  {dialog.lastMessage}
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center glass-text-muted">
              <div className="text-center p-8">
                <div className="liquid-glass p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm">
                  {searchQuery ? 'No dialogs found' : 'No dialogs'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chat View */
        <>
          {/* Chat Header */}
          <div className="p-3 border-b border-white/10 liquid-glass">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedDialog(null)}
                  className="text-blue-400 hover:text-blue-300 text-sm mb-1 liquid-glass-btn py-1 px-2 text-xs"
                >
                  ← Back to list
                </button>
                <div className="font-medium glass-text">
                  {selectedDialogData?.userName || 'Unknown User'}
                </div>
                {selectedDialogData?.userEmail && (
                  <div className="text-xs glass-text-muted">
                    {selectedDialogData.userEmail}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 liquid-glass-light">
            {selectedDialogData?.messages && selectedDialogData.messages.length > 0 ? (
              selectedDialogData.messages.map((message: RealMessage) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl liquid-glass-card transition-all duration-300 hover:scale-105 ${
                      message.sender === 'admin'
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white'
                        : 'glass-text'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full glass-text-muted">
                <div className="text-center">
                  <div className="liquid-glass p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-sm">Start conversation</p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 liquid-glass">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="liquid-glass-input flex-1 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="liquid-glass-btn p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
