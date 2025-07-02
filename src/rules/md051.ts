import { Rule } from './rule-interface';

/**
 * MD051: Link fragments should be valid
 * 
 * This rule is triggered when a link fragment doesn't match any of the 
 * anchor IDs generated from the headings in the document.
 * 
 * For this rule, our fix will strip invalid fragments from links when they can't be resolved.
 */
export const name = 'MD051';
export const description = 'Link fragments should be valid';

/**
 * Fix invalid link fragments by removing them
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with valid link fragments
 */
export function fix(lines: string[]): string[] {
  // First, extract all headings to get valid fragment IDs
  const headingIds = extractHeadingIds(lines);
  
  // Then fix links with invalid fragments
  return lines.map(line => {
    // Match links with fragments: [text](#fragment)
    return line.replace(/\[([^\]]+)\]\(([^)]+)(#[^)]+)\)/g, (match, text, url, fragment) => {
      const fragmentId = fragment.substring(1); // Remove the # character
      
      // Check if the fragment is valid
      if (headingIds.includes(fragmentId)) {
        return match; // Fragment is valid, keep as is
      }
      
      // Fragment is invalid, remove it
      return `[${text}](${url})`;
    });
  });
}

/**
 * Extract heading IDs from the document
 * These are usually lowercase versions of the heading text with spaces replaced by hyphens
 */
function extractHeadingIds(lines: string[]): string[] {
  const headingIds: string[] = [];
  
  // Regular expression to match ATX headings (# Heading)
  const atxHeadingRegex = /^#{1,6}\s+(.+?)(?:\s+#{1,6})?$/;
  
  for (const line of lines) {
    const match = line.match(atxHeadingRegex);
    if (match) {
      const headingText = match[1].trim();
      const headingId = headingText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-'); // Replace spaces with hyphens
      
      headingIds.push(headingId);
    }
  }
  
  return headingIds;
}

/**
 * Rule implementation for MD051
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
