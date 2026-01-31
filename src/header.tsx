'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon, LogIn, ChevronDown, MousePointer2 } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cursorEnabled, setCursorEnabled] = useState(true)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Load cursor preference
    const saved = localStorage.getItem('customCursorEnabled')
    if (saved !== null) {
      setCursorEnabled(saved === 'true')
    }
  }, [])

  useEffect(() => {
    // Apply cursor setting
    if (typeof window !== 'undefined') {
      const cursor = document.querySelector('.custom-cursor-wrapper')
      if (cursor) {
        (cursor as HTMLElement).style.display = cursorEnabled ? 'block' : 'none'
      }
      document.body.style.cursor = cursorEnabled ? 'none' : 'auto'
    }
  }, [cursorEnabled])

  const toggleCursor = () => {
    const newValue = !cursorEnabled
    setCursorEnabled(newValue)
    localStorage.setItem('customCursorEnabled', String(newValue))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigation = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Projects', href: '/projects', glow: true },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 logo-container">
              <div className="relative">
                <div className="logo-glow"></div>
                <div className="logo-shadow"></div>
                <div className="logo-highlight"></div>
                <Image
                  src="/images/logos/ypilo.png"
                  alt="Ypilo"
                  width={240}
                  height={90}
                  className={`h-16 w-auto logo-image ${theme === 'light' ? 'invert' : ''}`}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-foreground hover:text-primary transition-colors duration-200 ${
                  item.glow ? 'text-shadow-glow' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        toggleCursor()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <MousePointer2 className="h-4 w-4" />
                        Custom Cursor
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${cursorEnabled ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {cursorEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        signOut()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors border-t border-border"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
            
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {session ? (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center px-3 py-2 mb-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 mr-3">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
              )}
              
              {/* Mobile Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors w-full"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}