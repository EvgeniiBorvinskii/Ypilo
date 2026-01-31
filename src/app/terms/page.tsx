import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Ypilo, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily use the services on Ypilo for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for safeguarding your account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <p className="text-muted-foreground">
                You retain all rights to any content you submit, post or display on or through the Service. 
                By posting content, you grant us a license to use, modify, publicly perform, publicly display, 
                reproduce, and distribute such content on and through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may not use our services for any illegal or unauthorized purpose. You must not transmit any 
                worms or viruses or any code of a destructive nature.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on Ypilo are provided on an 'as is' basis. Ypilo makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties 
                or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall Ypilo or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on Ypilo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
              <p className="text-muted-foreground">
                Ypilo may revise these terms of service at any time without notice. By using this service you are 
                agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at order@ypilo.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
