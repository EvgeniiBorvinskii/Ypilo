'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Globe,
  Smartphone,
  Bot,
  Database,
  Wrench,
  Factory,
  Building2
} from 'lucide-react'

const industries = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Create stunning, responsive websites from landing pages to complex web applications. Our AI generates modern, SEO-optimized code instantly.',
    features: ['Landing Pages', 'E-commerce Sites', 'Web Apps', 'Portfolios'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Smartphone,
    title: 'UI Components',
    description: 'Generate beautiful, reusable UI components with perfect styling and responsive design. From buttons to complex interactive elements.',
    features: ['React Components', 'Vue Components', 'CSS Styling', 'Animations'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: Bot,
    title: 'Automation Scripts',
    description: 'Create powerful automation scripts in Python, JavaScript, or any language. Perfect for data processing, web scraping, and task automation.',
    features: ['Data Processing', 'Web Scraping', 'File Management', 'API Integration'],
    color: 'text-green-600',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: Database,
    title: 'Backend APIs',
    description: 'Generate complete REST APIs with database schemas, authentication, and business logic. Production-ready backend solutions in minutes.',
    features: ['REST APIs', 'Database Design', 'Authentication', 'Data Validation'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10'
  },
  {
    icon: Wrench,
    title: 'Utility Tools',
    description: 'Build custom tools and utilities for specific tasks. From calculators to converters, generators to analyzers.',
    features: ['Calculators', 'Converters', 'Generators', 'Analyzers'],
    color: 'text-pink-600',
    bgColor: 'bg-pink-500/10'
  },
  {
    icon: Factory,
    title: 'Business Applications',
    description: 'Create complete business applications with dashboards, reports, and data visualization. Perfect for internal tools and management systems.',
    features: ['Dashboards', 'Reports', 'Data Viz', 'CRM Tools'],
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500/10'
  }
]

export function IndustriesSection() {
  return (
    <section id="industries" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What You Can <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Build</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From simple utilities to complex applications, Ypilo's AI can generate code for virtually 
            any software project you can imagine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              className={`group p-8 rounded-xl ${industry.bgColor} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <industry.icon className={`h-12 w-12 ${industry.color} mb-6 group-hover:scale-110 transition-transform duration-300`} />
              
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                {industry.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {industry.description}
              </p>
              
              <ul className="grid grid-cols-2 gap-2">
                {industry.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted-foreground flex items-center">
                    <div className={`w-2 h-2 rounded-full ${industry.color.replace('text-', 'bg-')} mr-2 flex-shrink-0`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-border/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Building2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4">Have a Custom Project in Mind?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our AI is constantly learning and can adapt to generate code for virtually any type of 
            project. Just describe what you need, and let Ypilo create it for you.
          </p>
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
          >
            Try It Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}