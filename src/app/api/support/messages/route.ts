import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get user's support messages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.supportMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching support messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - Send new support message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { message } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
        userEmail: session.user.email || '',
        message: message.trim(),
      }
    })

    return NextResponse.json({ 
      success: true,
      message: supportMessage 
    })
  } catch (error) {
    console.error('Error creating support message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
