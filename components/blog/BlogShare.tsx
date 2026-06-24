"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Linkedin, Facebook } from "lucide-react";
import { toast } from "sonner";

interface BlogShareProps {
  title: string;
  url: string;
}

export function BlogShare({ title, url }: BlogShareProps) {
  const [shareUrl] = useState(url);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      icon: Share2,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: Linkedin,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: Facebook,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">Share this article</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
          onClick={copyLink}
          aria-label="Copy link"
        >
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
        {shareLinks.map(({ label, href, icon: Icon }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`}>
              <Icon className="h-4 w-4" />
              {label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
