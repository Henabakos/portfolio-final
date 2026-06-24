import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findBlogPostBySlugOrId } from "@/lib/blog/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await findBlogPostBySlugOrId(id, false);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const comments = await prisma.blogComment.findMany({
      where: { postId: post.id, approved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        author: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, email, content } = body;

    if (!author?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name and comment are required" },
        { status: 400 }
      );
    }

    const post = await findBlogPostBySlugOrId(id, false);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const comment = await prisma.blogComment.create({
      data: {
        postId: post.id,
        author: author.trim(),
        email: email?.trim() || null,
        content: content.trim(),
      },
      select: {
        id: true,
        author: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
