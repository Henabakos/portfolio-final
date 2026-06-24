"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { FaUpwork } from "react-icons/fa6";
import type { Testimonial } from "@/lib/testimonials/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  className?: string;
}

function PlatformBadge({ platform }: { platform?: string | null }) {
  const isUpwork = platform?.toLowerCase() === "upwork";

  if (isUpwork) {
    return (
      <Badge className="bg-[#14a800] hover:bg-[#14a800]/90 text-white gap-1.5 px-2.5 py-1">
        <FaUpwork className="h-3.5 w-3.5" aria-hidden="true" />
        Upwork
      </Badge>
    );
  }

  if (!platform) return null;

  return (
    <Badge variant="secondary" className="gap-1">
      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
      {platform}
    </Badge>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onScreenshotClick,
}: {
  testimonial: Testimonial;
  onScreenshotClick: (src: string, alt: string) => void;
}) {
  const hasScreenshot = Boolean(testimonial.screenshot);

  return (
    <Card className="overflow-hidden border border-gray-100/80 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F] hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group h-full flex flex-col pt-1">
      <CardContent className="p-0 flex flex-col h-full">
        {hasScreenshot ? (
          <button
            type="button"
            onClick={() =>
              onScreenshotClick(
                testimonial.screenshot!,
                `${testimonial.name} — ${testimonial.platform || "client"} review`
              )
            }
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-muted overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`View ${testimonial.name}'s review screenshot`}
          >
            <Image
              src={testimonial.screenshot!}
              alt={`${testimonial.name} client review on ${testimonial.platform || "Upwork"}`}
              fill
              className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500 p-1 rounded-sm"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/50 to-transparent">
              <PlatformBadge platform={testimonial.platform} />
              <span className="text-white/90 text-xs font-medium px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                Tap to enlarge
              </span>
            </div>
          </button>
        ) : (
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#14a800]/10 to-muted flex items-center justify-center p-6">
            <Quote className="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
          </div>
        )}

        <div className="p-5 sm:p-6 flex flex-col flex-1 gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <StarRating rating={testimonial.rating} />
              {testimonial.projectTitle && (
                <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wide">
                  {testimonial.projectTitle}
                </p>
              )}
            </div>
            {!hasScreenshot && <PlatformBadge platform={testimonial.platform} />}
          </div>

          <blockquote className="flex-1">
            <p className="text-[15px] sm:text-base leading-relaxed text-foreground/90 line-clamp-4">
              &ldquo;{testimonial.content}&rdquo;
            </p>
          </blockquote>

          <footer className="flex items-center gap-3 pt-3 border-t border-border/60">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {testimonial.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {testimonial.position}
              </p>
            </div>
            {testimonial.platform && (
              <p className="ml-auto text-xs text-muted-foreground hidden sm:block">
                Verified on {testimonial.platform}
              </p>
            )}
          </footer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection({
  testimonials: rawTestimonials,
  className = "",
}: TestimonialsSectionProps) {
  const testimonials = Array.isArray(rawTestimonials) ? rawTestimonials : [];

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const upworkCount = testimonials.filter(
    (t) => t.platform?.toLowerCase() === "upwork"
  ).length;

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      className={`mb-20 mt-10 ${className}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2 text-[#14a800]">
            <FaUpwork className="h-6 w-6" aria-hidden="true" />
            {upworkCount > 0 && (
              <Badge
                variant="outline"
                className="border-[#14a800]/30 text-[#14a800] dark:text-[#6ddb4e]"
              >
                {upworkCount} Upwork review{upworkCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
        <h2
          id="testimonials-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground dark:text-[#CDD0DA] mb-3"
        >
          What Clients Say About Me
        </h2>
        <p className="text-muted-foreground dark:text-[#858B9B] text-base sm:text-lg max-w-2xl">
          Real feedback from clients I&apos;ve worked with on Upwork and beyond —
          including screenshots of their reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            onScreenshotClick={(src, alt) => setLightbox({ src, alt })}
          />
        ))}
      </div>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-1">
          <DialogTitle className="sr-only">Client review screenshot</DialogTitle>
          {lightbox && (
            <div className="relative w-full max-h-[85vh] overflow-auto rounded-sm">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full h-auto rounded-sm"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
