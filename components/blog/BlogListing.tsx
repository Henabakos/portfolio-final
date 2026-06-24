"use client";

import { useCallback, useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";
import { BlogFilters } from "./BlogFilters";
import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import type { BlogListResponse, BlogSortOption } from "@/lib/blog/types";

export function BlogListing() {
  const [data, setData] = useState<BlogListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<BlogSortOption>("newest");
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        sort,
      });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);

      const response = await fetch(`/api/blog?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const result: BlogListResponse = await response.json();
      setData(result);
    } catch {
      setData({ posts: [], total: 0, page: 1, totalPages: 1, categories: [], tags: [] });
    } finally {
      setLoading(false);
    }
  }, [page, search, category, tag, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setPage(1);
  }, [search, category, tag, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setTag("");
    setPage(1);
  };

  if (loading && !data) return <LoadingScreen />;

  const featuredPosts = data?.posts.filter((p) => p.featured) || [];
  const regularPosts = data?.posts.filter((p) => !p.featured) || [];
  const showFeatured = page === 1 && !search && !category && !tag && featuredPosts.length > 0;

  return (
    <div className="min-h-screen pb-16">
      <header className="mb-10 md:mb-14">
        <p className="text-sm font-medium text-primary mb-2">Blog</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
          Ideas, tutorials & insights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Thoughts on design, development, and building products on the web.
        </p>
      </header>

      <BlogFilters
        search={search}
        category={category}
        tag={tag}
        sort={sort}
        categories={data?.categories || []}
        tags={data?.tags || []}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onTagChange={setTag}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading articles…</div>
      ) : !data?.posts.length ? (
        <div className="py-20 text-center">
          <h2 className="text-xl font-semibold mb-2">No articles found</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      ) : (
        <>
          {showFeatured && (
            <section className="mb-10" aria-label="Featured posts">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Featured
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {featuredPosts.slice(0, 1).map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
              </div>
            </section>
          )}

          <section aria-label="All articles">
            {showFeatured && regularPosts.length > 0 && (
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Latest articles
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {(showFeatured ? regularPosts : data.posts).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          {data.totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-4 mt-12"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
