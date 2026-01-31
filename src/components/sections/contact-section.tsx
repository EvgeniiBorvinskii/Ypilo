"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare,
  Monitor,
  Smartphone,
  Globe,
  FileText,
  CheckSquare,
  List
} from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email",
    value: "order@ypilo.com",
    action: "mailto:order@ypilo.com",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "We respond quickly",
    value: "Within 24 hours",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10"
  }
]

const platforms = [
  { icon: Monitor, name: "Windows Applications", color: "text-blue-600" },
  { icon: Smartphone, name: "iOS & macOS Apps", color: "text-gray-600" },
  { icon: Monitor, name: "Linux Software", color: "text-orange-600" },
  { icon: Smartphone, name: "Android Applications", color: "text-green-600" },
  { icon: Globe, name: "Web Applications", color: "text-purple-600" },
  { icon: Globe, name: "Custom Websites", color: "text-pink-600" }
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    platform: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      const subject = `Custom Project Order from ${formData.name} - ${formData.platform}`
      const body = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Phone: ${formData.phone}
Platform: ${formData.platform}

Project Requirements:
${formData.message}
      `
      
      const mailtoLink = `mailto:order@ypilo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.location.href = mailtoLink
      
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          platform: "",
          message: ""
        })
      }, 3000)
    }, 1000)
  }

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Order Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Custom Project</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Contact Ypilo to order custom applications for any platform,
            professional websites, or tailored software solutions.
          </p>
        </motion.div>

        {/* Platforms Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">We Develop For All Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                className="p-4 rounded-lg bg-background border border-border/50 text-center hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <platform.icon className={`h-8 w-8 ${platform.color} mx-auto mb-2`} />
                <p className="text-xs font-medium text-muted-foreground">{platform.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              className={`p-6 rounded-xl ${info.bgColor} border border-border/50 text-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <info.icon className={`h-10 w-10 ${info.color} mx-auto mb-4`} />
              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{info.description}</p>
              {info.action ? (
                <a 
                  href={info.action}
                  className={`${info.color} font-medium hover:underline`}
                >
                  {info.value}
                </a>
              ) : (
                <p className={`${info.color} font-medium`}>{info.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 rounded-xl bg-background border border-border/50">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-2xl font-semibold">Order Custom Development</h3>
              </div>

              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Order Received!</h4>
                  <p className="text-muted-foreground">
                    Thank you for your order request. We will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Platform *
                    </label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">Select a platform</option>
                      <option value="Windows Application">Windows Application</option>
                      <option value="iOS Application">iOS Application</option>
                      <option value="macOS Application">macOS Application</option>
                      <option value="Linux Software">Linux Software</option>
                      <option value="Android Application">Android Application</option>
                      <option value="Web Application">Web Application</option>
                      <option value="Website">Website</option>
                      <option value="Cross-Platform">Cross-Platform (Multiple)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Requirements *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-vertical"
                      placeholder="Please describe your project requirements, features needed, timeline, and budget..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        Send Order Request
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Technical Specifications Guide */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  How to Write a Proper Technical Specification
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A clear technical specification helps us understand your vision and deliver exactly what you need.
                  Follow this guide to create an effective project brief.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Project Overview</h4>
                    <p className="text-muted-foreground text-sm">
                      Describe what your application/website should do in 2-3 sentences. 
                      Include the main purpose and target audience.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Core Features</h4>
                    <p className="text-muted-foreground text-sm">
                      List the essential features your project must have. Be specific:
                      "User login with email" instead of just "authentication."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">User Flow</h4>
                    <p className="text-muted-foreground text-sm">
                      Explain how users will interact with your application. 
                      Example: "User opens app → selects image → applies filter → saves result."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Design Preferences</h4>
                    <p className="text-muted-foreground text-sm">
                      Mention any design requirements, color schemes, or reference apps/websites 
                      you like. Include mockups if available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Timeline & Budget</h4>
                    <p className="text-muted-foreground text-sm">
                      Provide your expected timeline and budget range. 
                      This helps us propose the best solution for your needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-border/50">
                <h4 className="font-semibold mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Example Specification
                </h4>
                <p className="text-muted-foreground text-sm mb-3">
                  "I need a Windows desktop app for photo editing with filters, crop, resize, and batch processing. 
                  Users should be able to drag & drop images, apply pre-defined filters, and export in multiple formats 
                  (JPG, PNG, WebP). Modern dark UI preferred. Timeline: 2-3 months. Budget: $5,000-$10,000."
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Clear, specific, and actionable
                </div>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/50">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Not sure how to describe your project? No problem! 
                  Contact us with your ideas, and we will help you create a proper specification together.
                </p>
                <a
                  href="mailto:order@ypilo.com"
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  order@ypilo.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
