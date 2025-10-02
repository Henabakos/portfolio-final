import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      slug,
      published,
      tags,
      readTime,
    } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        coverImage,
        slug,
        published: published || false,
        tags: tags || [],
        readTime,
      },
    });

    // Revalidate blog listing
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/revalidate?path=/blog`
      );
    } catch {}
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
