# Rich Text Editor - Functionality Test Guide

## Complete Test Checklist

This guide verifies that all rich text editor features are working correctly.

### Text Formatting Features

#### ✓ Bold Text
- **How to test**: Type text → Select it → Click Bold button (B icon) OR press Ctrl+B
- **Expected**: Text becomes bold
- **Verification**: Bold button highlights when bold text is selected

#### ✓ Italic Text
- **How to test**: Type text → Select it → Click Italic button (I icon) OR press Ctrl+I
- **Expected**: Text becomes italic
- **Verification**: Italic button highlights when italic text is selected

#### ✓ Strikethrough Text
- **How to test**: Type text → Select it → Click Strikethrough button
- **Expected**: Line through the text appears
- **Verification**: Button highlights when strikethrough text is selected

### Heading Features (NOW FIXED)

#### ✓ Heading 1 (H1)
- **How to test**: Click H1 button in toolbar
- **Expected**: Current line becomes H1 heading (large text)
- **Verification**: 
  - H1 button highlights when on H1 heading
  - Text displays as large heading
  - Can toggle on/off by clicking button again

#### ✓ Heading 2 (H2)
- **How to test**: Click H2 button in toolbar
- **Expected**: Current line becomes H2 heading (medium text)
- **Verification**:
  - H2 button highlights when on H2 heading
  - Text displays as medium heading
  - Appears in Table of Contents

#### ✓ Heading 3 (H3)
- **How to test**: Click H3 button in toolbar
- **Expected**: Current line becomes H3 heading (smaller text)
- **Verification**:
  - H3 button highlights when on H3 heading
  - Text displays as small heading

### List Features (NOW FIXED)

#### ✓ Bullet List
- **How to test**: 
  1. Click Bullet List button (bullet point icon)
  2. Type items
  3. Press Enter for new items
  4. Press Backspace twice to exit list
- **Expected**: 
  - Bulleted list appears with indentation
  - Each item has a bullet point
  - Items can be nested (Tab to indent)
- **Verification**:
  - Bullet List button highlights when in a bullet list
  - Bullets display correctly

#### ✓ Ordered (Numbered) List
- **How to test**:
  1. Click Ordered List button (numbered list icon)
  2. Type items
  3. Press Enter for new items
  4. Press Backspace twice to exit list
- **Expected**:
  - Numbered list appears (1, 2, 3...)
  - Each item is numbered automatically
  - Items can be nested
- **Verification**:
  - Ordered List button highlights when in numbered list
  - Numbers increment properly

#### ✓ Mixed Lists
- **How to test**: Start bullet list, press Tab on an item to nest it, create an ordered list inside
- **Expected**: Nested lists with different types work together
- **Verification**: Both bullet and number icons highlight appropriately

### Block Elements

#### ✓ Blockquote
- **How to test**: Click Quote button (blockquote icon)
- **Expected**: Text indented with left border, styled differently
- **Verification**: Quote button highlights when on blockquote

#### ✓ Code Block
- **How to test**: Click Code Block button (code icon)
- **Expected**: Dark code block appears with monospace font
- **Verification**:
  - Code block highlights with dark background
  - Can specify language (javascript, python, etc.)
  - Syntax highlighting works for supported languages

### Color Features

#### ✓ Text Color
- **How to test**:
  1. Select text
  2. Click Color button (palette icon)
  3. Click a color or use custom color picker
- **Expected**: Selected text changes color
- **Verification**:
  - Color indicator shows on button
  - Text displays in selected color

#### ✓ Color Removal
- **How to test**: Select colored text → Click Color button → Click "Remove Color"
- **Expected**: Text returns to default color

### Link Features

#### ✓ Add Link
- **How to test**:
  1. Select text (e.g., "Click here")
  2. Click Link button
  3. Paste or type URL in prompt
- **Expected**: Text becomes blue and underlined, clickable
- **Verification**: Link button highlights when on a link

### Image Features

#### ✓ Upload Image
- **How to test**: Click Upload button (upload icon) → Select an image file
- **Expected**:
  - Loading spinner shows
  - Image uploads to Cloudinary
  - Image appears in editor
- **Verification**:
  - Image displays inline with text
  - Responsive sizing on different screens

#### ✓ Paste Image
- **How to test**: Copy image → Paste into editor (Ctrl+V)
- **Expected**: Image uploads and appears (same as upload)
- **Verification**: Same as upload image

#### ✓ Drag & Drop Image
- **How to test**: Drag image from file explorer into editor
- **Expected**: Image uploads and appears
- **Verification**: Same as upload image

#### ✓ Image from URL
- **How to test**: Click Image from URL button → Paste URL
- **Expected**: Image loads directly from URL without uploading
- **Verification**: Image displays inline

### Table Features

#### ✓ Insert Table
- **How to test**: Click Table button
- **Expected**: 3x3 table appears with header row
- **Verification**:
  - Table cells are editable
  - Can add/delete rows and columns

### Markdown Support

#### ✓ Paste Markdown
- **How to test**: Copy markdown from GitHub/ChatGPT/Notion → Paste into editor
- **Expected**: Markdown converts to rich text automatically
- **Verification**:
  - Headings, lists, bold, links all convert
  - Formatting is preserved

#### ✓ Markdown Examples
- **GitHub README**: Copy entire README → Paste → Converts properly
- **ChatGPT Response**: Copy code blocks → Auto-converted with syntax highlighting
- **Notion Export**: Copy formatted content → Converts to rich text

### Undo/Redo

#### ✓ Undo (Ctrl+Z)
- **How to test**: Make changes → Click Undo button OR press Ctrl+Z
- **Expected**: Last action is undone
- **Verification**: Undo button grayed out when nothing to undo

#### ✓ Redo (Ctrl+Y)
- **How to test**: Undo something → Click Redo button OR press Ctrl+Y
- **Expected**: Undone action is redone
- **Verification**: Redo button grayed out when nothing to redo

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl+B (Win) / Cmd+B (Mac) |
| Italic | Ctrl+I (Win) / Cmd+I (Mac) |
| Code | Ctrl+` (backtick) |
| Heading 1 | Ctrl+Alt+1 |
| Heading 2 | Ctrl+Alt+2 |
| Heading 3 | Ctrl+Alt+3 |
| Bullet List | Ctrl+Shift+8 |
| Ordered List | Ctrl+Shift+7 |
| Blockquote | Ctrl+Shift+B |
| Undo | Ctrl+Z |
| Redo | Ctrl+Y or Ctrl+Shift+Z |

## Admin Blog Post Creation Test

### Complete Workflow Test

1. **Navigate to Admin**
   - Go to `/admin/blog/new`
   - Page loads successfully
   - All fields visible

2. **Fill in Post Details**
   - **Title**: Test Blog Post with Headings (Required)
   - **Slug**: test-blog-post-with-headings (Auto-generated or manual)
   - **Author**: Your Name
   - **Excerpt**: A brief description of the post
   - **Cover Image**: Upload or use URL

3. **Test Editor in Context**
   - Click in content editor
   - Type "Main Title"
   - Select all → Click H1 → Verify it becomes heading
   - Press Enter
   - Type "Section 1"
   - Select → Click H2 → Verify it becomes heading
   - Press Enter
   - Type "First item" → Click Bullet List → Press Enter
   - Type "Second item" → Verify bullet appears
   - Add some code: Click Code Block → Type `console.log("test")`
   - Click Table → Insert sample data
   - Add an image via upload

4. **Add Tags**
   - Type tag name
   - Click add or press comma
   - Verify tags appear

5. **Publish**
   - Check "Publish immediately" checkbox
   - Click "Create Post" button
   - Verify success message
   - Post appears in blog listing

6. **Verify on Public Blog**
   - Navigate to `/blog`
   - Find your new post
   - Click to view
   - Verify all formatting displays correctly:
     - Headings are styled properly
     - Lists appear with bullets/numbers
     - Code block has syntax highlighting
     - Table displays responsive
     - Images load
     - Author name shows
     - Reading time calculated

## Performance Tests

#### Page Load Time
- **Test**: Measure time from page load to editor ready
- **Expected**: < 2 seconds
- **Verification**: Dev tools Network tab

#### Image Upload Speed
- **Test**: Upload 1MB image
- **Expected**: < 3 seconds
- **Verification**: Progress feedback with spinner

#### Editor Responsiveness
- **Test**: Type rapidly, apply formatting
- **Expected**: No lag, instant response
- **Verification**: Smooth typing experience

## Mobile Responsiveness Test

#### Toolbar on Mobile
- **Test**: Open editor on mobile (320px, 480px widths)
- **Expected**: Toolbar scrolls horizontally, stays accessible
- **Verification**: Can tap all buttons

#### Content Display on Mobile
- **Test**: View published post on mobile
- **Expected**:
  - Tables scroll horizontally
  - Images scale down
  - Text remains readable
  - TOC collapses into drawer

## Browser Compatibility Test

Test in:
- ✓ Chrome/Chromium
- ✓ Firefox
- ✓ Safari
- ✓ Edge

**Expected**: All features work identically across browsers

## Security Tests

#### HTML Sanitization
- **Test**: Try to paste `<script>alert('xss')</script>`
- **Expected**: Script tags removed, no alert
- **Verification**: Check inspector, no script tag present

#### File Upload Validation
- **Test**: Try to upload non-image file
- **Expected**: Upload fails with error message
- **Verification**: Only images accepted

## Troubleshooting

### Heading buttons don't work
- **Solution**: Clear browser cache and reload
- **Check**: Editor is focused before clicking button
- **Verify**: StarterKit heading configuration is enabled

### Lists not appearing
- **Solution**: Ensure you click button first, then start typing
- **Alternative**: Type text first, then select and click button
- **Check**: bulletList and orderedList are configured

### Images not uploading
- **Solution**: Check internet connection
- **Check**: API endpoint `/api/upload` is responding
- **Verify**: Cloudinary credentials are set
- **Fallback**: Use "Image from URL" instead

### Markdown not converting
- **Solution**: Ensure markdown format is recognized
- **Check**: Using proper markdown syntax
- **Verify**: isMarkdownContent detection is working

## Success Indicators

When all tests pass, you'll see:

✅ All heading levels (H1, H2, H3) work  
✅ Both bullet and numbered lists work  
✅ Buttons highlight when active  
✅ Formatting applies instantly  
✅ Images upload and display  
✅ Markdown converts properly  
✅ Tables insert and are editable  
✅ Links are clickable  
✅ Colors apply correctly  
✅ Undo/Redo work  
✅ Posts save with all content  
✅ Published posts display correctly  
✅ Mobile responsive  
✅ Browser compatible  
✅ No console errors  

## Final Verification

Run this in browser console when in editor:
```javascript
// Check if editor is initialized
console.log('Editor active:', !!editor);

// Test a heading
editor.chain().focus().toggleHeading({ level: 1 }).run();
console.log('H1 test:', editor.isActive('heading', { level: 1 }));

// Test a list
editor.chain().focus().toggleBulletList().run();
console.log('Bullet list test:', editor.isActive('bulletList'));
```

If all these return `true`, the editor is fully functional!
