'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Zap,
  Users,
  Award,
  Clock,
  HeadphonesIcon
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate complete applications in seconds, not days or weeks. Our AI understands your requirements and creates production-ready code instantly.',
    color: 'text-yellow-600'
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'All generated code follows industry best practices, is thoroughly tested, and ready to deploy. No messy code or security vulnerabilities.',
    color: 'text-green-600'
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Whether you\'re a professional developer or complete beginner, Ypilo makes software development accessible to all skill levels.',
    color: 'text-blue-600'
  },
  {
    icon: Award,
    title: 'Modern Technologies',
    description: 'Generate code using the latest frameworks and technologies. From React to Python, TypeScript to Node.js.',
    color: 'text-purple-600'
  },
  {
    icon: Clock,
    title: 'Save Time & Money',
    description: 'Reduce development time by 90%. What used to take weeks now takes minutes. Perfect for startups and businesses on a budget.',
    color: 'text-orange-600'
  },
  {
    icon: HeadphonesIcon,
    title: 'AI Assistant',
    description: 'Chat with our intelligent AI to refine, debug, and optimize your code. Get instant help whenever you need it.',
    color: 'text-cyan-600'
  }
]

const stats = [
  { number: '10K+', label: 'Projects Created' },
  { number: '50+', label: 'Languages Supported' },
  { number: '99%', label: 'Code Quality' },
  { number: '<1min', label: 'Average Gen Time' }
]

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ypilo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the future of software development with AI that understands your needs 
            and generates perfect code every time.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`} />
              
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center p-8 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Build the Future?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join the AI revolution in software development. Create your first project in minutes, 
            not months. No credit card required, completely free to start.
          </p>
          <a
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
          >
            Start Creating for Free
          </a>
        </motion.div>
      </div>
    </section>
  )
}