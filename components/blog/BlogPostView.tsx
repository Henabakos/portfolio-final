"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";
import { RichContentRenderer } from "./RichContentRenderer";
import { TableOfContents } from "./TableOfContents";
import { BlogMetadata } from "./BlogMetadata";
import { BlogShare } from "./BlogShare";
import { BlogEngagement } from "./BlogEngagement";
import { BlogComments } from "./BlogComments";
import { PostNavigation, RelatedPosts } from "./PostNavigation";
import { calculateReadingTime } from "./utils/readingTime";
import { LoadingScreen } from "@/components/loading-screen";
import type { BlogPost } from "@/lib/blog/types";

interface BlogPostViewProps {
  slug: string;
  shareUrl: string;
}

interface BlogPostWithRelations extends BlogPost {
  previous?: { title: string; slug: string; excerpt?: string | null; coverImage?: string | null } | null;
  next?: { title: string; slug: string; excerpt?: string | null; coverImage?: string | null } | null;
  related?: Array<{
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    tags?: string[];
  }>;
}

export function BlogPostView({ slug, shareUrl }: BlogPostViewProps) {
  const { data: blogPost, error } = useSWR<BlogPostWithRelations>(
    `/api/blog/${slug}?related=true`,
    fetcher
  );

  const readingTime = useMemo(() => {
    if (!blogPost?.content) return 0;
    return calculateReadingTime(blogPost.content);
  }, [blogPost?.content]);

  if (!blogPost && !error) return <LoadingScreen />;

  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        <div className="hidden lg:block">
          <TableOfContents htmlContent={blogPost.content} />
        </div>

        <article className="min-w-0 max-w-3xl mx-auto lg:mx-0 w-full">
          <header className="mb-10 space-y-6">
            {blogPost.category && (
              <span className="text-sm font-medium text-primary">{blogPost.category}</span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
              {blogPost.title}
            </h1>
            {blogPost.subtitle && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {blogPost.subtitle}
              </p>
            )}
            <BlogMetadata
              author={blogPost.author || undefined}
              createdAt={blogPost.publishedAt || blogPost.createdAt}
              readingTime={readingTime}
              tags={blogPost.tags}
              className="border-t border-b border-border py-4"
            />
            <BlogEngagement postSlug={slug} initialLikes={blogPost.likes} />
          </header>

          <div className="lg:hidden mb-8">
            <TableOfContents htmlContent={blogPost.content} />
          </div>

          {blogPost.coverImage && (
            <figure className="mb-10 -mx-4 sm:mx-0">
              <div className="aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={blogPost.coverImage}
                  alt={blogPost.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </figure>
          )}

          <RichContentRenderer html={blogPost.content} className="blog-article-content" />

          <footer className="mt-12 pt-8 border-t border-border space-y-8">
            <BlogShare title={blogPost.title} url={shareUrl} />
            <PostNavigation previous={blogPost.previous} next={blogPost.next} />
            {blogPost.related && <RelatedPosts posts={blogPost.related} />}
            <BlogComments postSlug={slug} />
          </footer>
        </article>
      </div>
    </div>
  );
}
