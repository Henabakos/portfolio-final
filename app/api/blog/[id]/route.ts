import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/blog/auth";
import {
  findBlogPostBySlugOrId,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/blog/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = isAdminAuthenticated(request);
    const includeRelated = request.nextUrl.searchParams.get("related") === "true";

    const post = await findBlogPostBySlugOrId(id, admin);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (!admin) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    const payload: Record<string, unknown> = {
      ...post,
      views: admin ? post.views : post.views + 1,
    };

    if (includeRelated) {
      const [adjacent, related] = await Promise.all([
        getAdjacentPosts(post.slug),
        getRelatedPosts(post.slug, post.tags),
      ]);
      payload.previous = adjacent.previous;
      payload.next = adjacent.next;
      payload.related = related;
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      subtitle,
      content,
      excerpt,
      coverImage,
      slug,
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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugTaken) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const isPublished = Boolean(published);
    let nextPublishedAt = existing.publishedAt;
    if (isPublished && !existing.published) {
      nextPublishedAt = publishedAt ? new Date(publishedAt) : new Date();
    } else if (!isPublished) {
      nextPublishedAt = null;
    } else if (publishedAt) {
      nextPublishedAt = new Date(publishedAt);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        content,
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage || null,
        slug: slug || existing.slug,
        category: category || null,
        published: isPublished,
        featured: Boolean(featured),
        tags: tags || [],
        author: author?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        publishedAt: nextPublishedAt,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.published === true) {
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        body.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error patching blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
