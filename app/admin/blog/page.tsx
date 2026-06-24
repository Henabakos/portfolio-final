"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Calendar, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoadingScreen } from "@/components/loading-screen";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog?admin=true");
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await fetch(`/api/blog/${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      setPosts(
        posts.map((p) => (p.id === id ? { ...p, published: !published } : p))
      );
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {post.coverImage && (
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() =>
                            togglePublished(post.id, post.published)
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start sharing your thoughts and experiences
            </p>
            <Link href="/admin/blog/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
