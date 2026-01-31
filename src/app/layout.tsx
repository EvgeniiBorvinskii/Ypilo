import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CustomCursor } from '@/components/custom-cursor'
import { SmokeCursor } from '@/components/smoke-cursor'
import { SupportChat } from '@/components/support-chat'
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
    default: 'Ypilo | AI-Powered Code Generator - Create Websites & Apps Instantly',
    template: '%s | Ypilo'
  },
  description: 'Revolutionary AI platform for generating production-ready code, websites, and applications in seconds. Powered by advanced AI technology, Ypilo transforms your ideas into fully functional programs with intelligent code generation, real-time editing, and instant deployment.',
  keywords: [
    'Ypilo',
    'AI code generator',
    'AI website builder',
    'AI app generator',
    'automated programming',
    'code generation AI',
    'AI software development',
    'instant website creation',
    'AI programming assistant',
    'automatic code generation',
    'AI web development',
    'intelligent code builder',
    'AI application creator',
    'machine learning code generator',
    'AI-powered development',
    'instant app builder'
  ],
  authors: [{ name: 'Ypilo' }],
  creator: 'Ypilo',
  publisher: 'Ypilo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://ypilo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ypilo.com',
    title: 'Ypilo | AI-Powered Code Generator',
    description: 'Revolutionary AI platform for generating production-ready code, websites, and applications in seconds. Transform your ideas into reality with intelligent code generation.',
    siteName: 'Ypilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ypilo | AI-Powered Code Generator',
    description: 'Revolutionary AI platform for generating production-ready code, websites, and applications in seconds. Transform your ideas into reality with intelligent code generation.',
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
            storageKey="theme"
            disableTransitionOnChange
            enableColorScheme
          >
            <CustomCursor />
            <SmokeCursor />
            <SupportChat />
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