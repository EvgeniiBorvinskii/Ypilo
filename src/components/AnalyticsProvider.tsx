'use client'

import { useEffect } from 'react'
import { analyticsTracker } from '@/lib/analytics'

export function AnalyticsProvider() {
  useEffect(() => {
    // Analytics tracker автоматически инициализируется при создании
    // Дополнительные настройки могут быть здесь
  }, [])

  return null // Компонент не рендерит ничего, только инициализирует аналитику
}