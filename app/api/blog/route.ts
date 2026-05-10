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
      author,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Validate slug uniqueness - use try/catch to handle missing author column
    let existingPost;
    try {
      existingPost = await prisma.blogPost.findUnique({
        where: { slug },
      });
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      // Continue - slug might not be unique but we'll try to create
    }

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    // Build data object based on what fields are available
    const postData: any = {
      title,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      slug,
      published: published || false,
      tags: tags || [],
    };

    // Add author field if provided (in case of database migration in progress)
    if (author) {
      postData.author = author;
    }

    const post = await prisma.blogPost.create({
      data: postData,
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
