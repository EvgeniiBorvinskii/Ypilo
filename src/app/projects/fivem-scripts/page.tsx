'use client';

import { ExternalLink } from 'lucide-react'

export default function FiveMLScriptsProject() {
  const handleRunProject = () => {
    window.open('https://keywest-shop.tebex.io/', '_blank')
  }

  const previewHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            font-size: 48px;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 30px;
          }
          .feature-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
          }
          .feature-card h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
          }
          .feature-card p {
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .badge {
            display: inline-block;
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎮 FiveM Scripts</h1>
          <p style="font-size: 20px; opacity: 0.95;">Professional custom scripts and modifications for your FiveM server</p>
          <span class="badge">✓ Active Development</span>
          
          <div class="features">
            <div class="feature-card">
              <h3>🚗 Vehicle Systems</h3>
              <p>Custom vehicle spawning, tuning, and management scripts</p>
            </div>
            <div class="feature-card">
              <h3>👥 Player Management</h3>
              <p>Advanced admin tools and player interaction systems</p>
            </div>
            <div class="feature-card">
              <h3>💰 Economy Scripts</h3>
              <p>Complete economy system with jobs and businesses</p>
            </div>
            <div class="feature-card">
              <h3>⚡ Performance</h3>
              <p>Optimized code for maximum server performance</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">FiveM Scripts</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Custom scripts and modifications for FiveM servers
          </p>
          
          <div className="bg-muted/30 rounded-lg p-8 border border-border mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <p className="text-muted-foreground mb-4">
              Professional-grade scripts and modifications designed specifically for FiveM servers.
              Our scripts include vehicle systems, player management tools, economy features, and performance optimizations.
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Status: <span className="text-green-600 font-medium">Active</span></p>
              <p>Type: <span className="font-medium">FiveM Server Scripts & Modifications</span></p>
              <p>Platform: <span className="font-medium">FiveM / GTA V</span></p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Custom vehicle spawning and management systems</li>
                <li>Advanced admin and moderation tools</li>
                <li>Complete economy system with jobs and businesses</li>
                <li>Player interaction and social features</li>
                <li>Optimized performance for large servers</li>
                <li>Regular updates and support</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRunProject}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Visit Shop
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            <div className="relative w-full bg-background rounded-lg overflow-hidden border border-border" style={{ height: '600px' }}>
              <div 
                className="absolute inset-0"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
                style={{ 
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  scale: '1'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
