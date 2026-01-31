import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CustomCursor } from '@/components/custom-cursor'
import { AuthProvider } from '@/components/auth-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Ypilo | Professional Software Development & Business Automation',
    template: '%s | Ypilo'
  },
  description: 'Leading IT solutions company providing custom software development, private applications, websites, and automated business solutions for businesses worldwide.',
  keywords: [
    'Ypilo',
    'Ypilo IT solutions',
    'Ypilo software development',
  ],
  authors: [{ name: 'Ypilo' }],
  creator: 'Ypilo',
  publisher: 'Ypilo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ypilo.com'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ypilo.com',
    title: 'Ypilo | Professional Software Development',
    description: 'Leading IT solutions company specializing in custom software development and business automation for clients worldwide.',
    siteName: 'Ypilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ypilo | Professional Software Development',
    description: 'Leading IT solutions company specializing in custom software development and business automation for clients worldwide.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        
        
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <CustomCursor />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}