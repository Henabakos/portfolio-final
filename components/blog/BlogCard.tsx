"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { calculateReadingTime, formatReadingTime } from "./utils/readingTime";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const readingTime = post.content
    ? calculateReadingTime(post.content)
    : post.excerpt
      ? calculateReadingTime(post.excerpt)
      : 0;

  const publishDate = new Date(
    post.publishedAt || post.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col border hover:shadow-lg transition-all duration-300 group ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`flex flex-col h-full ${featured ? "md:contents" : ""}`}
        aria-label={`Read ${post.title}`}
      >
        <div
          className={`relative overflow-hidden bg-muted ${
            featured ? "aspect-video md:aspect-auto md:min-h-full" : "aspect-video"
          }`}
        >
          <Image
            src={post.coverImage || "/blog-img.svg"}
            alt=""
            width={featured ? 800 : 600}
            height={featured ? 450 : 400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {post.category && (
            <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur">
              {post.category}
            </Badge>
          )}
          {post.featured && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        <div className={`flex flex-col flex-1 p-6 gap-4 ${featured ? "justify-center" : ""}`}>
          <div>
            {post.subtitle && featured && (
              <p className="text-sm text-primary font-medium mb-2">{post.subtitle}</p>
            )}
            <h2
              className={`font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors ${
                featured ? "text-2xl md:text-3xl" : "text-xl"
              }`}
            >
              {post.title}
            </h2>
            {(post.excerpt || post.subtitle) && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {post.excerpt || post.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
            {post.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${post.author}`} alt="" />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.publishedAt || post.createdAt}>{publishDate}</time>
            </div>
            {readingTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{formatReadingTime(readingTime)}</span>
              </div>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            Read article
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
