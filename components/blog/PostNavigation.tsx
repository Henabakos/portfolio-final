"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface AdjacentPost {
  title: string;
  slug: string;
  coverImage?: string | null;
  excerpt?: string | null;
}

interface PostNavigationProps {
  previous?: AdjacentPost | null;
  next?: AdjacentPost | null;
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border"
      aria-label="Article navigation"
    >
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground shrink-0 mt-1" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Previous</p>
            <p className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {previous.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors sm:flex-row-reverse sm:text-right"
        >
          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Next</p>
            <p className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {next.title}
            </p>
          </div>
        </Link>
      ) : null}
    </nav>
  );
}

interface RelatedPostsProps {
  posts: Array<{
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    tags?: string[];
  }>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold mb-6">
        Related articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video relative bg-muted overflow-hidden">
              <Image
                src={post.coverImage || "/blog-img.svg"}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
