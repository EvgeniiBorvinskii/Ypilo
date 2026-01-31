import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        // All projects are now public
        viewCount: {
          gte: 0, // Just to have a where clause
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent projects
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get public projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
