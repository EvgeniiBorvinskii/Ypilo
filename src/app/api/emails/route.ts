import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mailbox = searchParams.get("mailbox") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 50

    let where: any = {}
    
    if (mailbox !== "all") {
      where.to = mailbox
    }

    const emails = await prisma.email.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.email.count({ where })

    return NextResponse.json({
      emails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Get emails error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { from, to, subject, bodyText } = body

    const email = await prisma.email.create({
      data: {
        from,
        to,
        subject,
        body: bodyText
      }
    })

    return NextResponse.json({ email })
  } catch (error) {
    console.error("Create email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
