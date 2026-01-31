import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  
  const params = {
    code: url.searchParams.get('code'),
    state: url.searchParams.get('state'),
    scope: url.searchParams.get('scope'),
    authuser: url.searchParams.get('authuser'),
    prompt: url.searchParams.get('prompt'),
    error: url.searchParams.get('error'),
    error_description: url.searchParams.get('error_description'),
  }
  
  const headers = Object.fromEntries(req.headers.entries())
  
  return NextResponse.json({
    message: 'Google OAuth Callback Debug',
    url: req.url,
    params,
    headers,
    cookies: req.cookies.getAll(),
    timestamp: new Date().toISOString()
  }, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
