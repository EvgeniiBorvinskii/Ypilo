import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Get project and verify ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: { email: session.user.email },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!project.code) {
      return NextResponse.json(
        { error: 'No code to publish. Generate code first.' },
        { status: 400 }
      )
    }

    // Create project directory on server
    const projectPath = project.filePath
    
    try {
      // Create directory if it doesn't exist
      await mkdir(projectPath, { recursive: true })
      
      // Write index.html file
      const indexPath = join(projectPath, 'index.html')
      await writeFile(indexPath, project.code, 'utf-8')

      // Projects are now always public - just return success
      return NextResponse.json({
        success: true,
        message: 'Project published successfully',
        path: projectPath,
      })
    } catch (fsError) {
      console.error('File system error:', fsError)
      return NextResponse.json(
        { error: 'Failed to write project files. Check server permissions.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Publish API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Unpublish project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: { email: session.user.email },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Projects are now always public - just return success
    return NextResponse.json({
      success: true,
      message: 'Project is already public',
    })
  } catch (error) {
    console.error('Unpublish API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
