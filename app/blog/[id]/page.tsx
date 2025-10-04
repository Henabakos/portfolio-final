"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2 } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { use } from "react";

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

  if (!blogPost && !error) return <LoadingScreen />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Button asChild>
            <a href="/blog">Back to Blog</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Button asChild>
            <a href="/blog">Back to Blog</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            <article className="space-y-8">
              {/* Article Header */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {blogPost.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {blogPost.tags && blogPost.tags.length > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[14px] leading-[20px] font-[400] cursor-pointer px-5 py-2 hover:bg-[#2F3236] dark:bg-[#2F3236] hover:text-white transition-colors rounded-full bg-white border-none"
                    >
                      {blogPost.tags[0]}
                    </Badge>
                  )}
                  {blogPost.createdAt && (
                    <span>
                      {new Date(blogPost.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {blogPost.coverImage && (
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={blogPost.coverImage || "/placeholder.svg"}
                    alt={blogPost.title}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
                <div
                  className="text-[16px] leading-[30px] gray-text dark:text-[#858B9B] font-[400] rich-text-content"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
              </div>

              {/* Tags and Social Sharing */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 gap-4 md:gap-0">
                {blogPost.tags && blogPost.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground pr-2">
                      Tags
                    </span>
                    {blogPost.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[14px] leading-[20px] font-[400] cursor-pointer px-5 py-2 hover:bg-[#2F3236] dark:bg-[#2F3236] hover:text-white transition-colors rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 rounded-full px-5 py-2 hover:bg-[#2F3236] dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white hover:text-white transition-colors bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 rounded-full px-5 py-2 hover:bg-[#2F3236] hover:text-white dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white transition-colors bg-transparent"
                  >
                    <Share2 className="h-4 w-4" />
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
