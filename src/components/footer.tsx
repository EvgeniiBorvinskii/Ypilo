import React from 'react'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Ypilo
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Ypilo is a leading IT solutions company providing custom software development services worldwide. We specialize in 
              private applications, and business automation for oil & gas, dealerships, and restaurants across the province.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Global Services</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>order@ypilo.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Custom Software Development</li>
              <li>Private Applications</li>
              <li>Website Development</li>
              <li>Business Automation</li>
              <li>Design Tools</li>
              <li>IT Consulting</li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-semibold mb-4">Industries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Oil & Gas</li>
              <li>Automotive Dealerships</li>
              <li>Restaurants</li>
              <li>Healthcare</li>
              <li>Manufacturing</li>
              <li>Retail</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Ypilo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}