-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "blog_posts_published_publishedAt_idx" ON "blog_posts"("published", "publishedAt");
CREATE INDEX IF NOT EXISTS "blog_posts_category_idx" ON "blog_posts"("category");
CREATE INDEX IF NOT EXISTS "blog_posts_featured_idx" ON "blog_posts"("featured");

CREATE TABLE IF NOT EXISTS "blog_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "blog_comments_postId_idx" ON "blog_comments"("postId");
