/**
 * Interface for extracted heading data
 */
export interface Heading {
  id: string;
  level: number;
  text: string;
}

/**
 * Extract headings from HTML content
 * Generates unique IDs for each heading for anchor linking
 */
export function extractHeadings(htmlContent: string): Heading[] {
  const headings: Heading[] = [];
  const headingRegex = /<h([1-6])(?:[^>]*)>(.*?)<\/h\1>/g;
  
  let match;
  const usedIds = new Set<string>();
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2];
    
    // Remove any HTML tags from heading text
    const text = rawText.replace(/<[^>]*>/g, "").trim();
    
    if (text) {
      // Generate unique ID from heading text
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      // Ensure uniqueness
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`;
        counter++;
      }
      
      usedIds.add(uniqueId);
      
      headings.push({
        id: uniqueId,
        level,
        text,
      });
    }
  }
  
  return headings;
}

/**
 * Add IDs to headings in HTML content for anchor linking
 */
export function addHeadingIds(htmlContent: string): string {
  const headingRegex = /<h([1-6])(?:[^>]*)>(.*?)<\/h\1>/g;
  const usedIds = new Set<string>();
  
  return htmlContent.replace(
    headingRegex,
    (_match, level: string, content: string) => {
      const text = content.replace(/<[^>]*>/g, "").trim();
      
      if (!text) return _match;
      
      // Generate unique ID
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`;
        counter++;
      }
      
      usedIds.add(uniqueId);
      
      return `<h${level} id="${uniqueId}">${content}</h${level}>`;
    }
  );
}
