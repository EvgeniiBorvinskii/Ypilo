// Real Chat Data System - система для работы с реальными сообщениями
'use client'

import { useState, useEffect } from 'react'

export interface RealMessage {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: number
  userId?: string
  userName?: string
  isRead?: boolean
}

export interface RealDialog {
  id: string
  userId: string
  userName: string
  userEmail?: string
  lastMessage: string
  timestamp: number
  isActive: boolean
  unreadCount: number
  messages: RealMessage[]
  userInfo?: {
    browser?: string
    os?: string
    device?: string
    location?: string
    firstVisit?: number
  }
}

class ChatDataManager {
  private storageKey = 'bs_chat_dialogs'
  
  // Получить все диалоги
  getDialogs(): RealDialog[] {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return []
    
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  // Сохранить диалоги
  private saveDialogs(dialogs: RealDialog[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.storageKey, JSON.stringify(dialogs))
  }

  // Создать новый диалог от пользователя
  createUserDialog(userName: string, userEmail: string, initialMessage: string): string {
    const dialogs = this.getDialogs()
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    const dialogId = `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    
    const userInfo = this.getUserInfo()
    
    const newMessage: RealMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      text: initialMessage,
      sender: 'user',
      timestamp: Date.now(),
      userId,
      userName,
      isRead: false
    }

    const newDialog: RealDialog = {
      id: dialogId,
      userId,
      userName,
      userEmail,
      lastMessage: initialMessage,
      timestamp: Date.now(),
      isActive: true,
      unreadCount: 1,
      messages: [newMessage],
      userInfo
    }

    dialogs.unshift(newDialog) // Добавляем в начало для новых сообщений
    this.saveDialogs(dialogs)
    
    return dialogId
  }

  // Добавить сообщение в диалог
  addMessage(dialogId: string, text: string, sender: 'user' | 'admin', userName?: string): void {
    const dialogs = this.getDialogs()
    const dialogIndex = dialogs.findIndex(d => d.id === dialogId)
    
    if (dialogIndex === -1) return
    
    const newMessage: RealMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      text,
      sender,
      timestamp: Date.now(),
      userId: dialogs[dialogIndex].userId,
      userName: userName || dialogs[dialogIndex].userName,
      isRead: sender === 'admin' // Админские сообщения считаются прочитанными
    }

    dialogs[dialogIndex].messages.push(newMessage)
    dialogs[dialogIndex].lastMessage = text
    dialogs[dialogIndex].timestamp = Date.now()
    
    if (sender === 'user') {
      dialogs[dialogIndex].unreadCount += 1
      dialogs[dialogIndex].isActive = true
    }
    
    // Перемещаем диалог в начало списка при новом сообщении
    const updatedDialog = dialogs.splice(dialogIndex, 1)[0]
    dialogs.unshift(updatedDialog)
    
    this.saveDialogs(dialogs)
  }

  // Отметить сообщения как прочитанные
  markAsRead(dialogId: string): void {
    const dialogs = this.getDialogs()
    const dialog = dialogs.find(d => d.id === dialogId)
    
    if (!dialog) return
    
    dialog.messages.forEach(msg => {
      if (msg.sender === 'user') {
        msg.isRead = true
      }
    })
    
    dialog.unreadCount = 0
    this.saveDialogs(dialogs)
  }

  // Получить диалог по ID
  getDialog(dialogId: string): RealDialog | null {
    const dialogs = this.getDialogs()
    return dialogs.find(d => d.id === dialogId) || null
  }

  // Обновить статус активности диалога
  updateDialogActivity(dialogId: string, isActive: boolean): void {
    const dialogs = this.getDialogs()
    const dialog = dialogs.find(d => d.id === dialogId)
    
    if (!dialog) return
    
    dialog.isActive = isActive
    this.saveDialogs(dialogs)
  }

  // Получить информацию о пользователе (браузер, устройство и т.д.)
  private getUserInfo() {
    if (typeof window === 'undefined') return {}

    const ua = navigator.userAgent
    let browser = 'Unknown'
    let os = 'Unknown'
    let device = 'Desktop'

    // Определяем браузер
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
    else if (ua.includes('Edg')) browser = 'Edge'
    else if (ua.includes('Opera')) browser = 'Opera'

    // Определяем ОС
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    // Определяем устройство
    const width = window.innerWidth
    if (width <= 768) device = 'Mobile'
    else if (width <= 1024) device = 'Tablet'

    return {
      browser,
      os,
      device,
      location: 'Россия', // Можно интегрировать с IP API
      firstVisit: Date.now()
    }
  }

  // Получить статистику чата для админки
  getChatStatistics() {
    const dialogs = this.getDialogs()
    
    const totalDialogs = dialogs.length
    const activeDialogs = dialogs.filter(d => d.isActive).length
    const totalMessages = dialogs.reduce((sum, d) => sum + d.messages.length, 0)
    const unreadMessages = dialogs.reduce((sum, d) => sum + d.unreadCount, 0)
    
    // Статистика по времени
    const last24h = Date.now() - (24 * 60 * 60 * 1000)
    const dialogsLast24h = dialogs.filter(d => d.timestamp > last24h).length
    const messagesLast24h = dialogs
      .flatMap(d => d.messages)
      .filter(m => m.timestamp > last24h).length

    // Статистика по устройствам пользователей
    const deviceStats = dialogs.reduce((acc, dialog) => {
      const device = dialog.userInfo?.device || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalDialogs,
      activeDialogs,
      totalMessages,
      unreadMessages,
      dialogsLast24h,
      messagesLast24h,
      deviceStats,
      avgResponseTime: this.calculateAvgResponseTime(dialogs)
    }
  }

  private calculateAvgResponseTime(dialogs: RealDialog[]): string {
    const responseTimes: number[] = []
    
    dialogs.forEach(dialog => {
      for (let i = 1; i < dialog.messages.length; i++) {
        const current = dialog.messages[i]
        const previous = dialog.messages[i - 1]
        
        if (current.sender === 'admin' && previous.sender === 'user') {
          responseTimes.push(current.timestamp - previous.timestamp)
        }
      }
    })

    if (responseTimes.length === 0) return 'Н/Д'

    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const minutes = Math.floor(avgTime / 60000)
    const seconds = Math.floor((avgTime % 60000) / 1000)

    if (minutes > 0) {
      return `${minutes}м ${seconds}с`
    }
    return `${seconds}с`
  }

  // Очистить старые диалоги (старше 30 дней)
  cleanupOldDialogs(): void {
    const dialogs = this.getDialogs()
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    const activeDialogs = dialogs.filter(d => 
      d.timestamp > thirtyDaysAgo || d.isActive || d.unreadCount > 0
    )
    
    this.saveDialogs(activeDialogs)
  }

  // Экспорт данных для бэкапа
  exportData(): string {
    return JSON.stringify({
      dialogs: this.getDialogs(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2)
  }

  // Импорт данных из бэкапа
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.dialogs && Array.isArray(data.dialogs)) {
        this.saveDialogs(data.dialogs)
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

// Глобальный менеджер чата
export const chatDataManager = typeof window !== 'undefined' ? new ChatDataManager() : null

// Хук для работы с чатом
export const useChatData = () => {
  const [dialogs, setDialogs] = useState<RealDialog[]>([])
  const [chatStats, setChatStats] = useState<any>({
    totalDialogs: 0,
    activeDialogs: 0,
    avgResponseTime: '0м'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateData = () => {
      const currentDialogs = chatDataManager?.getDialogs() || []
      const currentStats = chatDataManager?.getChatStatistics() || {
        totalDialogs: 0,
        activeDialogs: 0,
        avgResponseTime: '0м'
      }
      setDialogs(currentDialogs)
      setChatStats(currentStats)
    }

    updateData()
    const interval = setInterval(updateData, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    dialogs,
    chatStats,
    addMessage: (dialogId: string, message: Omit<RealMessage, 'id' | 'timestamp'>) => {
      chatDataManager?.addMessage(dialogId, message.text, message.sender, message.userName)
      // Обновляем состояние
      const updatedDialogs = chatDataManager?.getDialogs() || []
      setDialogs(updatedDialogs)
    },
    markAsRead: (dialogId: string) => {
      chatDataManager?.markAsRead(dialogId)
      // Обновляем состояние
      const updatedDialogs = chatDataManager?.getDialogs() || []
      setDialogs(updatedDialogs)
    },
    manager: chatDataManager
  }
}