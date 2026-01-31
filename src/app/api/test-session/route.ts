import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Testing session...')
    const session = await getServerSession(authOptions)
    
    console.log('Session result:', session ? 'Found' : 'Not found')
    
    return NextResponse.json({
      session: session,
      hasSession: !!session,
      user: session?.user || null,
      debug: {
        nextauthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      }
    })
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
