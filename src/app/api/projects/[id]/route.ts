import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink, rm } from 'fs/promises'
import { existsSync } from 'fs'

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description } = await request.json()

    // Verify ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email },
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update project code and chat history
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, preview, chatHistory } = await request.json()

    // Verify ownership
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email },
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(code && { code }),
        ...(preview && { preview }),
        ...(chatHistory && { chatHistory }),
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete from database
    await prisma.project.delete({
      where: { id: params.id },
    })

    // Decrement user's project count to allow creating new projects
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { projectsCount: true }
    })

    if (user && user.projectsCount > 0) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          projectsCount: {
            decrement: 1
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully. You can now create a new project.',
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
