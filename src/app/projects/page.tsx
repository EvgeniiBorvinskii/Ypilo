'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { 
  Image as ImageIcon, 
  Video, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Code,
  User,
  Calendar,
  Plus
} from 'lucide-react'

const companyProjects = [
  {
    id: 'gupics',
    name: 'Gupics',
    description: 'Quick picture editor and social network',
    icon: ImageIcon,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-600',
    status: 'Active',
    features: ['Image Editing', 'Social Network', 'Real-time Collaboration'],
    path: '/projects/gupics'
  },
  {
    id: 'video-fps-booster',
    name: 'Video FPS Booster',
    description: 'Adding Frames - Advanced video frame interpolation',
    icon: Video,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600',
    status: 'Active',
    features: ['Frame Interpolation', 'AI Enhancement', 'Batch Processing'],
    path: '/projects/video-fps-booster'
  },
  {
    id: 'lone-star-editor',
    name: 'Lone Star Image Editor',
    description: 'Professional-grade image editing suite',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600',
    status: 'Active',
    features: ['Advanced Editing', 'Layer Support', 'Plugin System'],
    path: '/projects/lone-star-editor'
  },
  {
    id: 'fivem-scripts',
    name: 'FiveM Scripts',
    description: 'Custom scripts and modifications for FiveM servers',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    status: 'Active',
    features: ['Server Scripts', 'Custom Mods', 'Performance Optimization'],
    path: '/projects/fivem-scripts'
  }
]

export default function ProjectsPage() {
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchPublicProjects()
  }, [])

  const fetchPublicProjects = async () => {
    try {
      const res = await fetch('/api/projects/public')
      if (res.ok) {
        const data = await res.json()
        setUserProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching public projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our portfolio of innovative solutions and cutting-edge applications 
            designed to solve real-world problems.
          </p>
          
          {/* Create Project Button for authenticated users */}
          {session && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your AI Project
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Company Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Company Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {project.external ? (
                  <a href={project.path} target="_blank" rel="noopener noreferrer">
                    <div className={`group h-full p-8 rounded-xl ${project.bgColor} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer`}>
                      <div className={`mb-6 inline-flex p-4 rounded-lg bg-gradient-to-r ${project.color}`}>
                        <project.icon className="h-8 w-8 text-white" />
                      </div>

                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${project.bgColor} ${project.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${project.textColor.replace('text-', 'bg-')} mr-2 animate-pulse`} />
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="inline-flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        Visit Store
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link href={project.path}>
                    <div className={`group h-full p-8 rounded-xl ${project.bgColor} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer`}>
                      <div className={`mb-6 inline-flex p-4 rounded-lg bg-gradient-to-r ${project.color}`}>
                        <project.icon className="h-8 w-8 text-white" />
                      </div>

                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${project.bgColor} ${project.textColor}`}>
                          <span className={`w-2 h-2 rounded-full ${project.textColor.replace('text-', 'bg-')} mr-2 animate-pulse`} />
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="inline-flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        View Project
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Projects Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading community projects...</p>
          </div>
        ) : userProjects.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Community Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/projects/view/${project.id}`}>
                    <div className="group h-full flex flex-col rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden">
                      {/* Preview Image */}
                      {project.preview && (
                        <div className="relative h-48 bg-muted/30 border-b border-border overflow-hidden">
                          <div 
                            className="absolute inset-0"
                            dangerouslySetInnerHTML={{ __html: project.preview }}
                            style={{ 
                              transformOrigin: 'center center',
                              pointerEvents: 'none',
                              overflow: 'hidden',
                              scale: '1'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 self-start">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>

                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {project.name}
                        </h3>

                        {project.description && (
                          <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4 mt-auto">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-2" />
                            {project.user?.name || 'Anonymous'}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-2" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="inline-flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                          View Project
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center p-8 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Have a Project Idea?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for new challenges. Let's discuss how we can bring your vision to life.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
          >
            Start a Project
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
