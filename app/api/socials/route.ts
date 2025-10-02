import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const socials = await prisma.social.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(socials)
  } catch (error) {
    console.error("Error fetching socials:", error)
    return NextResponse.json({ error: "Failed to fetch socials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, username, followers, url, icon, order } = body

    const social = await prisma.social.create({
      data: {
        platform,
        username,
        followers,
        url,
        icon,
        order: order || 0,
      },
    })

    return NextResponse.json(social, { status: 201 })
  } catch (error) {
    console.error("Error creating social:", error)
    return NextResponse.json({ error: "Failed to create social" }, { status: 500 })
  }
}
