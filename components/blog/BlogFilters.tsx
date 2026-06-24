"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { BlogSortOption } from "@/lib/blog/types";

interface BlogFiltersProps {
  search: string;
  category: string;
  tag: string;
  sort: BlogSortOption;
  categories: string[];
  tags: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: BlogSortOption) => void;
  onClear: () => void;
}

export function BlogFilters({
  search,
  category,
  tag,
  sort,
  categories,
  tags,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onClear,
}: BlogFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => setLocalSearch(search), [search]);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const hasFilters = search || category || tag;

  return (
    <div className="space-y-4" role="search" aria-label="Filter blog posts">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search articles…"
            className="pl-9"
            aria-label="Search articles"
          />
        </div>
        <Select value={sort} onValueChange={(v) => onSortChange(v as BlogSortOption)}>
          <SelectTrigger className="w-full sm:w-40" aria-label="Sort articles">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {categories.length > 0 && (
          <Select value={category || "all"} onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}>
            <SelectTrigger className="w-auto min-w-[140px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {tags.slice(0, 8).map((t) => (
          <Badge
            key={t}
            variant={tag === t ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1"
            onClick={() => onTagChange(tag === t ? "" : t)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onTagChange(tag === t ? "" : t)}
          >
            {t}
          </Badge>
        ))}

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
