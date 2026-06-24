"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import type { BlogPostInput } from "@/lib/blog/types";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: BlogPostInput) => {
    setSaving(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create");
      }
      localStorage.removeItem("blog-draft-new");
      router.push("/admin/blog");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error creating blog post");
    } finally {
      setSaving(false);
    }
  };

  return <BlogPostForm mode="create" onSave={handleSave} saving={saving} />;
}
