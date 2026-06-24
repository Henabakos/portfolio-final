"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { BlogPostInput } from "@/lib/blog/types";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<BlogPostInput>>();

  const { data: blogPost, error } = useSWR(
    `/api/blog/${resolvedParams.id}`,
    fetcher
  );

  useEffect(() => {
    if (blogPost) {
      setInitialData({
        title: blogPost.title,
        subtitle: blogPost.subtitle,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        coverImage: blogPost.coverImage,
        slug: blogPost.slug,
        category: blogPost.category,
        published: blogPost.published,
        featured: blogPost.featured,
        tags: blogPost.tags,
        author: blogPost.author,
        seoTitle: blogPost.seoTitle,
        seoDescription: blogPost.seoDescription,
        publishedAt: blogPost.publishedAt,
      });
    }
  }, [blogPost]);

  if (!blogPost && !error) return <LoadingScreen />;

  if (error || !blogPost) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Button asChild>
          <Link href="/admin/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const handleSave = async (data: BlogPostInput) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/blog/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update");
      }
      localStorage.removeItem(`blog-draft-${resolvedParams.id}`);
      router.push("/admin/blog");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/blog/${resolvedParams.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      router.push("/admin/blog");
    } catch {
      alert("Error deleting blog post");
    } finally {
      setDeleting(false);
    }
  };

  if (!initialData) return <LoadingScreen />;

  return (
    <BlogPostForm
      mode="edit"
      postId={resolvedParams.id}
      initialData={initialData}
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
      deleting={deleting}
    />
  );
}
