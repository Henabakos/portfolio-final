"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface BlogEngagementProps {
  postSlug: string;
  initialLikes: number;
}

export function BlogEngagement({ postSlug, initialLikes }: BlogEngagementProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const storageKey = `blog-liked-${postSlug}`;
  const bookmarkKey = `blog-bookmark-${postSlug}`;

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
    setBookmarked(localStorage.getItem(bookmarkKey) === "1");
  }, [storageKey, bookmarkKey]);

  const toggleLike = async () => {
    const nextLiked = !liked;
    try {
      const response = await fetch(`/api/blog/${postSlug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setLikes(data.likes);
      setLiked(nextLiked);
      localStorage.setItem(storageKey, nextLiked ? "1" : "0");
    } catch {
      toast.error("Failed to update like");
    }
  };

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    localStorage.setItem(bookmarkKey, next ? "1" : "0");
    toast.success(next ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        className="gap-2 rounded-full"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? "Unlike article" : "Like article"}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        {likes}
      </Button>
      <Button
        variant={bookmarked ? "default" : "outline"}
        size="sm"
        className="gap-2 rounded-full"
        onClick={toggleBookmark}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        Save
      </Button>
    </div>
  );
}
