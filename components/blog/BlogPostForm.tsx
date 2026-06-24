"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Save, ArrowLeft, Plus, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { generateSlug } from "@/lib/blog/slug";
import { BLOG_CATEGORIES, type BlogPostInput } from "@/lib/blog/types";

interface BlogPostFormProps {
  mode: "create" | "edit";
  initialData?: Partial<BlogPostInput>;
  postId?: string;
  onSave: (data: BlogPostInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  saving?: boolean;
  deleting?: boolean;
}

const emptyPost: BlogPostInput = {
  title: "",
  subtitle: "",
  content: "",
  excerpt: "",
  coverImage: "",
  slug: "",
  category: "",
  published: false,
  featured: false,
  tags: [],
  author: "",
  seoTitle: "",
  seoDescription: "",
  publishedAt: null,
};

export function BlogPostForm({
  mode,
  initialData,
  postId,
  onSave,
  onDelete,
  saving = false,
  deleting = false,
}: BlogPostFormProps) {
  const [post, setPost] = useState<BlogPostInput>({
    ...emptyPost,
    ...initialData,
    tags: initialData?.tags || [],
  });
  const [newTag, setNewTag] = useState("");
  const [slugManual, setSlugManual] = useState(Boolean(initialData?.slug));

  const update = useCallback(
    (patch: Partial<BlogPostInput>) =>
      setPost((prev) => ({ ...prev, ...patch })),
    []
  );

  const handleTitleChange = (title: string) => {
    update({
      title,
      slug: slugManual ? post.slug : generateSlug(title),
      seoTitle: post.seoTitle || title,
    });
  };

  const handleSlugChange = (slug: string) => {
    setSlugManual(true);
    update({ slug });
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !post.tags?.includes(tag)) {
      update({ tags: [...(post.tags || []), tag] });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    update({ tags: (post.tags || []).filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    if (!post.title?.trim() || !post.content?.trim()) {
      alert("Please fill in title and content");
      return;
    }
    if (!post.slug?.trim()) {
      update({ slug: generateSlug(post.title) });
    }
    await onSave({ ...post, slug: post.slug || generateSlug(post.title) });
  };

  const autosaveKey = mode === "create" ? "blog-draft-new" : `blog-draft-${postId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm" type="button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Distraction-free writing with rich formatting
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Link href="/admin/blog">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving…" : mode === "create" ? "Publish" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="sr-only">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                className="text-2xl md:text-3xl font-bold border-0 border-b rounded-none px-0 h-auto py-3 focus-visible:ring-0"
              />
            </div>
            <div>
              <Label htmlFor="subtitle" className="sr-only">Subtitle</Label>
              <Input
                id="subtitle"
                value={post.subtitle || ""}
                onChange={(e) => update({ subtitle: e.target.value })}
                placeholder="Add a subtitle (optional)"
                className="text-lg text-muted-foreground border-0 border-b rounded-none px-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <RichTextEditor
            content={post.content}
            onChange={(content) => update({ content })}
            autosaveKey={autosaveKey}
            distractionFree
            placeholder="Tell your story… Type / for commands"
          />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={post.published}
                  onCheckedChange={(checked) => update({ published: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={post.featured}
                  onCheckedChange={(checked) => update({ featured: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Publish date</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={
                    post.publishedAt
                      ? new Date(post.publishedAt).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    update({
                      publishedAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={post.author || ""}
                  onChange={(e) => update({ author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={post.coverImage || ""}
                onChange={(url) => update({ coverImage: url })}
                placeholder="Upload cover image"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={post.category || ""}
                  onValueChange={(v) => update({ category: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(post.tags || []).map((tag, i) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)} aria-label={`Remove ${tag}`}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt || ""}
                  onChange={(e) => update({ excerpt: e.target.value })}
                  placeholder="Short preview for listings…"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO title</Label>
                <Input
                  id="seoTitle"
                  value={post.seoTitle || ""}
                  onChange={(e) => update({ seoTitle: e.target.value })}
                  placeholder={post.title || "SEO title"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO description</Label>
                <Textarea
                  id="seoDescription"
                  value={post.seoDescription || ""}
                  onChange={(e) => update({ seoDescription: e.target.value })}
                  placeholder="Meta description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex md:hidden flex-col gap-2">
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" onClick={handleSubmit} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
