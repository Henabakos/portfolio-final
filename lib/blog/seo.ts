import type { Metadata } from "next";
import type { BlogPost } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://henokassefa.com";

export function getBlogPostUrl(slug: string) {
  return `${baseUrl}/blog/${slug}`;
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription ||
    post.excerpt ||
    post.subtitle ||
    `Read ${post.title} on the blog.`;
  const url = getBlogPostUrl(post.slug);
  const image = post.coverImage || `${baseUrl}/blog-img.svg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildBlogJsonLd(post: BlogPost) {
  const url = getBlogPostUrl(post.slug);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.subtitle,
    image: post.coverImage,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Henok Assefa",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    url,
  };
}
