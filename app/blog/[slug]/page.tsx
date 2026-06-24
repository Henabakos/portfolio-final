import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { findBlogPostBySlugOrId } from "@/lib/blog/queries";
import { buildBlogPostMetadata, buildBlogJsonLd, getBlogPostUrl } from "@/lib/blog/seo";
import { BlogPostView } from "@/components/blog/BlogPostView";

const CUID_PATTERN = /^c[a-z0-9]{24}$/i;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPostBySlugOrId(slug, false);
  if (!post) return { title: "Article not found" };
  return buildBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Redirect legacy ID-based URLs to slug URLs for SEO
  if (CUID_PATTERN.test(slug)) {
    const post = await findBlogPostBySlugOrId(slug, false);
    if (post) redirect(`/blog/${post.slug}`);
    notFound();
  }

  const post = await findBlogPostBySlugOrId(slug, false);
  if (!post) notFound();

  const jsonLd = buildBlogJsonLd(post);
  const shareUrl = getBlogPostUrl(post.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostView slug={post.slug} shareUrl={shareUrl} />
    </>
  );
}
