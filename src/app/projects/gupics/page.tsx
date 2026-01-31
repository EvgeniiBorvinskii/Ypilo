'use client';

import type { Metadata } from 'next'
import { useState } from 'react'
import { ExternalLink, Play } from 'lucide-react'

export default function GupicsProject() {
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRunProject = async () => {
    setIsLoading(true)
    
    try {
      // Call API to start the Gupics project on the server
      const response = await fetch('/api/projects/gupics/start', {
        method: 'POST',
      })
      
      if (response.ok) {
        setIsRunning(true)
      }
    } catch (error) {
      console.error('Failed to start project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Gupics</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Quick picture editor and social network
          </p>
          
          <div className="bg-muted/30 rounded-lg p-8 border border-border mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <p className="text-muted-foreground mb-4">
              This project will be integrated as a plugin module. 
              The Gupics application will be loaded dynamically from the server.
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Status: <span className="text-green-600 font-medium">Active</span></p>
              <p>Type: <span className="font-medium">Image Editor & Social Platform</span></p>
              <p>Port: <span className="font-medium">5000</span></p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRunProject}
                disabled={isLoading || isRunning}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {isLoading ? 'Starting...' : isRunning ? 'Running' : 'Run Project'}
              </button>

              {isRunning && (
                <a
                  href="http://5.249.160.54:5000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in New Tab
                </a>
              )}
            </div>
          </div>

          {isRunning && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
              <div className="relative w-full bg-background rounded-lg overflow-hidden border border-border" style={{ height: '800px' }}>
                <iframe
                  src="http://5.249.160.54:5000"
                  className="w-full h-full"
                  title="Gupics Application"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}