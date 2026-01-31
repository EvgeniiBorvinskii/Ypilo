import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Admin middleware - check if user is admin
async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.isAdmin === true
}

// GET - Search users and their projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' as const } },
            { name: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          projects: {
            select: {
              id: true,
              title: true,
              viewCount: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          subscription: true,
          _count: {
            select: { projects: true, comments: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Update user (grant premium, toggle admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, action, tier } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let result

    switch (action) {
      case 'grant_premium':
        // Create or update subscription
        result = await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            tier: tier || 'PREMIUM',
            status: 'ACTIVE',
          },
          update: {
            tier: tier || 'PREMIUM',
            status: 'ACTIVE',
          },
        })
        break

      case 'revoke_premium':
        result = await prisma.subscription.update({
          where: { userId },
          data: {
            tier: 'FREE',
            status: 'CANCELLED',
          },
        })
        break

      case 'toggle_admin':
        const user = await prisma.user.findUnique({ where: { id: userId } })
        result = await prisma.user.update({
          where: { id: userId },
          data: { isAdmin: !user?.isAdmin },
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
