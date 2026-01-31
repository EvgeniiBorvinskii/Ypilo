import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = await prisma.email.findUnique({
      where: { id: params.id }
    })

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    return NextResponse.json({ email })
  } catch (error) {
    console.error("Get email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isRead, replyBody } = body

    const updateData: any = {}
    
    if (typeof isRead === "boolean") {
      updateData.isRead = isRead
    }
    
    if (replyBody) {
      updateData.replyBody = replyBody
      updateData.isReplied = true
      updateData.repliedAt = new Date()
      updateData.repliedBy = session.user.email
    }

    const email = await prisma.email.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ email })
  } catch (error) {
    console.error("Update email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.email.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
