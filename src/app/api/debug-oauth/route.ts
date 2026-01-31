import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ypilo.com'

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
  googleAuthUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/callback/google`)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', 'test-state-123')

  return NextResponse.json({
    googleAuthUrl: googleAuthUrl.toString(),
    redirectUri: `${baseUrl}/api/auth/callback/google`,
    clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    hasSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    baseUrl
  })
}