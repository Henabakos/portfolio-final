import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { platform, username, followers, url, icon, order } = body;

    const social = await prisma.social.update({
      where: { id: params.id },
      data: { platform, username, followers, url, icon, order: order || 0 },
    });

    return NextResponse.json(social);
  } catch (error) {
    console.error("Error updating social:", error);
    return NextResponse.json(
      { error: "Failed to update social" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.social.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Social deleted successfully" });
  } catch (error) {
    console.error("Error deleting social:", error);
    return NextResponse.json(
      { error: "Failed to delete social" },
      { status: 500 }
    );
  }
}
