# Complete Blog System Troubleshooting Guide

## Quick Fixes for Common Issues

### 1. Database Column Missing Error

**Error Message:**
```
The column `blog_posts.author` does not exist in the current database.
```

**Solution:**
```bash
# Option A: Set DATABASE_URL and run migration (Recommended)
export DATABASE_URL="postgresql://user:password@host:5432/db"
pnpm prisma migrate deploy

# Option B: Run SQL directly on your database
ALTER TABLE "blog_posts" ADD COLUMN "author" TEXT;

# Option C: Just use the system (migration will run on production)
# - The API has been updated to work without the column
# - No action needed if deploying to Vercel
```

**Why it happens:**
- The schema was updated to include `author` field
- Migration file exists but hasn't been applied to your database yet
- This is normal during development

---

### 2. Blog Headings/Lists Not Working

**Symptoms:**
- H1, H2, H3 buttons don't format text
- Bullet list button doesn't create lists
- Numbered list button doesn't create lists

**Solution:**
- ✅ This has been fixed in the latest code
- Make sure you're running the latest version
- Restart your dev server: `pnpm dev`
- Clear browser cache: `Ctrl+Shift+Delete`

**Technical Details:**
- Issue was in `StarterKit` configuration
- Fix: Explicitly enabled heading levels and list elements
- All buttons should now work immediately

---

### 3. Image Upload Not Working

**Symptoms:**
- Upload button doesn't open file picker
- Drag and drop doesn't work
- Pasting images shows error

**Solutions:**

a) **File picker doesn't open:**
```bash
# Make sure input ref is working
# Check browser console for errors
# Try uploading a small image (< 5MB)
```

b) **Upload fails (Cloudinary):**
```bash
# Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set
echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# If not set:
# 1. Go to Vercel dashboard
# 2. Settings → Vars
# 3. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# 4. Redeploy or restart dev server
```

c) **Drag and drop not working:**
- Make sure you're dragging image files
- Try: PNG, JPG, GIF, WebP
- Check file size (< 10MB recommended)

---

### 4. Rich Text Not Saving

**Symptoms:**
- Text formatting disappears after save
- Headings/lists missing from published post
- Plain text appears instead of formatted

**Solution:**

a) **Check browser console:**
```bash
# Open DevTools (F12)
# Go to Console tab
# Look for error messages
# Take note and check below
```

b) **Verify content is being sent:**
```bash
# Open Network tab in DevTools
# Create a blog post
# Find POST /api/blog request
# Check "Response" tab
# Should show created post with content
```

c) **Common causes:**
- Content field is empty (required field validation)
- Editor lost focus before saving
- API error (check response status)

---

### 5. Editor Buttons Not Visible

**Symptoms:**
- Toolbar is empty
- Buttons don't show up
- Icons missing

**Solution:**
```bash
# Clear cache and restart
rm -rf .next
pnpm dev

# If still not working:
# 1. Check browser developer tools (F12)
# 2. Check Console for errors
# 3. Verify lucide-react is installed
pnpm list lucide-react
```

---

### 6. Markdown Paste Not Converting

**Symptoms:**
- Pasting markdown from ChatGPT/GitHub just pastes plain text
- Code blocks not formatted
- Lists appear as plain text

**Solution:**

a) **Check if markdown is being detected:**
```typescript
// In browser console, test detection:
const content = `# Hello\n- Item 1\n- Item 2`;
// Should detect as markdown
```

b) **Make sure you're pasting markdown, not HTML:**
- Copy from ChatGPT: Works ✅
- Copy from GitHub README: Works ✅
- Copy from Notion: Works ✅
- Copy from Word: May not work (uses HTML)

c) **If paste isn't working:**
```bash
# Check remark is installed
pnpm list remark remark-gfm remark-html

# If missing, reinstall:
pnpm add remark remark-gfm remark-html
```

---

### 7. Blog Page Shows Empty

**Symptoms:**
- `/blog` page loads but no posts shown
- "No blog posts yet" message

**Possible Causes:**

a) **No published posts:**
```bash
# Check if posts are marked as published
# Admin → Blog → Check each post's publish status
```

b) **Posts in database but not showing:**
```sql
-- Check database
SELECT id, title, published FROM blog_posts;

-- Ensure published = true
UPDATE blog_posts SET published = true WHERE id = 'post-id';
```

c) **API not returning posts:**
```bash
# Test API directly
curl http://localhost:3000/api/blog

# Should return JSON array of published posts
```

---

### 8. Can't Create Blog Post

**Symptoms:**
- "Create Post" button doesn't work
- Form submission fails
- Gets stuck on loading

**Troubleshooting:**

a) **Check required fields:**
- Title: Must not be empty
- Content: Must have at least some text
- Slug: Auto-generated, can be edited
- All other fields optional

b) **Check for duplicate slug:**
```sql
-- If slug already exists
SELECT id, title FROM blog_posts WHERE slug = 'my-post-slug';

-- Use different slug or delete old post
DELETE FROM blog_posts WHERE id = 'old-post-id';
```

c) **Check API errors:**
```bash
# Open DevTools → Network tab
# Click Create Post
# Find POST request to /api/blog
# Check Response tab for error message
```

d) **Check database connection:**
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

### 9. Build Fails

**Error Examples:**
```
Error: Cannot find module '@tiptap/extension-table'
TypeError: lowlight is not defined
```

**Solutions:**

a) **Missing packages:**
```bash
# Reinstall all dependencies
pnpm install

# Or specific packages:
pnpm add @tiptap/extension-table lowlight
```

b) **Cache issues:**
```bash
# Clear next cache
rm -rf .next node_modules
pnpm install
pnpm build
```

c) **TypeScript errors:**
```bash
# Check types
pnpm tsc --noEmit

# If many errors, regenerate types
pnpm prisma generate
```

---

### 10. Performance Issues

**Symptoms:**
- Page loads slowly
- Editor is sluggish
- Images take forever to upload

**Solutions:**

a) **Too many syntax languages loaded:**
```typescript
// Currently loads: common languages
// If slow, can reduce to just: javascript, typescript, python, sql
// See: components/rich-text-editor.tsx line 61
```

b) **Large images:**
- Upload images < 5MB
- Use formats: JPG, WebP (smaller than PNG)
- Cloudinary auto-optimizes

c) **Database slow:**
```bash
# Check query performance
# Enable slow query log in PostgreSQL
# Typical response should be < 100ms
```

---

## Verification Checklist

Run these to verify everything is working:

### ✓ Prerequisites
```bash
# Check Node version (should be 18+)
node --version

# Check pnpm version
pnpm --version

# Verify .env files exist
ls -la .env* 2>/dev/null
```

### ✓ Dependencies
```bash
# All packages installed
pnpm list | grep -E "tiptap|lowlight|remark" | wc -l
# Should show 20+ related packages

# Check specific packages
pnpm list @tiptap/react
pnpm list lowlight
pnpm list remark
```

### ✓ Build
```bash
# Builds without errors
pnpm build

# TypeScript OK
pnpm tsc --noEmit --skipLibCheck
```

### ✓ Dev Server
```bash
# Starts successfully
pnpm dev

# Should show: "Ready in Xms"
```

### ✓ Database
```bash
# Migration exists
ls prisma/migrations/20260510143110_add_author_field/

# Schema updated
grep "author" prisma/schema.prisma

# If DATABASE_URL set:
# Migration applied
pnpm prisma migrate status
```

### ✓ Features
- [ ] Navigate to /admin/blog/new
- [ ] Type heading
- [ ] Select text
- [ ] Click H1 button → Text becomes large
- [ ] Click bullet button → Creates bullet list
- [ ] Click number button → Creates numbered list
- [ ] Try image upload
- [ ] Try markdown paste
- [ ] Click Create Post

---

## Getting Help

If issues persist:

1. **Check logs:**
```bash
# Dev server logs
# Look for red error messages
# Note the exact error
```

2. **Check database:**
```bash
# Check schema is correct
pnpm prisma studio

# Visual check of database
```

3. **Isolate the problem:**
- Try without images
- Try without markdown
- Try simpler content

4. **Look for patterns:**
- Does it always fail?
- Fails only with certain content?
- Fails on specific buttons?

5. **Check commit:**
```bash
git log --oneline -5
# Verify you have latest fixes
```

---

## Files to Check

If troubleshooting, examine:

### Core Files
- `components/rich-text-editor.tsx` - Editor configuration
- `app/api/blog/route.ts` - POST endpoint
- `app/api/blog/[id]/route.ts` - PUT endpoint
- `prisma/schema.prisma` - Database schema
- `prisma/migrations/` - Migration history

### Config Files
- `.env.local` - Local environment variables
- `.env.example` - Reference
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js config

### Documentation
- `DATABASE_MIGRATION_GUIDE.md` - Migration details
- `EDITOR_FUNCTIONALITY_TEST.md` - Feature tests
- `ADMIN_BLOG_QUICK_START.md` - User guide

---

## Known Limitations

1. **Image upload requires Cloudinary**
   - Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - Without it, image upload won't work

2. **Markdown paste needs actual markdown**
   - HTML pasted as HTML won't auto-convert
   - Plain text won't trigger markdown detection

3. **Large content**
   - Very large posts (> 10MB) may timeout
   - Use separate text files for large content

4. **Special characters**
   - Some special characters in slugs get removed
   - Use alphanumeric + hyphens for slugs

---

## Quick Recovery

If everything breaks:

```bash
# 1. Soft reset (keep changes)
rm -rf .next
pnpm dev

# 2. Medium reset (reinstall, keep db)
rm -rf node_modules .next
pnpm install
pnpm dev

# 3. Hard reset (development only, loses all blog data)
pnpm prisma migrate reset

# 4. Complete reset (last resort)
rm -rf .next node_modules
pnpm install
# Manually recreate your blog posts
```

---

## Still Need Help?

Check these docs in order:
1. This file - Common issues
2. DATABASE_MIGRATION_GUIDE.md - DB issues
3. ADMIN_BLOG_QUICK_START.md - Usage questions
4. EDITOR_FUNCTIONALITY_TEST.md - Feature testing

Good luck! 🚀
