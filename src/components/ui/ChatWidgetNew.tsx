'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Mail } from 'lucide-react'
import { chatDataManager, type RealMessage } from '@/lib/chatData'

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
  const [currentDialog, setCurrentDialog] = useState<string | null>(null)
  const [messages, setMessages] = useState<RealMessage[]>([
    {
      id: '1',
      text: 'Добро пожаловать в Ypilo! Как мы можем вам помочь?',
      sender: 'admin',
      timestamp: Date.now()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen, isMinimized])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInfo.name.trim() || !userInfo.email.trim()) return

    setShowContactForm(false)
    
    // Обновляем приветственное сообщение с именем пользователя
    setMessages([{
      id: '1', 
      text: `Привет, ${userInfo.name}! Добро пожаловать в Ypilo. Чем могу помочь?`,
      sender: 'admin',
      timestamp: Date.now()
    }])

    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const messageText = inputMessage.trim()
    setInputMessage('')
    setIsTyping(true)

    // Добавляем сообщение пользователя
    const userMessage: RealMessage = {
      id: `msg_${Date.now()}_user`,
      text: messageText,
      sender: 'user',
      timestamp: Date.now(),
      userName: userInfo.name,
      isRead: false
    }

    setMessages(prev => [...prev, userMessage])

    // Если это первое сообщение пользователя, создаем диалог
    if (!currentDialog && chatDataManager) {
      const dialogId = chatDataManager.createUserDialog(
        userInfo.name || 'Гость', 
        userInfo.email || '', 
        messageText
      )
      setCurrentDialog(dialogId)
    } else if (currentDialog && chatDataManager) {
      // Добавляем сообщение в существующий диалог
      chatDataManager.addMessage(currentDialog, messageText, 'user', userInfo.name)
    }

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportResponses = [
        'Спасибо за ваше сообщение! Наш специалист свяжется с вами в ближайшее время.',
        'Благодарим за обращение. Мы рассмотрим ваш запрос и ответим как можно скорее.',
        'Ваше сообщение принято. Ожидайте ответ от нашей команды поддержки.',
        'Спасибо за интерес к Ypilo! Наш менеджер скоро с вами свяжется.',
        'Мы получили ваше сообщение. Специалист ответит вам в рабочее время.'
      ]

      const response = supportResponses[Math.floor(Math.random() * supportResponses.length)]
      
      const supportMessage: RealMessage = {
        id: `msg_${Date.now()}_support`,
        text: response,
        sender: 'admin',
        timestamp: Date.now(),
        isRead: true
      }

      setMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 2000) // Случайная задержка 1.5-3.5 секунд
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
          style={{ backgroundColor: primaryColor }}
        >
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
          <MessageCircle className="h-6 w-6 rotate-0 transform transition-transform duration-300" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ height: isMinimized ? '60px' : '500px' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 rounded-t-lg border-b border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {companyName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTyping ? 'Печатает...' : 'Обычно отвечаем в течение часа'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex flex-col h-full">
            {showContactForm ? (
              // Contact Form
              <div className="flex-1 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Давайте знакомиться!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Представьтесь, чтобы мы могли лучше вам помочь
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               dark:bg-gray-800 dark:text-white text-sm"
                      placeholder="Например: Александр"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email для связи
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               dark:bg-gray-800 dark:text-white text-sm"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Начать чат
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '350px' }}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                        }`}
                        style={{
                          backgroundColor: message.sender === 'user' ? primaryColor : undefined
                        }}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    {!userInfo.name && (
                      <button
                        type="button"
                        onClick={() => setShowContactForm(true)}
                        className="text-xs px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Представиться
                      </button>
                    )}
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                 dark:bg-gray-800 dark:text-white text-sm"
                        disabled={isTyping}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-white 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                               hover:scale-105"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isTyping ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}