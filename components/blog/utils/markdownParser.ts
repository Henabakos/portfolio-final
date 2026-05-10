import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * Parse markdown content to HTML
 * Supports GitHub Flavored Markdown (GFM) including tables, strikethrough, etc.
 */
export function parseMarkdownToHtml(markdown: string): string {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml);

    const result = processor.processSync(markdown);
    return String(result);
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return markdown;
  }
}

/**
 * Detect if pasted content appears to be markdown
 * Looks for common markdown patterns
 */
export function isMarkdownContent(text: string): boolean {
  const markdownPatterns = [
    /^#+\s+.+$/m, // Headings
    /^\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_/m, // Bold/italic
    /^\-\s+.+$|^\*\s+.+$|^\d+\.\s+.+$/m, // Lists
    /^\>\s+.+$/m, // Blockquotes
    /```[\s\S]*?```/m, // Code blocks
    /\[.+\]\(.+\)/m, // Links
    /^\|.+\|.+\|/m, // Tables
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}

/**
 * Clean HTML content from paste operations
 * Removes script tags, styles, and other dangerous content
 */
export function cleanHtmlContent(html: string): string {
  // Remove script tags and content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove style tags and content
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove onclick, onload, and other event handlers
  html = html.replace(
    /\s*on(?:click|load|error|change|submit|focus|blur|keypress|keydown|keyup|mouseenter|mouseleave|scroll)\s*=\s*["'][^"']*["']/gi,
    ""
  );

  // Remove data attributes that could contain scripts
  html = html.replace(/\s*data-[^=]*=\s*["'][^"']*["']/gi, "");

  return html;
}

/**
 * Extract plain text from HTML
 * Useful for getting excerpt or plain text version
 */
export function extractPlainText(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  text = decodeHtmlEntities(text);

  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Get excerpt from content
 * Extracts first N characters and adds ellipsis
 */
export function getExcerpt(html: string, length: number = 160): string {
  const plainText = extractPlainText(html);
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length) + "...";
}

/**
 * Normalize heading IDs for table of contents
 * Ensures they're unique and URL-safe
 */
export function normalizeHeadingId(text: string, index: number = 0): string {
  let id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single

  if (index > 0) {
    id = `${id}-${index}`;
  }

  return id;
}

/**
 * Convert HTML to TipTap-compatible JSON structure
 * Useful for loading existing HTML into the editor
 */
export function htmlToTipTapJson(html: string): Record<string, any> {
  // Create a temporary DOM element
  if (typeof document === "undefined") {
    // Server-side fallback
    return { type: "doc", content: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const content = Array.from(doc.body.childNodes)
    .map((node) => domNodeToTipTap(node))
    .filter(Boolean);

  return {
    type: "doc",
    content,
  };
}

/**
 * Convert a DOM node to TipTap JSON format
 */
function domNodeToTipTap(node: Node): Record<string, any> | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (!text || !text.trim()) return null;

    return {
      type: "paragraph",
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as Element;
  const tag = element.tagName.toLowerCase();

  const commonAttrs = {
    level: undefined as number | undefined,
  };

  switch (tag) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      commonAttrs.level = parseInt(tag[1], 10);
      return {
        type: "heading",
        attrs: { level: commonAttrs.level },
        content: extractTextContent(element),
      };

    case "p":
      return {
        type: "paragraph",
        content: extractTextContent(element),
      };

    case "blockquote":
      return {
        type: "blockquote",
        content: Array.from(element.childNodes)
          .map((child) => domNodeToTipTap(child))
          .filter(Boolean),
      };

    case "ul":
      return {
        type: "bulletList",
        content: Array.from(element.querySelectorAll(":scope > li"))
          .map((li) => ({
            type: "listItem",
            content: extractTextContent(li as Element),
          }))
          .filter(Boolean),
      };

    case "ol":
      return {
        type: "orderedList",
        content: Array.from(element.querySelectorAll(":scope > li"))
          .map((li) => ({
            type: "listItem",
            content: extractTextContent(li as Element),
          }))
          .filter(Boolean),
      };

    case "pre":
    case "code":
      return {
        type: "codeBlock",
        attrs: { language: "javascript" },
        content: [
          {
            type: "text",
            text: element.textContent || "",
          },
        ],
      };

    case "img":
      return {
        type: "image",
        attrs: {
          src: (element as HTMLImageElement).src,
          alt: (element as HTMLImageElement).alt || "",
          title: (element as HTMLImageElement).title || "",
        },
      };

    case "a":
      return {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: element.textContent || "",
            marks: [
              {
                type: "link",
                attrs: {
                  href: (element as HTMLAnchorElement).href,
                },
              },
            ],
          },
        ],
      };

    default:
      return null;
  }
}

/**
 * Extract text content with marks (bold, italic, etc.)
 */
function extractTextContent(element: Element): Array<Record<string, any>> {
  const content: Array<Record<string, any>> = [];

  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) {
        content.push({ type: "text", text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();

      let textContent: Record<string, any> = {
        type: "text",
        text: el.textContent || "",
      };

      if (tag === "strong" || tag === "b") {
        textContent.marks = [{ type: "bold" }];
      } else if (tag === "em" || tag === "i") {
        textContent.marks = [{ type: "italic" }];
      } else if (tag === "u") {
        textContent.marks = [{ type: "underline" }];
      }

      if (textContent.text) {
        content.push(textContent);
      }
    }
  });

  return content.length > 0 ? content : [{ type: "text", text: "" }];
}
