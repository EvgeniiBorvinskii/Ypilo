'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, 
  Smartphone, 
  Globe, 
  Palette, 
  Bot, 
  Database,
  Cloud,
  Lock,
  ArrowRight
} from 'lucide-react'

const services = [
  {
    icon: Code2,
    title: 'AI Code Generation',
    description: 'Describe your application in plain English and watch as our AI generates clean, production-ready code instantly. From simple scripts to complex applications.',
    features: ['JavaScript & TypeScript', 'Python & Java', 'HTML/CSS Frameworks', 'Complete Applications'],
    color: 'text-blue-600',
    gradient: 'from-blue-500/10 to-blue-600/10'
  },
  {
    icon: Globe,
    title: 'Instant Website Builder',
    description: 'Create fully functional, responsive websites in seconds. Our AI understands design principles and generates beautiful, SEO-optimized sites ready for deployment.',
    features: ['Responsive Design', 'SEO Optimized', 'Modern Frameworks', 'Custom Styling'],
    color: 'text-purple-600',
    gradient: 'from-purple-500/10 to-purple-600/10'
  },
  {
    icon: Smartphone,
    title: 'App Generator',
    description: 'Generate complete web applications with backend logic, database schemas, and interactive frontends. Perfect for prototyping or production use.',
    features: ['Full-Stack Apps', 'Database Integration', 'API Development', 'Real-time Updates'],
    color: 'text-green-600',
    gradient: 'from-green-500/10 to-green-600/10'
  },
  {
    icon: Bot,
    title: 'Smart AI Assistant',
    description: 'Chat with our intelligent AI to refine, debug, and enhance your code in real-time. Get instant answers to programming questions and code suggestions.',
    features: ['Code Debugging', 'Best Practices', 'Performance Tips', 'Real-time Chat'],
    color: 'text-pink-600',
    gradient: 'from-pink-500/10 to-pink-600/10'
  },
  {
    icon: Palette,
    title: 'UI/UX Generation',
    description: 'Create stunning user interfaces with AI-powered design generation. Get pixel-perfect layouts that follow modern design trends and accessibility standards.',
    features: ['Modern UI Design', 'Component Libraries', 'Design Systems', 'Dark/Light Themes'],
    color: 'text-orange-600',
    gradient: 'from-orange-500/10 to-orange-600/10'
  },
  {
    icon: Cloud,
    title: 'Deployment Ready',
    description: 'All generated code is production-ready and optimized for performance. Export your projects and deploy to any hosting platform instantly.',
    features: ['Optimized Code', 'Best Practices', 'Export Options', 'Version Control'],
    color: 'text-cyan-600',
    gradient: 'from-cyan-500/10 to-cyan-600/10'
  }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ypilo Can Do</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Powered by cutting-edge AI technology, Ypilo transforms your ideas into production-ready 
            code instantly. From simple web pages to complex applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`group p-8 rounded-xl bg-gradient-to-br ${service.gradient} backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <service.icon className={`h-12 w-12 ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`} />
              
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a
                href="/projects"
                className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors duration-200 group-hover:translate-x-1 transform"
              >
                Try It Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
          >
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}