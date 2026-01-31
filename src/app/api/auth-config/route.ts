import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ypilo.com'
  
  return NextResponse.json({
    message: 'Add these EXACT URLs to Google Cloud Console → APIs & Services → Credentials → Your OAuth 2.0 Client',
    authorizedJavaScriptOrigins: [
      baseUrl,
      'http://localhost:3000'
    ],
    authorizedRedirectURIs: [
      `${baseUrl}/api/auth/callback/google`,
      'http://localhost:3000/api/auth/callback/google'
    ],
    currentConfig: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
      baseUrl
    }
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
