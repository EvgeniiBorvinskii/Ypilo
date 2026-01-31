import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's projects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check project limit (skip for admins)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      const projectCount = await prisma.project.count({
        where: { userId: session.user.id }
      })

      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
      })

      const maxProjects = subscription?.tier === 'PREMIUM' ? 3 : 1

      if (projectCount >= maxProjects) {
        return NextResponse.json(
          { error: `Maximum projects reached (${maxProjects}). ${subscription?.tier === 'FREE' ? 'Upgrade to Premium for more projects.' : ''}` },
          { status: 403 }
        )
      }
    }

    const body = await req.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 })
    }

    // Create project folder path
    const projectSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filePath = `/srv/user-projects/${session.user.id}/${projectSlug}`

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title,
        description,
        code: '// Start coding here',
        preview: '<div>Loading...</div>',
        filePath,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
