'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, Minimize2, Maximize2, TrendingUp, Users, Eye, 
  Globe, Clock, Activity, BarChart3, PieChart, Calendar
} from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

interface StatisticsData {
  totalVisitors: number
  uniqueVisitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: string
  topPages: Array<{ page: string; views: number }>
  browserStats: Array<{ browser: string; percentage: number }>
  deviceStats: Array<{ device: string; percentage: number }>
  trafficSources: Array<{ source: string; visitors: number }>
  hourlyTraffic: Array<{ hour: string; visitors: number }>
}

interface StatisticsPanelProps {
  isVisible?: boolean
  onClose?: () => void
  primaryColor?: string
}

export function StatisticsPanel({ 
  isVisible = false, 
  onClose,
  primaryColor = '#3B82F6' 
}: StatisticsPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'devices'>('overview')
  const [data, setData] = useState<StatisticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: '00:00',
    topPages: [],
    browserStats: [],
    deviceStats: [],
    trafficSources: [],
    hourlyTraffic: []
  })
  const [isLoading, setIsLoading] = useState(true)
  
  const { getAnalyticsData } = useAnalytics()

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true)
      
      // Загружаем реальные данные аналитики
      const realData = getAnalyticsData()
      
      if (realData) {
        setData({
          totalVisitors: realData.totalVisitors,
          uniqueVisitors: realData.uniqueVisitors,
          pageViews: realData.pageViews,
          bounceRate: realData.bounceRate,
          avgSessionDuration: realData.avgSessionDuration,
          topPages: realData.topPages,
          browserStats: realData.browserStats,
          deviceStats: realData.deviceStats,
          trafficSources: realData.trafficSources,
          hourlyTraffic: realData.hourlyTraffic
        })
      } else {
        // Показываем пустое состояние, если нет данных
        setData({
          totalVisitors: 0,
          uniqueVisitors: 0,
          pageViews: 0,
          bounceRate: 0,
          avgSessionDuration: '00:00',
          topPages: [],
          browserStats: [],
          deviceStats: [],
          trafficSources: [],
          hourlyTraffic: []
        })
      }
      
      setIsLoading(false)
    }
  }, [isVisible, getAnalyticsData])

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU')
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage > 70) return 'bg-green-500'
    if (percentage > 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ease-out transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Аналитика сайта</h3>
              <p className="text-white/80 text-xs">Статистика посещений</p>
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
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Обзор
              </button>
              <button
                onClick={() => setActiveTab('traffic')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'traffic'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Трафик
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'devices'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Устройства
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 max-h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Загрузка данных...</p>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Основные метрики */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Посетители</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mt-1">{formatNumber(data.totalVisitors)}</p>
                          <p className="text-xs text-gray-500">+12% к прошлому месяцу</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Просмотры</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600 mt-1">{formatNumber(data.pageViews)}</p>
                          <p className="text-xs text-gray-500">+8% к прошлому месяцу</p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Время на сайте</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600 mt-1">{data.avgSessionDuration}</p>
                          <p className="text-xs text-gray-500">+15% к прошлому месяцу</p>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Отказы</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600 mt-1">{data.bounceRate}%</p>
                          <p className="text-xs text-gray-500">-5% к прошлому месяцу</p>
                        </div>
                      </div>

                      {/* Топ страниц */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Популярные страницы
                        </h4>
                        <div className="space-y-2">
                          {data.topPages.map((page, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {page.page === '/' ? 'Главная' : page.page}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatNumber(page.views)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'traffic' && (
                    <div className="space-y-4">
                      {/* Источники трафика */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Источники трафика
                        </h4>
                        <div className="space-y-3">
                          {data.trafficSources.map((source, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {source.source}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatNumber(source.visitors)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor((source.visitors / data.totalVisitors) * 100)}`}
                                  style={{
                                    width: `${(source.visitors / data.totalVisitors) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Часовая статистика */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Активность по часам
                        </h4>
                        <div className="flex items-end space-x-1 h-20">
                          {data.hourlyTraffic.map((hour, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div
                                className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300"
                                style={{
                                  height: `${(hour.visitors / Math.max(...data.hourlyTraffic.map(h => h.visitors))) * 60}px`
                                }}
                              ></div>
                              <span className="text-xs text-gray-500 mt-1">{hour.hour}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'devices' && (
                    <div className="space-y-4">
                      {/* Статистика браузеров */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Браузеры
                        </h4>
                        <div className="space-y-3">
                          {data.browserStats.map((browser, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {browser.browser}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {browser.percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(browser.percentage)}`}
                                  style={{ width: `${browser.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Статистика устройств */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <PieChart className="w-4 h-4 mr-2" />
                          Устройства
                        </h4>
                        <div className="space-y-3">
                          {data.deviceStats.map((device, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {device.device}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {device.percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(device.percentage)}`}
                                  style={{ width: `${device.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}