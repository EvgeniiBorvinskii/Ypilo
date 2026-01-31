'use client'

import React, { useState, useEffect } from 'react'
import { AdminChatWidget } from '@/components/ui/AdminChatWidget'
import { ChatWidget } from '@/components/ui/ChatWidgetNew' 
import { StatisticsPanel } from '@/components/ui/StatisticsPanel'

export function ClientAdminProvider() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)

  useEffect(() => {
    const checkAdminStatus = () => {
      if (typeof window === 'undefined') return
      
      const adminToken = localStorage.getItem('admin_token')
      const loginTime = localStorage.getItem('admin_login_time')
      
      if (adminToken && loginTime) {
        const now = Date.now()
        const loginTimestamp = parseInt(loginTime)
        const hoursPassed = (now - loginTimestamp) / (1000 * 60 * 60)
        
        // Токен действует 24 часа
        if (hoursPassed < 24) {
          setIsAdmin(true)
          setShowStatistics(true) // Автоматически показываем статистику для админов
        } else {
          // Токен истек, очищаем
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_login_time')
          setIsAdmin(false)
          setShowStatistics(false)
        }
      } else {
        setIsAdmin(false)
        setShowStatistics(false)
      }
    }
    
    checkAdminStatus()
    
    // Слушаем изменения localStorage для немедленной активации
    const handleStorageChange = () => {
      checkAdminStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Проверяем статус каждые 5 секунд для быстрой активации
    const interval = setInterval(checkAdminStatus, 5000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleCloseStatistics = () => {
    setShowStatistics(false)
  }

  return (
    <>
      {isAdmin ? (
        <AdminChatWidget 
          companyName="Ypilo Admin"
          isVisible={true}
        />
      ) : (
        <ChatWidget 
          companyName="Ypilo Support"
        />
      )}
      
      <StatisticsPanel
        isVisible={showStatistics}
        onClose={handleCloseStatistics}
      />
    </>
  )
}