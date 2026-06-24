# Rich Text Editor with Markdown Support

## Overview

The enhanced RichTextEditor component provides a professional, feature-rich editing experience with full markdown support, image uploads, syntax highlighting, and code blocks.

## Features

### Core Editing Features
- **Bold, Italic, Strikethrough** - Text formatting controls
- **Headings** - Support for H1, H2, H3 heading levels
- **Lists** - Bullet lists and numbered lists with nesting
- **Blockquotes** - Quote formatting
- **Code Blocks** - Full syntax highlighting support
- **Tables** - Insert and edit tables with headers
- **Links** - Add clickable links to text
- **Colors** - Text color selection with palette and custom colors
- **Undo/Redo** - Full undo/redo history

### Markdown Support
The editor automatically detects and converts markdown content from:
- ChatGPT, Claude, and other AI tools
- GitHub markdown documents
- Notion pages
- Any markdown source

When you paste markdown, it's automatically converted to rich text with proper formatting preserved.

### Image Handling
- **Drag and Drop** - Drop images directly into the editor
- **Paste from Clipboard** - Copy an image and paste into the editor
- **File Upload** - Click the upload button to select from your computer
- **Cloudinary Integration** - Images are automatically uploaded and stored
- **Preview** - See images immediately in the editor

### Syntax Highlighting
Supports 30+ programming languages including:
- JavaScript/TypeScript
- Python
- Java, C++, C#, Go, Rust
- HTML, CSS, SCSS, Less
- JSON, YAML, TOML
- SQL, GraphQL
- And many more...

## Usage

### In Admin Pages
The editor is used in the blog post creation and editing pages:

```typescript
import { RichTextEditor } from "@/components/rich-text-editor";

<RichTextEditor
  content={post.content}
  onChange={(content) => setPost({ ...post, content })}
  placeholder="Write your blog post content here..."
/>
```

### Props
- `content` (string) - The HTML content to display in the editor
- `onChange` (function) - Callback when content changes, receives HTML string
- `placeholder` (string, optional) - Placeholder text to show when empty

### Toolbar Overview

The toolbar is organized into sections:

1. **Text Formatting** (Bold, Italic, Strikethrough)
2. **Headings** (H1, H2, H3)
3. **Lists & Blocks** (Bullet list, Ordered list, Quote, Code block)
4. **Media & Links** (Upload image, Image URL, Table, Link)
5. **Colors** (Text color picker)
6. **Undo/Redo**

### Keyboard Shortcuts

Common keyboard shortcuts work in the editor:
- `Ctrl+B` or `Cmd+B` - Bold
- `Ctrl+I` or `Cmd+I` - Italic
- `Ctrl+Z` or `Cmd+Z` - Undo
- `Ctrl+Shift+Z` or `Cmd+Shift+Z` - Redo
- `Enter` in lists - Add list item
- `Tab` in lists - Indent
- `Shift+Tab` in lists - Dedent

## Paste Handling

### Markdown Detection
The editor automatically detects markdown by looking for patterns like:
- Headings: `# Heading`
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Lists: `- item` or `1. item`
- Code: `` `code` `` or ` ```code``` `
- Links: `[text](url)`
- Tables: `| header |`

### Image Paste
When you paste images:
1. Image is detected and preview appears immediately
2. Upload starts automatically in the background
3. Progress indicator shows upload status
4. Image URL is inserted once upload completes
5. You can continue editing while upload happens

### HTML Paste
When pasting HTML content:
- All dangerous content (scripts, styles, handlers) is removed
- HTML structure is preserved
- Formatting is converted to rich text

## Content Rendering

### RichContentRenderer Component
Used to display blog post content with enhanced formatting:

```typescript
import { RichContentRenderer } from "@/components/blog/RichContentRenderer";

<RichContentRenderer html={post.content} />
```

### Features
- **Sanitization** - Removes dangerous content while preserving formatting
- **Syntax Highlighting** - Code blocks are highlighted with colors
- **Responsive Tables** - Tables wrap on mobile devices
- **Language Labels** - Code blocks show the language name
- **Proper Typography** - Semantic HTML with optimal spacing

## Utilities

### markdownParser.ts
Utilities for parsing and converting markdown:

```typescript
import { 
  parseMarkdownToHtml,
  isMarkdownContent,
  extractPlainText,
  getExcerpt
} from "@/components/blog/utils/markdownParser";

// Parse markdown to HTML
const html = parseMarkdownToHtml("# Hello\nWorld");

// Check if text is markdown
if (isMarkdownContent(pastedText)) {
  // Handle as markdown
}

// Extract plain text
const text = extractPlainText(html);

// Get excerpt for preview
const excerpt = getExcerpt(html, 160);
```

### syntaxHighlight.ts
Code syntax highlighting utilities:

```typescript
import { 
  highlightCode,
  getLanguageName,
  getSupportedLanguages
} from "@/components/blog/utils/syntaxHighlight";

// Highlight code
const highlighted = highlightCode("console.log('hello')", "javascript");

// Get display name
const name = getLanguageName("js"); // "JavaScript"

// Get all supported languages
const langs = getSupportedLanguages();
```

## Database Schema

Added `author` field to BlogPost model:

```prisma
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  excerpt     String?
  coverImage  String?
  slug        String   @unique
  published   Boolean  @default(false)
  tags        String[]
  author      String?  // NEW: Author name
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("blog_posts")
}
```

Run migration to apply this change:
```bash
npx prisma migrate dev --name add_author_to_blog_post
```

## API Routes

### Create Blog Post
```
POST /api/blog
Content-Type: application/json

{
  "title": "Post Title",
  "content": "<p>HTML content</p>",
  "excerpt": "Short description",
  "coverImage": "https://...",
  "slug": "post-slug",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "published": true
}
```

### Update Blog Post
```
PUT /api/blog/[id]
Content-Type: application/json

// Same payload as POST
```

### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data

FormData {
  file: File
}

Response:
{
  "url": "https://cloudinary.com/...",
  "public_id": "portfolio/...",
  "name": "image.jpg",
  "size": 12345,
  "type": "image/jpeg"
}
```

## Styling

### Editor Styling
The editor uses Tailwind CSS classes:
- `prose prose-lg` - Typography preset
- `dark:prose-invert` - Dark mode support
- `min-h-[300px]` - Minimum height
- `rounded-lg` - Border radius

### Code Block Styling
Custom dark theme:
- Background: `bg-slate-950`
- Text: `text-slate-100`
- Language label: `text-slate-400`
- Syntax colors: Green (strings), Blue (numbers), Pink (keywords), etc.

### Table Styling
- `table-wrapper` class for responsive overflow
- Alternating row colors
- Proper borders and padding
- Dark mode support

## Performance Considerations

### Bundle Size
- Highlight.js is lazy-loaded only when rendering code blocks
- TipTap extensions are bundled only when needed
- Markdown parser is tree-shaken to remove unused features

### Optimization
- Image uploads happen asynchronously without blocking editing
- Syntax highlighting is cached after first use
- Content updates are debounced to prevent excessive re-renders

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Images Not Uploading
1. Check Cloudinary credentials in environment variables
2. Ensure image size is under 5MB
3. Check file type (JPEG, PNG, WebP, GIF supported)
4. Check console for error messages

### Markdown Not Detecting
- Make sure you're copying from a markdown source
- Check if the content has typical markdown patterns
- Manually select content and paste

### Syntax Highlighting Not Working
- Verify the language name is correct
- Check if language is in supported list
- Reload page to reset highlight.js cache

### Table Issues
- Use "Insert Table" button for best results
- Edit cells by clicking and typing
- Use Tab to move between cells
- Ensure tables have headers for proper styling

## Examples

### Creating a Blog Post with Markdown
1. Write or copy markdown content
2. Paste into editor - markdown is auto-detected
3. Edit as needed using toolbar
4. Add cover image via drag-and-drop
5. Set author name and tags
6. Click "Publish" and save

### Adding Code Example
1. Click code block button
2. Paste your code
3. Language is auto-detected
4. Code is highlighted with syntax colors
5. Language label appears at top

### Inserting Images
1. Click upload button (camera with arrow up)
2. Select image from computer, OR
3. Copy image and paste into editor, OR
4. Drag image into editor
5. Image appears with loading indicator
6. Automatically uploads to Cloudinary

## Future Improvements

Potential enhancements:
- AI-powered content suggestions
- Collaborative editing
- Version history
- Comment threads
- SEO optimization tools
- Reading time calculation
- Custom CSS styling
- Export to multiple formats
