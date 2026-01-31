'use client'

import React, { useEffect } from 'react'

export function AutoScroll() {
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null
    let scrollDirection: 'up' | 'down' | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const { clientY, clientX } = e
      const { innerHeight, innerWidth } = window
      
      // Зоны для автоскроллинга
      const scrollZone = 80 // px от края
      const scrollSpeed = 2 // px за раз
      
      // Очищаем предыдущий интервал
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = null
      }
      
      // Проверяем, находится ли курсор в зонах автоскроллинга
      if (clientY <= scrollZone && clientX > 100 && clientX < innerWidth - 100) {
        // Верхняя зона - скроллим вверх
        scrollDirection = 'up'
        scrollInterval = setInterval(() => {
          window.scrollBy({
            top: -scrollSpeed,
            behavior: 'auto'
          })
        }, 10)
      } else if (clientY >= innerHeight - scrollZone && clientX > 100 && clientX < innerWidth - 100) {
        // Нижняя зона - скроллим вниз
        scrollDirection = 'down'
        scrollInterval = setInterval(() => {
          window.scrollBy({
            top: scrollSpeed,
            behavior: 'auto'
          })
        }, 10)
      } else {
        scrollDirection = null
      }
    }

    const handleMouseLeave = () => {
      // Останавливаем скроллинг когда курсор покидает окно
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = null
      }
      scrollDirection = null
    }

    // Добавляем обработчики событий
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup при размонтировании компонента
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (scrollInterval) {
        clearInterval(scrollInterval)
      }
    }
  }, [])

  return null // Этот компонент не рендерит ничего видимого
}