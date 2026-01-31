import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.isAdmin === true
}

// DELETE - Admin can delete any project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params

    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Admin delete project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Admin can edit any project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, code, preview } = body

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(code && { code }),
        ...(preview && { preview }),
      },
    })

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('Admin edit project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
