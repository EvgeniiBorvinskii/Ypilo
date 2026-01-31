import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/projects/[id]/view - Increment view count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await prisma.project.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    })

    return NextResponse.json({ viewCount: project.viewCount })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}
