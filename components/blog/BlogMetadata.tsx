"use client";

import React from "react";
import { formatReadingTime } from "./utils/readingTime";
import { Badge } from "@/components/ui/badge";

interface BlogMetadataProps {
  author?: string;
  createdAt: string;
  readingTime: number;
  tags?: string[];
  className?: string;
}

export function BlogMetadata({
  author,
  createdAt,
  readingTime,
  tags = [],
  className = "",
}: BlogMetadataProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main metadata row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {author && (
          <div>
            <span className="font-medium text-foreground">By</span>{" "}
            <span>{author}</span>
          </div>
        )}
        <div className="hidden sm:block">•</div>
        <time dateTime={createdAt}>{formattedDate}</time>
        <div className="hidden sm:block">•</div>
        <span>{formatReadingTime(readingTime)}</span>
      </div>

      {/* Tags section */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
