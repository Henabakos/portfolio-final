"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { CustomArrow } from "@/components/custom-arrow";
import { calculateReadingTime, formatReadingTime } from "@/components/blog/utils/readingTime";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  slug: string;
  published: boolean;
  tags: string[];
  author?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReadingTime = (post: BlogPost) => {
    if (!post.content) return 0;
    return calculateReadingTime(post.content);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            No blog posts yet
          </h2>
          <p className="text-muted-foreground">
            Check back soon for new content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on design, development, and the web
          </p>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {posts.map((post) => {
            const readingTime = getReadingTime(post);
            const publishDate = new Date(post.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );

            return (
              <Card
                key={post.id}
                className="overflow-hidden h-full flex flex-col border border-border hover:shadow-lg transition-shadow duration-300 group"
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-video bg-muted">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.tags?.[0] && (
                      <Badge className="absolute top-4 right-4 bg-foreground text-background hover:bg-foreground/90">
                        {post.tags[0]}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={`https://avatar.vercel.sh/${post.author}`} />
                            <AvatarFallback>
                              {post.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{post.author}</span>
                        </div>
                      )}
                      <div className="hidden sm:flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={post.createdAt}>{publishDate}</time>
                      </div>
                      {readingTime > 0 && (
                        <div className="hidden sm:flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatReadingTime(readingTime)}</span>
                        </div>
                      )}
                    </div>

                    {/* Read more link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
