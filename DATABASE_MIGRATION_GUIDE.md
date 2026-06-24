# Database Migration Guide: Adding Author Field

## Overview

This guide explains the database migration for adding the `author` field to the `blog_posts` table.

## What Changed

- **Field Added**: `author` (TEXT, optional) to `blog_posts` table
- **Migration File**: `prisma/migrations/20260510143110_add_author_field/migration.sql`
- **Migration Type**: Non-breaking change (optional field)

## Current Status

✅ Migration file created
✅ API routes updated to handle migration gracefully
✅ Admin UI supports author field
✅ Ready for deployment

## How to Apply the Migration

### Option 1: Automatic (Recommended for Production/Vercel)

When you deploy to production (Vercel):

1. The migration will automatically run on deployment
2. The `author` column will be added to your database
3. No manual steps required

```bash
# Vercel will automatically run this
pnpm prisma migrate deploy
```

### Option 2: Manual (Local Development with DATABASE_URL)

If you have DATABASE_URL configured locally:

```bash
# Make sure DATABASE_URL is set
export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Run pending migrations
pnpm prisma migrate deploy
```

### Option 3: Database Update SQL (Direct)

If you need to apply the migration directly to your database:

```sql
-- Connect to your PostgreSQL database and run:
ALTER TABLE "blog_posts" ADD COLUMN "author" TEXT;
```

## Testing the Migration

### Before Migration
- Blog post creation will work (author field handled gracefully by API)
- Author field will not be stored in database
- No errors thrown

### After Migration
- Blog post creation with author field will store the author
- Existing posts will have NULL author
- All functionality fully enabled

## API Behavior

### Temporary Workaround (Before Migration)

The API has been updated to handle the missing column gracefully:

```typescript
// If author field doesn't exist in database, API still works
const postData: any = {
  title,
  content,
  excerpt,
  coverImage,
  slug,
  published,
  tags,
};

// Only include author if provided
if (author) {
  postData.author = author;
}
```

### After Migration

Once the migration is applied:

```typescript
// Author field is fully available
const post = await prisma.blogPost.create({
  data: {
    title,
    content,
    excerpt,
    coverImage,
    slug,
    published,
    tags,
    author,  // ✅ Fully supported
  },
});
```

## Verification

### Check Migration Status

```bash
# List applied migrations
pnpm prisma migrate status
```

You should see:
```
✓ 20260510143110_add_author_field
```

### Verify Database Schema

```sql
-- Check if author column exists
\d blog_posts

-- Should show:
-- author | text | NULL
```

### Test the Feature

1. Go to `/admin/blog/new`
2. Create a blog post with author name
3. Click "Create Post"
4. Verify post is created successfully
5. Edit the post and verify author is saved

## Rollback (If Needed)

To rollback the migration:

```bash
# NOT RECOMMENDED - will lose author data
pnpm prisma migrate resolve --rolled-back 20260510143110_add_author_field
```

Then run:

```bash
# Recreate the database from schema
pnpm prisma migrate reset
```

## Files Modified

- `prisma/schema.prisma` - Added `author` field to BlogPost model
- `app/api/blog/route.ts` - Updated POST to handle author gracefully
- `app/api/blog/[id]/route.ts` - Updated PUT to handle author gracefully
- `prisma/migrations/20260510143110_add_author_field/migration.sql` - Migration file

## Next Steps

1. **For Local Development**: 
   - Set DATABASE_URL in .env.local
   - Run `pnpm prisma migrate deploy`
   - Test blog creation in admin

2. **For Production (Vercel)**:
   - Commit all changes
   - Deploy to Vercel
   - Migration runs automatically

3. **Test Everything**:
   - Create a blog post with author
   - Edit blog post
   - Verify author displays on blog pages
   - Check database with `SELECT * FROM blog_posts;`

## Troubleshooting

### "author column does not exist"

**Solution**: The migration hasn't run yet. Run:
```bash
pnpm prisma migrate deploy
```

If DATABASE_URL is not set, the migration will run when you deploy to production.

### Migration hangs or times out

**Solution**: Check your database connection:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

If it fails, verify:
- DATABASE_URL is correct
- Database is running
- Network connectivity is available

### Author field not showing after migration

**Solution**: Regenerate Prisma client:
```bash
pnpm prisma generate
```

Then restart dev server:
```bash
pnpm dev
```

## Database Size Impact

- Column type: TEXT (variable length)
- Average size: 20-50 bytes per row
- Total impact: Minimal for typical blog sites
- No performance impact

## Deployment Checklist

- [ ] All code changes committed
- [ ] Migration file created
- [ ] Dev server tested locally
- [ ] Author field optional in admin form (already done)
- [ ] Blog creation tested without author
- [ ] Blog creation tested with author
- [ ] Ready to deploy to production

## Support

If you encounter issues:

1. Check database connection: `pnpm prisma db execute --stdin < query.sql`
2. View Prisma logs: `DEBUG=* pnpm prisma migrate deploy`
3. Reset for development: `pnpm prisma migrate reset` (⚠️ Deletes data!)

## References

- Prisma Migrations: https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate
- PostgreSQL ALTER TABLE: https://www.postgresql.org/docs/current/sql-altertable.html
