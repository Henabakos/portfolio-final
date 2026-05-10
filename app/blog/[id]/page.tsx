"use client";

import { Button } from "@/components/ui/button";
import { Copy, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { use, useMemo } from "react";
import { RichContentRenderer } from "@/components/blog/RichContentRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogMetadata } from "@/components/blog/BlogMetadata";
import { calculateReadingTime } from "@/components/blog/utils/readingTime";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: blogPost, error } = useSWR(
    `/api/blog/${resolvedParams.id}`,
    fetcher
  );

  const readingTime = useMemo(() => {
    if (!blogPost?.content) return 0;
    return calculateReadingTime(blogPost.content);
  }, [blogPost?.content]);

  if (!blogPost && !error) return <LoadingScreen />;

  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Button asChild>
            <Link href="/blog" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents (Desktop) */}
          <div className="hidden lg:block">
            <TableOfContents htmlContent={blogPost.content} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <article className="space-y-8">
              {/* Article Header */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {blogPost.title}
                </h1>

                {/* Metadata */}
                <BlogMetadata
                  author={blogPost.author}
                  createdAt={blogPost.createdAt}
                  readingTime={readingTime}
                  tags={blogPost.tags}
                  className="border-t border-b border-border py-4"
                />
              </div>

              {/* Mobile Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents htmlContent={blogPost.content} />
              </div>

              {/* Featured Image */}
              {blogPost.coverImage && (
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={blogPost.coverImage}
                    alt={blogPost.title}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              <RichContentRenderer html={blogPost.content} />

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Share this article
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : ""
                      )}&text=${encodeURIComponent(blogPost.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
