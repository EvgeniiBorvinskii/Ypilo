import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lone Star Image Editor - Professional Image Editor | Ypilo',
  description: 'Professional-grade image editing suite with advanced features and plugin support.',
}

export default function LoneStarEditorProject() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Lone Star Image Editor</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Professional-grade image editing suite
          </p>
          
          <div className="bg-muted/30 rounded-lg p-8 border border-border mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <p className="text-muted-foreground mb-4">
              This project will be integrated as a plugin module. 
              The Lone Star Image Editor application will be loaded dynamically from the server.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Status: <span className="text-green-600 font-medium">Active</span></p>
              <p>Type: <span className="font-medium">Professional Image Editor</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}