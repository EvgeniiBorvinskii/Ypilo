import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Get public project error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
