export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  slug: string;
  category?: string | null;
  published: boolean;
  featured: boolean;
  tags: string[];
  author?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email?: string | null;
  content: string;
  approved: boolean;
  createdAt: string;
}

export interface BlogPostInput {
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  slug: string;
  category?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string | null;
}

export type BlogSortOption = "newest" | "popular" | "trending";

export interface BlogListParams {
  search?: string;
  category?: string;
  tag?: string;
  sort?: BlogSortOption;
  page?: number;
  limit?: number;
  admin?: boolean;
  featured?: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
  categories: string[];
  tags: string[];
}

export const BLOG_CATEGORIES = [
  "Development",
  "Design",
  "Tutorial",
  "Opinion",
  "Career",
  "News",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
