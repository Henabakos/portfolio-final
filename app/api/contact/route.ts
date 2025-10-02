import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst()
    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error fetching contact data:", error)
    return NextResponse.json({ error: "Failed to fetch contact data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, location, socials } = body

    // Find existing contact record or create new one
    const existingContact = await prisma.contact.findFirst()

    let contact
    if (existingContact) {
      contact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          email,
          phone,
          location,
          socials,
        },
      })
    } else {
      contact = await prisma.contact.create({
        data: {
          email,
          phone,
          location,
          socials,
        },
      })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error updating contact data:", error)
    return NextResponse.json({ error: "Failed to update contact data" }, { status: 500 })
  }
}
