import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const headers = Object.fromEntries(request.headers.entries())
    
    console.log('=== DEBUG AUTH ===')
    console.log('Session:', session ? 'FOUND' : 'NOT FOUND')
    console.log('Headers:', JSON.stringify(headers, null, 2))
    console.log('Cookies:', request.cookies.getAll())
    console.log('==================')
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      headers: {
        host: headers.host,
        'x-forwarded-proto': headers['x-forwarded-proto'],
        'x-real-ip': headers['x-real-ip'],
        cookie: headers.cookie ? 'present' : 'missing',
      },
      cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
      env: {
        nextauthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      }
    })
  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
