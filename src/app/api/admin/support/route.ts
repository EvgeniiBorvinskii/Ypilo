import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  })
  
  return user?.isAdmin || false
}

// GET - Get all support messages (admin only)
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all' // all, unread, responded

    const where: any = {}
    if (filter === 'unread') {
      where.isRead = false
    } else if (filter === 'responded') {
      where.response = { not: null }
    }

    const messages = await prisma.supportMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    const stats = {
      total: await prisma.supportMessage.count(),
      unread: await prisma.supportMessage.count({ where: { isRead: false } }),
      responded: await prisma.supportMessage.count({ where: { response: { not: null } } })
    }

    return NextResponse.json({ messages, stats })
  } catch (error) {
    console.error('Error fetching support messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - Respond to message or mark as read (admin only)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { messageId, response, markAsRead } = body

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    
    if (markAsRead !== undefined) {
      updateData.isRead = markAsRead
    }
    
    if (response) {
      updateData.response = response
      updateData.respondedAt = new Date()
      updateData.isRead = true
    }

    const message = await prisma.supportMessage.update({
      where: { id: messageId },
      data: updateData
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error updating support message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE - Delete message (admin only)
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    await prisma.supportMessage.delete({
      where: { id: messageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting support message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
