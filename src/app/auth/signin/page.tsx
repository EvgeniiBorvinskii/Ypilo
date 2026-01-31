'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl border border-border shadow-lg"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">Y</span>
          </div>
          <h2 className="text-3xl font-bold">Welcome to Ypilo</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to start creating with AI-powered code generation
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">What you get:</p>
          <ul className="space-y-1">
            <li>• AI-powered code generation in seconds</li>
            <li>• Create websites, apps, and programs instantly</li>
            <li>• Real-time AI assistant for debugging</li>
            <li>• Export and deploy your projects</li>
          </ul>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
