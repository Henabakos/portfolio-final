"use client";

import React, { useMemo, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { addHeadingIds } from "./utils/headingParser";
import { highlightCode, getLanguageName } from "./utils/syntaxHighlight";

interface RichContentRendererProps {
  html: string;
  className?: string;
}

const SANITIZE_CONFIG = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "target",
    "rel",
    "class",
    "style",
    "data-width",
    "data-caption",
    "allow",
    "allowfullscreen",
    "frameborder",
    "src",
  ],
};

export function RichContentRenderer({
  html,
  className = "",
}: RichContentRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    const cleaned = DOMPurify.sanitize(html, SANITIZE_CONFIG);
    return addHeadingIds(cleaned);
  }, [html]);

  useEffect(() => {
    if (!containerRef.current) return;

    const codeBlocks = containerRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const parent = block.parentElement;
      if (!parent || parent.tagName !== "PRE") return;
      if (parent.querySelector(".code-block-wrapper")) return;

      const language =
        block.className.replace("language-", "").trim() || "plaintext";
      const code = block.textContent || "";
      const highlighted = highlightCode(code, language);

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";

      const header = document.createElement("div");
      header.className = "code-block-header";

      const langLabel = document.createElement("span");
      langLabel.className = "code-language-label";
      langLabel.textContent = getLanguageName(language);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "code-copy-button";
      copyBtn.setAttribute("aria-label", "Copy code");
      copyBtn.innerHTML = `<span class="copy-icon">${copyIconSvg}</span>`;

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = `<span class="copy-icon">${checkIconSvg}</span> Copied`;
          setTimeout(() => {
            copyBtn.innerHTML = `<span class="copy-icon">${copyIconSvg}</span>`;
          }, 2000);
        } catch {
          /* ignore */
        }
      });

      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      const codeWrapper = document.createElement("div");
      codeWrapper.className = "code-content";
      codeWrapper.innerHTML = highlighted;

      wrapper.appendChild(header);
      wrapper.appendChild(codeWrapper);
      parent.innerHTML = "";
      parent.appendChild(wrapper);
    });

    const tables = containerRef.current.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentElement?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Enhance image figures with captions from data-caption
    const images = containerRef.current.querySelectorAll("img[data-caption]");
    images.forEach((img) => {
      if (img.closest("figure")) return;
      const caption = img.getAttribute("data-caption");
      if (!caption) return;
      const figure = document.createElement("figure");
      figure.className = "blog-image-figure";
      const figcaption = document.createElement("figcaption");
      figcaption.className = "blog-image-caption";
      figcaption.textContent = caption;
      img.parentNode?.insertBefore(figure, img);
      figure.appendChild(img);
      figure.appendChild(figcaption);
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

const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const checkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
