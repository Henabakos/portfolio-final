"use client";

import React, { useMemo, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { addHeadingIds } from "./utils/headingParser";
import { highlightCode, getLanguageName } from "./utils/syntaxHighlight";

interface RichContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Safely renders rich HTML content with comprehensive styling
 * Sanitizes dangerous content, adds syntax highlighting, and preserves formatting
 */
export function RichContentRenderer({
  html,
  className = "",
}: RichContentRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Process HTML: sanitize, add IDs to headings, and enhance code blocks
  const processedHtml = useMemo(() => {
    const cleaned = DOMPurify.sanitize(html);
    return addHeadingIds(cleaned);
  }, [html]);

  // Apply syntax highlighting to code blocks after render
  useEffect(() => {
    if (!containerRef.current) return;

    // Find all code blocks
    const codeBlocks = containerRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const language = block.className
        .replace("language-", "")
        .trim() || "plaintext";
      const code = block.textContent || "";
      const highlighted = highlightCode(code, language);

      // Wrap code block with language label
      const parent = block.parentElement;
      if (parent && parent.tagName === "PRE") {
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";

        const langLabel = document.createElement("div");
        langLabel.className = "code-language-label";
        langLabel.textContent = getLanguageName(language);

        const codeWrapper = document.createElement("div");
        codeWrapper.className = "code-content";
        codeWrapper.innerHTML = highlighted;

        wrapper.appendChild(langLabel);
        wrapper.appendChild(codeWrapper);

        parent.innerHTML = "";
        parent.appendChild(wrapper);
      }
    });

    // Add responsive table wrapper
    const tables = containerRef.current.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement?.className !== "table-wrapper") {
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper";
        table.parentElement?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }, [processedHtml]);

  return (
    <div
      ref={containerRef}
      className={`rich-content prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
