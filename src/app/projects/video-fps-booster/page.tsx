'use client'

import { ExternalLink } from 'lucide-react'

export default function VideoFPSBoosterProject() {
  const handleOpenProject = () => {
    window.open('https://videodownload.ypilo.com/', '_blank')
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Video FPS Booster</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Adding Frames - Advanced video frame interpolation
          </p>
          
          <div className="bg-muted/30 rounded-lg p-8 border border-border mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <p className="text-muted-foreground mb-4">
              Advanced video frame interpolation technology to boost video FPS and enhance smoothness.
              Our tool uses cutting-edge AI algorithms to generate intermediate frames, resulting in smoother video playback.
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Status: <span className="text-green-600 font-medium">Active</span></p>
              <p>Type: <span className="font-medium">Video Processing Tool</span></p>
              <p>Platform: <span className="font-medium">Web Application</span></p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>AI-powered frame interpolation for smoother video</li>
                <li>Boost video FPS from 30 to 60, 60 to 120, and more</li>
                <li>Advanced motion estimation algorithms</li>
                <li>Batch processing support for multiple videos</li>
                <li>High-quality output with minimal artifacts</li>
                <li>Fast processing with GPU acceleration</li>
              </ul>
            </div>

            <button
              onClick={handleOpenProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Open Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
