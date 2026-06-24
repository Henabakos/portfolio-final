"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { BlogComment } from "@/lib/blog/types";

interface BlogCommentsProps {
  postSlug: string;
  initialComments?: BlogComment[];
}

export function BlogComments({ postSlug, initialComments = [] }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });
      if (!response.ok) throw new Error("Failed to post");
      const comment = await response.json();
      setComments((prev) => [comment, ...prev]);
      setContent("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 rounded-lg border bg-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="comment-author">Name</Label>
            <Input
              id="comment-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment-content">Comment</Label>
          <Textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts…"
            rows={4}
            required
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post comment"}
        </Button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="border-b border-border pb-6 last:border-0">
              <header className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{comment.author}</p>
                  <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </header>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap pl-11">
                {comment.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
