import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findBlogPostBySlugOrId } from "@/lib/blog/queries";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action as "like" | "unlike";

    const post = await findBlogPostBySlugOrId(id, false);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        likes: {
          increment: action === "unlike" ? -1 : 1,
        },
      },
      select: { likes: true },
    });

    return NextResponse.json({
      likes: Math.max(0, updated.likes),
    });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
