import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";

export const metadata: Metadata = {
  title: "Blog | Henok Assefa",
  description:
    "Articles on design, development, and building products on the web. Tutorials, opinions, and insights.",
  openGraph: {
    title: "Blog | Henok Assefa",
    description:
      "Articles on design, development, and building products on the web.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Henok Assefa",
    description:
      "Articles on design, development, and building products on the web.",
  },
};

export default function BlogPage() {
  return <BlogListing />;
}
