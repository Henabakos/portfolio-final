import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/blog/auth";
import { listBlogPosts } from "@/lib/blog/queries";
import { generateSlug } from "@/lib/blog/slug";
import type { BlogListParams } from "@/lib/blog/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    if (admin && !isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params: BlogListParams = {
      admin,
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      sort: (searchParams.get("sort") as BlogListParams["sort"]) || "newest",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "12", 10),
      featured:
        searchParams.get("featured") === "true"
          ? true
          : searchParams.get("featured") === "false"
            ? false
            : undefined,
    };

    const result = await listBlogPosts(params);
    return NextResponse.json(result);
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
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      content,
      excerpt,
      coverImage,
      slug: rawSlug,
      category,
      published,
      featured,
      tags,
      author,
      seoTitle,
      seoDescription,
      publishedAt,
    } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = (rawSlug || generateSlug(title)).trim();
    if (!slug) {
      return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
    }

    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const isPublished = Boolean(published);

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        content,
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage || null,
        slug,
        category: category || null,
        published: isPublished,
        featured: Boolean(featured),
        tags: tags || [],
        author: author?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        publishedAt: isPublished
          ? publishedAt
            ? new Date(publishedAt)
            : new Date()
          : null,
      },
    });

    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || "";
      await fetch(`${base}/api/revalidate?path=/blog&secret=${process.env.REVALIDATE_SECRET || ""}`);
    } catch {
      /* non-fatal */
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
