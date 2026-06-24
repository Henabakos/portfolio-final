import { prisma } from "@/lib/prisma";
import type { BlogListParams, BlogSortOption } from "./types";

const CUID_PATTERN = /^c[a-z0-9]{24}$/i;

function getOrderBy(sort: BlogSortOption = "newest") {
  switch (sort) {
    case "popular":
      return [{ views: "desc" as const }, { likes: "desc" as const }];
    case "trending":
      return [{ likes: "desc" as const }, { views: "desc" as const }];
    case "newest":
    default:
      return [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];
  }
}

export async function findBlogPostBySlugOrId(identifier: string, admin = false) {
  const isCuid = CUID_PATTERN.test(identifier);

  const post = isCuid
    ? await prisma.blogPost.findUnique({ where: { id: identifier } })
    : await prisma.blogPost.findUnique({ where: { slug: identifier } });

  if (!post) return null;
  if (!admin && !post.published) return null;

  return post;
}

export async function listBlogPosts(params: BlogListParams = {}) {
  const {
    search,
    category,
    tag,
    sort = "newest",
    page = 1,
    limit = 12,
    admin = false,
    featured,
  } = params;

  const where: Record<string, unknown> = admin ? {} : { published: true };

  if (category) where.category = category;
  if (tag) where.tags = { has: tag };
  if (featured !== undefined) where.featured = featured;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { subtitle: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;
  const orderBy = getOrderBy(sort);

  const [posts, total, allPosts] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy, skip, take: limit }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where: admin ? {} : { published: true },
      select: { category: true, tags: true },
    }),
  ]);

  const categories = [
    ...new Set(allPosts.map((p) => p.category).filter(Boolean) as string[]),
  ].sort();

  const tags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    categories,
    tags,
  };
}

export async function getAdjacentPosts(slug: string) {
  const current = await prisma.blogPost.findUnique({
    where: { slug },
    select: { publishedAt: true, createdAt: true },
  });

  if (!current) return { previous: null, next: null };

  const dateFilter = current.publishedAt ?? current.createdAt;

  const [previous, next] = await Promise.all([
    prisma.blogPost.findFirst({
      where: {
        published: true,
        OR: [
          { publishedAt: { lt: dateFilter } },
          { publishedAt: null, createdAt: { lt: dateFilter } },
        ],
        NOT: { slug },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        excerpt: true,
      },
    }),
    prisma.blogPost.findFirst({
      where: {
        published: true,
        OR: [
          { publishedAt: { gt: dateFilter } },
          { publishedAt: null, createdAt: { gt: dateFilter } },
        ],
        NOT: { slug },
      },
      orderBy: [{ publishedAt: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        excerpt: true,
      },
    }),
  ]);

  return { previous, next };
}

export async function getRelatedPosts(slug: string, tags: string[], limit = 3) {
  if (tags.length === 0) {
    return prisma.blogPost.findMany({
      where: { published: true, NOT: { slug } },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        author: true,
        createdAt: true,
        publishedAt: true,
        content: true,
      },
    });
  }

  return prisma.blogPost.findMany({
    where: {
      published: true,
      NOT: { slug },
      tags: { hasSome: tags },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      author: true,
      createdAt: true,
      publishedAt: true,
      content: true,
    },
  });
}
