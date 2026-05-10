"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { addHeadingIds } from "./utils/headingParser";

interface RichContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Safely renders rich HTML content with comprehensive styling
 * Sanitizes dangerous content while preserving formatting
 */
export function RichContentRenderer({
  html,
  className = "",
}: RichContentRendererProps) {
  // Process HTML: sanitize and add IDs to headings
  const processedHtml = useMemo(() => {
    const cleaned = DOMPurify.sanitize(html);
    return addHeadingIds(cleaned);
  }, [html]);

  return (
    <div
      className={`rich-content prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
