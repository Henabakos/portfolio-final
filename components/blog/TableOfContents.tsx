"use client";

import React, { useState, useEffect } from "react";
import { extractHeadings, type Heading } from "./utils/headingParser";
import { ChevronDown } from "lucide-react";

interface TableOfContentsProps {
  htmlContent: string;
  className?: string;
}

export function TableOfContents({
  htmlContent,
  className = "",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    const extracted = extractHeadings(htmlContent);
    // Only show h2 and h3 headings in TOC
    const filtered = extracted.filter((h) => h.level <= 4);
    setHeadings(filtered);
  }, [htmlContent]);

  useEffect(() => {
    // Highlight current heading based on scroll position
    const handleScroll = () => {
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveHeading(heading.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveHeading(id);
      setExpandedMobile(false);
    }
  };

  return (
    <>
      {/* Mobile TOC - Collapsible */}
      <div className={`lg:hidden mb-6 ${className}`}>
        <button
          onClick={() => setExpandedMobile(!expandedMobile)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        >
          <span className="font-semibold text-foreground">Table of Contents</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedMobile ? "rotate-180" : ""}`}
          />
        </button>

        {expandedMobile && (
          <div className="mt-2 p-4 rounded-lg border border-border bg-card space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleLinkClick(heading.id)}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  activeHeading === heading.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                } ${heading.level === 3 ? "ml-4 text-sm" : ""}`}
              >
                {heading.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop TOC - Sticky Sidebar */}
      <aside className={`hidden lg:block sticky top-24 ${className}`}>
        <div className="space-y-3 p-4 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-sm text-foreground">
            Table of Contents
          </h3>
          <nav className="space-y-2 text-sm">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleLinkClick(heading.id)}
                className={`block w-full text-left px-3 py-1.5 rounded transition-colors ${
                  activeHeading === heading.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${heading.level === 3 ? "ml-4 text-xs" : ""}`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
