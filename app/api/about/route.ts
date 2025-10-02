import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    return NextResponse.json(about)
  } catch (error) {
    console.error("Error fetching about data:", error)
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, title, bio, profileImage, resumeLink, skills, experience, projectsCount, available } = body

    // Find existing about record or create new one
    const existingAbout = await prisma.about.findFirst()

    let about
    if (existingAbout) {
      about = await prisma.about.update({
        where: { id: existingAbout.id },
        data: {
          name,
          title,
          bio,
          profileImage,
          resumeLink,
          skills: skills || [],
          experience,
          projectsCount,
          available: available || true,
        },
      })
    } else {
      about = await prisma.about.create({
        data: {
          name,
          title,
          bio,
          profileImage,
          resumeLink,
          skills: skills || [],
          experience,
          projectsCount,
          available: available || true,
        },
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("Error updating about data:", error)
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 })
  }
}
