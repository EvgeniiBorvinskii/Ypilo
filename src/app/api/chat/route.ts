import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import fs from 'fs'

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not set!')
} else {
  console.log('✅ GROQ_API_KEY loaded:', process.env.GROQ_API_KEY.substring(0, 20) + '...')
}

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
})

console.log('✅ Groq SDK initialized:', !!groq)

export async function POST(request: NextRequest) {
  const logFile = '/tmp/chat-debug.log'
  const log = (msg: string) => {
    try {
      fs.appendFileSync(logFile, `${new Date().toISOString()}: ${msg}\n`)
    } catch (e) {
      // ignore
    }
  }
  
  try {
    log('=== CHAT API CALLED ===')
    console.error('🚀 === CHAT API CALLED ===')
    console.error('🚀 Request URL:', request.url)
    log(`Request URL: ${request.url}`)
    
    const session = await getServerSession(authOptions)
    log(`Session: ${JSON.stringify({ hasSession: !!session, email: session?.user?.email })}`)
    console.error('🔐 Session check:', { hasSession: !!session, email: session?.user?.email })
    
    if (!session?.user?.email) {
      log('UNAUTHORIZED - no session')
      console.error('❌ Unauthorized - no session or email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    log('Reading request body...')
    const body = await request.json()
    log(`Body received: ${JSON.stringify({ projectId: body.projectId, messageCount: body.messages?.length })}`)
    
    const { projectId, messages } = body

    if (!projectId) {
      log('ERROR: No projectId')
      console.error('❌ No projectId provided')
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    if (!messages || !Array.isArray(messages)) {
      log('ERROR: Invalid messages format')
      console.error('❌ Invalid messages format')
      return NextResponse.json({ error: 'Messages must be an array' }, { status: 400 })
    }

    log(`Checking project ownership for: ${projectId}`)
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: { email: session.user.email },
      },
    })

    if (!project) {
      log(`ERROR: Project not found: ${projectId}`)
      console.error('❌ Project not found:', projectId)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    log(`Project found: ${project.title}`)

    log('Calling Groq API...')
    log(`API Key exists: ${!!process.env.GROQ_API_KEY}`)
    log(`Messages count: ${messages.length}`)

    // IMPORTANT: Limit message history to avoid token limits
    // Groq free tier: 12,000 tokens/minute. We keep only last 10 messages to stay within limit
    const recentMessages = messages.slice(-10)
    log(`Using recent messages count: ${recentMessages.length} (limited from ${messages.length})`)

    // Build system prompt for code generation with strict security constraints
    const systemPrompt = `You are an expert web developer helping users create websites and web applications. 
Your task is to generate complete, production-ready HTML/CSS/JavaScript code based on user requirements.

CRITICAL SECURITY CONSTRAINTS - YOU MUST FOLLOW THESE:
1. You can ONLY generate HTML, CSS, and JavaScript code for THIS specific project
2. You MUST NEVER access or reference any user data, database, API keys, or system files
3. You MUST NEVER generate code that makes external API calls except to public CDNs (fonts, libraries)
4. You MUST NEVER include any code that could execute server-side commands or access file systems
5. You MUST NEVER generate code with SQL queries, database connections, or backend logic
6. You are LIMITED to client-side frontend code only (HTML/CSS/JS)
7. You MUST REJECT any requests to access other projects, users, or system information

PROHIBITED ACTIONS:
- No server-side code (PHP, Python, Node.js backend, etc.)
- No database connections or queries
- No file system access (fs, path modules, etc.)
- No process execution (exec, spawn, etc.)
- No external API calls except public CDNs
- No access to environment variables or secrets
- No eval(), Function(), or code injection patterns
- No iframe to external sites that could phish users

ALLOWED:
- Static HTML, CSS, JavaScript
- Public CDNs (Tailwind, Bootstrap, Font Awesome, Google Fonts, etc.)
- Local/inline scripts and styles
- Modern web animations and interactions
- Responsive design and UI components

IMPORTANT - RESPONSE FORMAT:
- When generating code, respond with ONLY 1-2 SHORT sentences to the user
- DO NOT explain the code in detail in your response to user
- DO NOT list features or provide documentation
- Keep your chat responses SHORT and SIMPLE (max 2 sentences)
- Example: "Done! Created a calculator with basic operations." or "Updated the website colors to blue theme."

Guidelines:
- Generate complete, self-contained HTML files
- Use modern, responsive design with Tailwind CSS (via CDN)
- Include inline JavaScript when needed
- Make it visually appealing with animations and modern UI
- Follow best practices and accessibility standards
- Always provide complete, working code that can be used immediately
- When user asks for changes, update the previous code

Format your response as:
1. ONE brief sentence about what you did (max 15 words)
2. The complete code wrapped in \`\`\`html code blocks

Current Project Context (DO NOT access or modify anything outside this):
Project: ${project.title}
${project.description ? `Description: ${project.description}` : ''}
Project ID: ${projectId} (This is the ONLY project you can work with)`

    // Call Groq API with chat completion format
    log('Starting Groq API call...')
    let response
    try {
      response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })
      log('Groq API call successful')
    } catch (apiError: any) {
      log(`ERROR calling Groq API: ${apiError.message}`)
      log(`API Error details: ${JSON.stringify({ status: apiError.status, type: apiError.type })}`)
      
      if (apiError.status === 401) {
        return NextResponse.json({ error: 'AI service authentication failed' }, { status: 500 })
      }
      if (apiError.status === 429 || apiError.status === 413) {
        return NextResponse.json({ 
          error: 'Too many messages in chat history. Please start a new conversation or clear some messages.' 
        }, { status: 429 })
      }
      throw apiError
    }

    const assistantMessage = response.choices[0]?.message?.content || ''

    // Extract short text message (everything before ```html)
    const textMatch = assistantMessage.split('```html')[0].trim()
    const shortMessage = textMatch || 'Code updated successfully!'

    // Extract code from response (look for ```html blocks)
    const codeMatch = assistantMessage.match(/```html\n([\s\S]*?)\n```/)
    let generatedCode = codeMatch ? codeMatch[1] : ''

    // SECURITY: Minimal validation - just wrap in HTML if needed
    if (generatedCode) {
      // Additional validation: ensure it's actually HTML
      if (!generatedCode.includes('<html') && !generatedCode.includes('<!DOCTYPE')) {
        generatedCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${project.title}</title>\n</head>\n<body>\n${generatedCode}\n</body>\n</html>`
      }
    }

    // Update project with chat history and generated code
    const chatHistory = [...(project.chatHistory as any[] || []), ...messages, {
      role: 'assistant',
      content: shortMessage, // Save only short message to chat history
    }]

    await prisma.project.update({
      where: { id: projectId },
      data: {
        chatHistory,
        code: generatedCode || project.code,
        preview: generatedCode || project.preview,
      },
    })

    // Return short message and code
    return NextResponse.json({
      success: true,
      message: shortMessage,
      code: generatedCode,
    })
  } catch (error) {
    log(`FATAL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
    log(`Error stack: ${error instanceof Error ? error.stack : 'No stack'}`)
    console.error('❌ Chat API error:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      raw: error
    })
    
    // Handle Groq API errors
    if (error instanceof Error) {
      // Check for API key error
      if (error.message.includes('401') || error.message.includes('invalid_api_key') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Invalid Groq API key. Please check your GROQ_API_KEY environment variable.' },
          { status: 401 }
        )
      }
      
      // Check for rate limit
      if (error.message.includes('rate_limit') || error.message.includes('429') || error.message.includes('Too Many Requests')) {
        return NextResponse.json(
          { error: 'Groq API rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      }
      
      // Check for insufficient credits/quota
      if (error.message.includes('insufficient_quota') || error.message.includes('credit') || error.message.includes('402')) {
        return NextResponse.json(
          { 
            error: 'Groq API credits depleted. Please check your Groq account balance.'
          },
          { status: 402 } // 402 Payment Required
        )
      }
      
      // Other API errors
      if (error.message.includes('invalid_request_error') || error.message.includes('400')) {
        return NextResponse.json(
          { error: `API Error: ${error.message}` },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please check server logs.' },
      { status: 500 }
    )
  }
}
