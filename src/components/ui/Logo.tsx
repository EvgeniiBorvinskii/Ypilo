'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'icon' | 'horizontal' | 'wide' | 'large'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  href?: string
  showText?: boolean
}

const logoVariants = {
  icon: '/images/logos/ypilo-icon.png',
  horizontal: '/images/logos/ypilo-logo.png', 
  wide: '/images/logos/ypilo-logo-wide.png',
  large: '/images/logos/ypilo-logo-large.png'
}

const sizeClasses = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto', 
  lg: 'h-16 w-auto',
  xl: 'h-24 w-auto'
}

export default function Logo({ 
  variant = 'horizontal', 
  size = 'md', 
  className = '',
  href = '/',
  showText = false 
}: LogoProps) {
  const logoSrc = logoVariants[variant]
  
  const LogoImage = () => (
    <div className={`flex items-center space-x-3 ${className} relative z-[60]`}>
      <Image
        src={logoSrc}
        alt="Ypilo Logo"
        width={variant === 'icon' ? 60 : variant === 'wide' ? 200 : 120}
        height={variant === 'icon' ? 60 : variant === 'wide' ? 30 : 60}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
      {showText && variant === 'icon' && (
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Ypilo
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoImage />
      </Link>
    )
  }

  return <LogoImage />
}