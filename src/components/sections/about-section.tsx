'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Target,
  Users,
  Lightbulb,
  CheckCircle
} from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize software development by making AI-powered code generation accessible to everyone, from professional developers to complete beginners.',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Our Technology',
    description: 'Built on cutting-edge AI models trained on billions of lines of code, Ypilo understands programming languages, frameworks, and best practices.',
    color: 'text-purple-600'
  },
  {
    icon: Lightbulb,
    title: 'Our Vision',
    description: 'A world where anyone can bring their ideas to life through code, without barriers of technical knowledge or expensive development teams.',
    color: 'text-green-600'
  }
]

const achievements = [
  'Lightning-fast code generation powered by advanced AI',
  'Production-ready code that follows industry best practices',
  'Support for multiple programming languages and frameworks',
  'Intelligent debugging and code optimization suggestions',
  'Real-time collaboration with AI coding assistant',
  'Instant deployment and export options for all projects'
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Ypilo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The next generation of software development is here. Ypilo combines the power of artificial 
            intelligence with intuitive design to make coding accessible to everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Company Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              Revolutionizing Software Development
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Ypilo was born from a simple question: What if anyone could create software, regardless 
                of their coding experience? Traditional development requires years of learning, expensive 
                teams, and countless hours of debugging.
              </p>
              <p>
                We've built a platform that harnesses the power of advanced AI to generate production-ready 
                code instantly. Our intelligent system understands context, follows best practices, and creates 
                code that's not just functional, but elegant and maintainable.
              </p>
              <p>
                Whether you're a seasoned developer looking to accelerate your workflow, an entrepreneur 
                bringing your idea to life, or a business automating processes - Ypilo makes it possible 
                in a fraction of the time and cost of traditional development.
              </p>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">What Makes Ypilo Special</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center p-8 rounded-xl bg-muted/30 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <value.icon className={`h-12 w-12 ${value.color} mx-auto mb-6`} />
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers, entrepreneurs, and businesses using Ypilo to bring their 
            ideas to life faster than ever before.
          </p>
          <a
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
          >
            Start Building Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}