// Analytics System для отслеживания реальных данных пользователей
'use client'

interface VisitorData {
  id: string
  timestamp: number
  page: string
  referrer: string
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  sessionId: string
  isReturning: boolean
}

interface PageView {
  page: string
  timestamp: number
  sessionId: string
  duration?: number
}

interface UserSession {
  sessionId: string
  startTime: number
  endTime?: number
  pages: PageView[]
  userAgent: string
  referrer: string
}

class AnalyticsTracker {
  private sessionId: string
  private startTime: number
  private currentPage: string
  private pageStartTime: number

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()
    this.currentPage = typeof window !== 'undefined' ? window.location.pathname : '/'
    this.pageStartTime = Date.now()

    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server-session'
    
    let sessionId = sessionStorage.getItem('bs_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('bs_session_id', sessionId)
    }
    return sessionId
  }

  private getBrowserInfo() {
    if (typeof window === 'undefined') return {}

    const ua = navigator.userAgent
    let browser = 'Unknown'
    let os = 'Unknown'

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

    return { browser, os }
  }

  private getDeviceType() {
    if (typeof window === 'undefined') return 'Unknown'

    const width = window.innerWidth
    if (width <= 768) return 'Mobile'
    else if (width <= 1024) return 'Tablet'
    return 'Desktop'
  }

  private initializeTracking() {
    this.trackVisitor()
    this.trackPageView()
    
    // Отслеживание ухода со страницы
    window.addEventListener('beforeunload', () => {
      this.trackPageExit()
    })

    // Отслеживание смены страниц (для SPA)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      this.trackPageExit()
      originalPushState.apply(history, args)
      setTimeout(() => {
        this.currentPage = window.location.pathname
        this.pageStartTime = Date.now()
        this.trackPageView()
      }, 100)
    }

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      this.currentPage = window.location.pathname
      this.trackPageView()
    }

    // Отслеживание активности пользователя
    let lastActivity = Date.now()
    const updateActivity = () => {
      lastActivity = Date.now()
    }

    document.addEventListener('mousemove', updateActivity)
    document.addEventListener('keypress', updateActivity)
    document.addEventListener('scroll', updateActivity)
    document.addEventListener('click', updateActivity)
  }

  private trackVisitor() {
    const visitorId = this.getOrCreateVisitorId()
    const { browser, os } = this.getBrowserInfo()
    
    const visitorData: VisitorData = {
      id: visitorId,
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      sessionId: this.sessionId,
      isReturning: this.isReturningVisitor()
    }

    this.saveVisitorData(visitorData)
    this.updateDailyStats(browser, os, this.getDeviceType())
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('bs_visitor_id')
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('bs_visitor_id', visitorId)
    }
    return visitorId
  }

  private isReturningVisitor(): boolean {
    const lastVisit = localStorage.getItem('bs_last_visit')
    localStorage.setItem('bs_last_visit', Date.now().toString())
    return !!lastVisit
  }

  private trackPageView() {
    const pageView: PageView = {
      page: this.currentPage,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.savePageView(pageView)
    this.updateHourlyTraffic()
  }

  private trackPageExit() {
    const duration = Date.now() - this.pageStartTime
    const pageViews = this.getPageViews()
    const updatedViews = pageViews.map(view => {
      if (view.page === this.currentPage && view.sessionId === this.sessionId && !view.duration) {
        return { ...view, duration }
      }
      return view
    })
    localStorage.setItem('bs_page_views', JSON.stringify(updatedViews))
  }

  private saveVisitorData(data: VisitorData) {
    const visitors = this.getVisitors()
    visitors.push(data)
    localStorage.setItem('bs_visitors', JSON.stringify(visitors))
  }

  private savePageView(data: PageView) {
    const pageViews = this.getPageViews()
    pageViews.push(data)
    localStorage.setItem('bs_page_views', JSON.stringify(pageViews))
  }

  private updateDailyStats(browser: string, os: string, device: string) {
    const stats = this.getDailyStats()
    const today = new Date().toDateString()
    
    if (!stats[today]) {
      stats[today] = {
        visitors: 0,
        pageViews: 0,
        browsers: {},
        os: {},
        devices: {},
        referrers: {}
      }
    }
    
    stats[today].visitors += 1
    stats[today].browsers[browser] = (stats[today].browsers[browser] || 0) + 1
    stats[today].os[os] = (stats[today].os[os] || 0) + 1
    stats[today].devices[device] = (stats[today].devices[device] || 0) + 1
    
    const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct'
    stats[today].referrers[referrer] = (stats[today].referrers[referrer] || 0) + 1
    
    localStorage.setItem('bs_daily_stats', JSON.stringify(stats))
  }

  private updateHourlyTraffic() {
    const hourlyData = this.getHourlyTraffic()
    const now = new Date()
    const hour = now.getHours()
    const today = now.toDateString()
    
    if (!hourlyData[today]) {
      hourlyData[today] = Array(24).fill(0)
    }
    
    hourlyData[today][hour] += 1
    localStorage.setItem('bs_hourly_traffic', JSON.stringify(hourlyData))
  }

  // Публичные методы для получения данных
  getVisitors(): VisitorData[] {
    const data = localStorage.getItem('bs_visitors')
    return data ? JSON.parse(data) : []
  }

  getPageViews(): PageView[] {
    const data = localStorage.getItem('bs_page_views')
    return data ? JSON.parse(data) : []
  }

  getDailyStats(): Record<string, any> {
    const data = localStorage.getItem('bs_daily_stats')
    return data ? JSON.parse(data) : {}
  }

  getHourlyTraffic(): Record<string, number[]> {
    const data = localStorage.getItem('bs_hourly_traffic')
    return data ? JSON.parse(data) : {}
  }

  // Получение аналитических данных для админки
  getAnalyticsData() {
    const visitors = this.getVisitors()
    const pageViews = this.getPageViews()
    const dailyStats = this.getDailyStats()
    const hourlyTraffic = this.getHourlyTraffic()
    
    const today = new Date().toDateString()
    const todayStats = dailyStats[today] || { 
      visitors: 0, 
      pageViews: 0, 
      browsers: {}, 
      os: {}, 
      devices: {}, 
      referrers: {} 
    }
    
    // Подсчет уникальных посетителей за последние 30 дней
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const uniqueVisitors = new Set(
      visitors
        .filter(v => v.timestamp > thirtyDaysAgo)
        .map(v => v.id)
    ).size

    // Топ страниц
    const pageViewCounts = pageViews.reduce((acc, view) => {
      acc[view.page] = (acc[view.page] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageViewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }))

    // Статистика браузеров
    const browserStats = Object.entries(todayStats.browsers || {})
      .map(([browser, count]) => ({
        browser,
        percentage: Number(((count as number / todayStats.visitors) * 100).toFixed(1))
      }))
      .sort((a, b) => b.percentage - a.percentage)

    // Статистика устройств
    const deviceStats = Object.entries(todayStats.devices || {})
      .map(([device, count]) => ({
        device,
        percentage: Number(((count as number / todayStats.visitors) * 100).toFixed(1))
      }))
      .sort((a, b) => b.percentage - a.percentage)

    // Источники трафика
    const trafficSources = Object.entries(todayStats.referrers || {})
      .map(([source, visitors]) => ({ 
        source: source === 'direct' ? 'Direct Traffic' : source,
        visitors: visitors as number 
      }))
      .sort((a, b) => b.visitors - a.visitors)

    // Часовая статистика за сегодня
    const todayHourly = hourlyTraffic[today] || Array(24).fill(0)
    const hourlyTrafficFormatted = todayHourly.map((visitors, hour) => ({
      hour: hour.toString().padStart(2, '0'),
      visitors
    }))

    return {
      totalVisitors: visitors.length,
      uniqueVisitors,
      pageViews: pageViews.length,
      bounceRate: this.calculateBounceRate(pageViews),
      avgSessionDuration: this.calculateAvgSessionDuration(pageViews),
      topPages,
      browserStats,
      deviceStats,
      trafficSources,
      hourlyTraffic: hourlyTrafficFormatted
    }
  }

  private calculateBounceRate(pageViews: PageView[]): number {
    const sessions = pageViews.reduce((acc, view) => {
      if (!acc[view.sessionId]) {
        acc[view.sessionId] = []
      }
      acc[view.sessionId].push(view)
      return acc
    }, {} as Record<string, PageView[]>)

    const totalSessions = Object.keys(sessions).length
    const bouncedSessions = Object.values(sessions).filter(views => views.length === 1).length
    
    return totalSessions > 0 ? Number(((bouncedSessions / totalSessions) * 100).toFixed(1)) : 0
  }

  private calculateAvgSessionDuration(pageViews: PageView[]): string {
    const sessions = pageViews.reduce((acc, view) => {
      if (!acc[view.sessionId]) {
        acc[view.sessionId] = []
      }
      acc[view.sessionId].push(view)
      return acc
    }, {} as Record<string, PageView[]>)

    const durations = Object.values(sessions).map(views => {
      if (views.length < 2) return 0
      const start = Math.min(...views.map(v => v.timestamp))
      const end = Math.max(...views.map(v => v.timestamp))
      return end - start
    }).filter(d => d > 0)

    if (durations.length === 0) return '00:00'

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    const minutes = Math.floor(avgDuration / 60000)
    const seconds = Math.floor((avgDuration % 60000) / 1000)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

// Глобальный экземпляр трекера
export const analyticsTracker = typeof window !== 'undefined' ? new AnalyticsTracker() : null

// Хук для использования аналитики в компонентах
export const useAnalytics = () => {
  return {
    tracker: analyticsTracker,
    getAnalyticsData: () => analyticsTracker?.getAnalyticsData() || null
  }
}