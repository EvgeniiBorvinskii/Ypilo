'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Zap, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
      {/* Simplified background - no heavy animations */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent block mb-2">
                Ypilo
              </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                AI-Powered Code Generator
              </span>
              <br />
              <span className="text-foreground">
                Transform Ideas into Reality in Seconds
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The world's best platform for learning and understanding programming from scratch! 
            Experience the fastest way to learn and comprehend programming concepts. 
            Revolutionary AI-powered platform that generates production-ready websites, applications, 
            and programs instantly. No coding knowledge required - just describe what you want, and watch our 
            AI create fully functional code in real-time. Perfect for developers, entrepreneurs, students, and businesses 
            looking to accelerate their learning and development process.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="/projects"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
            >
              Try It Now - It's Free!
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-all duration-200"
            >
              See How It Works
            </a>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
              <Code2 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
              <p className="text-muted-foreground text-center">AI creates complete websites and apps in seconds</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Production Ready</h3>
              <p className="text-muted-foreground text-center">Clean, optimized code you can use immediately</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Coding Needed</h3>
              <p className="text-muted-foreground text-center">Just describe your idea - AI does the rest</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}