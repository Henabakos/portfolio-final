# Blog Components Quick Reference Guide

## Component Usage Examples

### RichContentRenderer
Safely renders HTML content with comprehensive styling.

```tsx
import { RichContentRenderer } from "@/components/blog";

export function BlogPost() {
  return (
    <RichContentRenderer 
      html={htmlContent}
      className="max-w-none"
    />
  );
}
```

**Props:**
- `html: string` - HTML content to render (required)
- `className?: string` - Additional CSS classes (optional)

**Features:**
- Automatically sanitizes HTML
- Adds IDs to headings for anchor linking
- Applies comprehensive prose styling
- Full dark/light mode support

---

### TableOfContents
Interactive table of contents with responsive design.

```tsx
import { TableOfContents } from "@/components/blog";

export function BlogDetail() {
  return (
    <>
      {/* Desktop: Sticky sidebar */}
      <aside className="hidden lg:block">
        <TableOfContents htmlContent={content} />
      </aside>
      
      {/* Mobile: Collapsible */}
      <div className="lg:hidden">
        <TableOfContents htmlContent={content} />
      </div>
    </>
  );
}
```

**Props:**
- `htmlContent: string` - HTML content to extract headings from (required)
- `className?: string` - Additional CSS classes (optional)

**Features:**
- Automatically extracts H2-H3 headings
- Sticky positioning on desktop
- Collapsible drawer on mobile
- Active heading highlighting
- Smooth scroll-to-section behavior
- Touch-friendly on mobile

---

### BlogMetadata
Displays author, date, reading time, and tags.

```tsx
import { BlogMetadata } from "@/components/blog";

export function BlogPost({ post }) {
  return (
    <BlogMetadata
      author={post.author}
      createdAt={post.createdAt}
      readingTime={calculateReadingTime(post.content)}
      tags={post.tags}
      className="py-4 border-y"
    />
  );
}
```

**Props:**
- `author?: string` - Author name (optional)
- `createdAt: string` - ISO date string (required)
- `readingTime: number` - Reading time in minutes (required)
- `tags?: string[]` - Array of tag strings (optional)
- `className?: string` - Additional CSS classes (optional)

**Features:**
- Formatted date display (e.g., "January 15, 2024")
- Reading time display (e.g., "5 min read")
- Tag badges with styling
- Responsive metadata layout
- Semantic HTML with `<time>` element

---

## Utility Functions

### calculateReadingTime
Calculate estimated reading time from HTML content.

```tsx
import { calculateReadingTime } from "@/components/blog";

const minutes = calculateReadingTime(htmlContent);
console.log(minutes); // 5 (minutes)
```

**Parameters:**
- `htmlContent: string` - HTML content (required)

**Returns:** `number` - Reading time in minutes (minimum 1)

**Algorithm:**
- Removes all HTML tags
- Counts words (space-separated)
- Divides by 200 (words per minute)
- Returns ceiling value

---

### formatReadingTime
Format reading time for display.

```tsx
import { formatReadingTime } from "@/components/blog";

const display = formatReadingTime(5);
console.log(display); // "5 min read"
```

**Parameters:**
- `minutes: number` - Reading time in minutes (required)

**Returns:** `string` - Formatted reading time text

---

### extractHeadings
Extract all headings from HTML content.

```tsx
import { extractHeadings, type Heading } from "@/components/blog";

const headings: Heading[] = extractHeadings(htmlContent);
headings.forEach(h => {
  console.log(`${h.level}: ${h.text} (id: ${h.id})`);
});
```

**Parameters:**
- `htmlContent: string` - HTML content (required)

**Returns:** `Heading[]` - Array of extracted headings

**Heading Interface:**
```ts
interface Heading {
  id: string;        // Unique, URL-safe ID
  level: number;     // 1-6 (h1-h6)
  text: string;      // Clean heading text
}
```

---

### addHeadingIds
Add IDs to headings in HTML content for anchor linking.

```tsx
import { addHeadingIds } from "@/components/blog";

const htmlWithIds = addHeadingIds(htmlContent);
// Transforms: <h2>Section Title</h2>
// To: <h2 id="section-title">Section Title</h2>
```

**Parameters:**
- `htmlContent: string` - HTML content (required)

**Returns:** `string` - HTML with added heading IDs

---

## CSS Classes

### .rich-content
Main wrapper class for rich text styling.

```tsx
<div className="rich-content">
  <RichContentRenderer html={content} />
</div>
```

**Includes styling for:**
- All heading levels (h1-h6)
- Paragraphs and text formatting
- Lists (ordered and unordered)
- Blockquotes
- Code blocks and inline code
- Links and images
- Tables
- Horizontal rules

---

## Dark Mode Support

All components automatically support dark mode through Tailwind's dark mode class. No additional configuration needed.

```tsx
// Automatically styled for light and dark modes
<div className="dark">
  <BlogMetadata {...props} />
</div>
```

---

## Responsive Behavior

### Desktop (lg and up)
- Table of Contents: Sticky right sidebar
- Layout: 3-column grid (TOC | Content | Space)
- Images: Full width with proper aspect ratio
- Typography: Larger font sizes

### Tablet (md to lg)
- Table of Contents: Visible but not sticky
- Layout: Adjusts spacing
- Images: Responsive sizing
- Metadata: Full row display

### Mobile (below md)
- Table of Contents: Collapsible drawer
- Layout: Single column, stacked
- Images: Full width with padding
- Metadata: Compact display

---

## Common Patterns

### Full Blog Post Page
```tsx
import { RichContentRenderer, TableOfContents, BlogMetadata } from "@/components/blog";
import { calculateReadingTime } from "@/components/blog";

export function BlogPost({ post }) {
  const readingTime = calculateReadingTime(post.content);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Desktop TOC */}
      <div className="hidden lg:block">
        <TableOfContents htmlContent={post.content} />
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-3">
        <h1>{post.title}</h1>
        
        <BlogMetadata
          author={post.author}
          createdAt={post.createdAt}
          readingTime={readingTime}
          tags={post.tags}
        />
        
        {/* Mobile TOC */}
        <div className="lg:hidden">
          <TableOfContents htmlContent={post.content} />
        </div>
        
        <RichContentRenderer html={post.content} />
      </div>
    </div>
  );
}
```

---

## Performance Tips

1. **Memoize reading time calculation** for better performance
   ```tsx
   const readingTime = useMemo(() => 
     calculateReadingTime(content),
     [content]
   );
   ```

2. **Load content asynchronously** to avoid blocking rendering
   ```tsx
   const { data } = useSWR('/api/blog/[id]', fetcher);
   ```

3. **Use Next.js Image component** for optimal image performance
   ```tsx
   <Image src={post.coverImage} alt={post.title} />
   ```

---

## Troubleshooting

### Table of Contents not showing
- Ensure content has H2 or H3 headings
- Check that htmlContent is not empty
- Verify class names are applied correctly

### Reading time seems wrong
- Ensure HTML tags are properly formatted
- Check that content has been cleaned of script tags
- Use calculateReadingTime() on actual content, not excerpt

### Dark mode styling not working
- Ensure dark mode is enabled in layout
- Check that Tailwind dark mode is configured
- Verify CSS variable overrides in globals.css

### Headings not getting IDs
- Ensure HTML structure is valid
- Check regex patterns match your heading format
- Verify content doesn't have nested heading tags

---

## Related Files
- `components/blog/RichContentRenderer.tsx`
- `components/blog/TableOfContents.tsx`
- `components/blog/BlogMetadata.tsx`
- `components/blog/utils/readingTime.ts`
- `components/blog/utils/headingParser.ts`
- `app/blog/[id]/page.tsx` - Blog detail page example
- `app/blog/page.tsx` - Blog listing page example
- `app/globals.css` - Rich content styling
