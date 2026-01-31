import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET(request: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY

  let apiTestResult = 'Not tested'
  let apiError = null

  if (groqKey) {
    try {
      const client = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      })

      // Quick test with minimal tokens
      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 10,
      })

      apiTestResult = 'Success'
    } catch (error: any) {
      apiTestResult = 'Failed'
      apiError = error.message
    }
  }

  return NextResponse.json({
    groqKeyExists: !!process.env.GROQ_API_KEY,
    groqKeyPrefix: process.env.GROQ_API_KEY?.substring(0, 10),
    apiTestResult,
    apiError,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('API')),
    timestamp: new Date().toISOString()
  })
}