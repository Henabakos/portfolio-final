/**
 * Calculate estimated reading time for blog content
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(htmlContent: string): number {
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, "");
  
  // Count words (split by whitespace)
  const words = plainText.trim().split(/\s+/).length;
  
  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}
